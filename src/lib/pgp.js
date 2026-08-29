import { createHash } from 'node:crypto';
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const PUBLIC_KEY_TAG = 6;
const SIGNATURE_TAG = 2;
const KEY_REVOCATION = 0x20;

export function formatFingerprint(hex) {
  const clean = hex.replace(/[^0-9a-fA-F]/g, '').toUpperCase();
  const groups = clean.match(/.{1,4}/g) ?? [];
  const mid = Math.ceil(groups.length / 2);
  return `${groups.slice(0, mid).join(' ')}  ${groups.slice(mid).join(' ')}`;
}

function decodeArmor(armored) {
  const lines = armored.replace(/\r\n/g, '\n').split('\n');
  const body = [];
  let inBody = false;

  for (const line of lines) {
    if (line.startsWith('-----BEGIN')) {
      inBody = true;
      continue;
    }
    if (line.startsWith('-----END')) break;
    if (!inBody) continue;
    if (
      line.startsWith('Comment:') ||
      line.startsWith('Version:') ||
      line.startsWith('Hash:') ||
      line.startsWith('Charset:')
    ) {
      continue;
    }
    if (line.startsWith('=') || !line.trim()) continue;
    body.push(line.trim());
  }

  return Buffer.from(body.join(''), 'base64');
}

function readNewLength(buf, offset) {
  const first = buf[offset];
  if (first < 192) return { length: first, size: 1 };
  if (first < 224) {
    return { length: (first - 192) * 256 + buf[offset + 1] + 192, size: 2 };
  }
  if (first === 255) {
    return { length: buf.readUInt32BE(offset + 1), size: 5 };
  }
  throw new Error('partial packet lengths are not supported');
}

function readOldLength(buf, offset, type) {
  if (type === 0) return { length: buf[offset], size: 1 };
  if (type === 1) return { length: buf.readUInt16BE(offset), size: 2 };
  if (type === 2) return { length: buf.readUInt32BE(offset), size: 4 };
  throw new Error('indeterminate packet length is not supported');
}

function readPackets(buf) {
  const packets = [];
  let i = 0;

  while (i < buf.length) {
    const first = buf[i];
    if ((first & 0x80) === 0) break;

    let tag;
    let length;
    let header = 1;

    if (first & 0x40) {
      tag = first & 0x3f;
      const len = readNewLength(buf, i + 1);
      header += len.size;
      length = len.length;
    } else {
      tag = (first >> 2) & 0x0f;
      const len = readOldLength(buf, i + 1, first & 0x03);
      header += len.size;
      length = len.length;
    }

    const start = i + header;
    packets.push({ tag, body: buf.subarray(start, start + length) });
    i = start + length;
  }

  return packets;
}

function v4Fingerprint(body) {
  const header = Buffer.alloc(3);
  header[0] = 0x99;
  header.writeUInt16BE(body.length, 1);
  return createHash('sha1')
    .update(header)
    .update(body)
    .digest('hex')
    .toUpperCase();
}

export function inspectKey(armored) {
  const packets = readPackets(decodeArmor(armored));
  const primary = packets.find(packet => packet.tag === PUBLIC_KEY_TAG);
  if (!primary || primary.body[0] !== 4) {
    throw new Error('no OpenPGP v4 primary key packet');
  }

  const fingerprint = v4Fingerprint(primary.body);
  const created = primary.body.readUInt32BE(1);
  const revoked = packets.some(
    packet =>
      packet.tag === SIGNATURE_TAG &&
      packet.body.length > 1 &&
      packet.body[0] >= 4 &&
      packet.body[1] === KEY_REVOCATION
  );

  return { fingerprint, created, revoked };
}

export async function loadPublicKeys(dir = join(process.cwd(), 'static/pgp')) {
  let names = [];
  try {
    names = (await readdir(dir)).filter(name => name.endsWith('.asc'));
  } catch (error) {
    if (error && error.code === 'ENOENT') return [];
    throw error;
  }

  const keys = await Promise.all(
    names.map(async name => {
      const armored = (await readFile(join(dir, name), 'utf8')).trim();
      const meta = inspectKey(armored);
      return {
        file: name,
        fingerprint: meta.fingerprint,
        label: formatFingerprint(meta.fingerprint),
        created: meta.created,
        revoked: meta.revoked,
        armored,
      };
    })
  );

  keys.sort((a, b) => b.created - a.created || a.fingerprint.localeCompare(b.fingerprint));
  return keys;
}
