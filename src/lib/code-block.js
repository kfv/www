export function dedent(strings, ...values) {
  const fullString = strings.reduce(
    (acc, str, i) => acc + str + (values[i] || ''),
    ''
  );

  const match = fullString.match(/^[ \t]*(?=\S)/gm);
  if (!match) return fullString;

  const indent = Math.min(...match.map(el => el.length));
  const regexp = new RegExp('^[ \\t]{' + indent + '}', 'gm');
  const dedentedString =
    indent > 0 ? fullString.replace(regexp, '') : fullString;

  const lines = dedentedString.split('\n');
  if (lines[0].trim() === '') {
    lines.shift();
  }

  if (lines[lines.length - 1].trim() === '') {
    lines.pop();
  }

  return lines.join('\n');
}
