<script>
  import { onMount } from 'svelte';
  import './GaussianWell.css';

  let well;

  onMount(() => {
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (reduceMotion || !well) return;

    // Without a fine pointer there is nothing to follow, so the well only
    // shows up as the idle screensaver.
    const finePointer = window.matchMedia(
      '(hover: hover) and (pointer: fine)'
    ).matches;
    const idleTimeoutMs = ['localhost', '127.0.0.1', '[::1]'].includes(
      window.location.hostname
    )
      ? 5_000
      : 10_000;

    // Idle: the lit field spreads out from the well until every dot is at
    // FLOOR, and the well becomes a light source drifting on a slow
    // Lissajous path. It swells once per RING_EVERY seconds and sends a
    // wave of light out across the field. On wake the field gathers back
    // into the well, quickly (GATHER_TAU), and the waves go with it.
    // RING_LIFE is a multiple of RING_EVERY so the slots never overlap.
    const FLOOR = 0.3;
    const SPREAD_TAU = 1;
    const GATHER_TAU = 0.5;
    const RING_EVERY = 4;
    const RING_SLOTS = 3;
    const RING_LIFE = RING_EVERY * RING_SLOTS;
    const RING_PEAK = 0.6;

    // The old per-frame 0.1 at 60 Hz, as a time constant so it holds on
    // any refresh rate and keeps pace with GATHER_TAU.
    const FOLLOW_TAU = 0.16;
    let x = 0;
    let y = 0;
    let tx = 0;
    let ty = 0;
    let scale = 1;
    let spread = 0;
    let raf = 0;
    let last = 0;
    let revealed = false;
    let lastClientX = 0;
    let lastClientY = 0;

    let idle = false;
    let idleTimer = 0;
    let idleT = 0;
    let sinceRing = 0;
    let nextRing = 0;
    const rings = Array.from({ length: RING_SLOTS }, () => ({
      age: Infinity,
      x: 0,
      y: 0,
      reach: 0,
    }));

    const setWell = () => {
      well.style.setProperty('--well-x', `${x}px`);
      well.style.setProperty('--well-y', `${y}px`);
      well.style.setProperty('--well-s', `${scale}`);
      // At spread 1 the radius is the diagonal, which covers the whole
      // viewport from anywhere inside it.
      const reach = Math.hypot(well.offsetWidth, well.offsetHeight);
      well.style.setProperty('--floor', `${FLOOR * Math.min(1, spread * 4)}`);
      well.style.setProperty('--floor-r', `${spread * reach}px`);
    };

    const setRing = (i, r, a) => {
      const ring = rings[i];
      well.style.setProperty(`--r${i}-x`, `${ring.x}px`);
      well.style.setProperty(`--r${i}-y`, `${ring.y}px`);
      well.style.setProperty(`--r${i}-r`, `${r}px`);
      well.style.setProperty(`--r${i}-a`, `${a}`);
    };

    const localFromClient = (clientX, clientY) => {
      const rect = well.getBoundingClientRect();
      const scaleX = rect.width ? well.offsetWidth / rect.width : 1;
      const scaleY = rect.height ? well.offsetHeight / rect.height : 1;
      return {
        x: (clientX - rect.left) * scaleX,
        y: (clientY - rect.top) * scaleY,
      };
    };

    const start = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const aimAt = (clientX, clientY, snap) => {
      const next = localFromClient(clientX, clientY);
      tx = next.x;
      ty = next.y;
      if (snap) {
        x = tx;
        y = ty;
        setWell();
      }
      start();
    };

    const tick = now => {
      const dt = last ? Math.min((now - last) / 1000, 0.1) : 1 / 60;
      last = now;
      let busy = false;

      if (idle) {
        idleT += dt;
        const w = well.offsetWidth;
        const h = well.offsetHeight;
        tx = w / 2 + w * 0.3 * Math.sin(0.07 * idleT + Math.PI / 2);
        ty = h / 2 + h * 0.26 * Math.sin(0.11 * idleT);
        const k = 1 - Math.exp(-dt / 1.5);
        x += (tx - x) * k;
        y += (ty - y) * k;

        sinceRing += dt;
        if (sinceRing >= RING_EVERY) {
          sinceRing -= RING_EVERY;
          const ring = rings[nextRing];
          ring.age = 0;
          ring.x = x;
          ring.y = y;
          // Far enough to clear the furthest corner from anywhere inside.
          ring.reach = Math.hypot(w, h);
          nextRing = (nextRing + 1) % RING_SLOTS;
        }
        // Swell as each wave leaves, settle in between.
        scale = 1 + 0.1 * Math.cos((2 * Math.PI * sinceRing) / RING_EVERY);
        busy = true;
      } else {
        const k = 1 - Math.exp(-dt / FOLLOW_TAU);
        x += (tx - x) * k;
        y += (ty - y) * k;
        scale += (1 - scale) * k;
        const dx = tx - x;
        const dy = ty - y;
        if (dx * dx + dy * dy > 0.04 || Math.abs(1 - scale) > 0.001) {
          busy = true;
        } else {
          x = tx;
          y = ty;
          scale = 1;
        }
      }

      const spreadTarget = idle ? 1 : 0;
      const tau = idle ? SPREAD_TAU : GATHER_TAU;
      spread += (spreadTarget - spread) * (1 - Math.exp(-dt / tau));
      if (Math.abs(spreadTarget - spread) > 0.001) busy = true;
      else spread = spreadTarget;
      setWell();

      rings.forEach((ring, i) => {
        if (ring.age >= RING_LIFE) return;
        ring.age += dt;
        if (ring.age >= RING_LIFE || spread === 0) {
          ring.age = Infinity;
          setRing(i, 0, 0);
          return;
        }
        const p = ring.age / RING_LIFE;
        const a = RING_PEAK * spread * (1 - p * p) * Math.min(1, p * 8);
        setRing(i, p * ring.reach, a);
        busy = true;
      });

      if (busy) {
        raf = requestAnimationFrame(tick);
      } else {
        raf = 0;
        last = 0;
      }
    };

    const enterIdle = () => {
      if (idle) return;
      idle = true;
      idleT = 0;
      sinceRing = RING_EVERY;
      if (!revealed) {
        x = well.offsetWidth / 2;
        y = well.offsetHeight / 2;
        setWell();
        well.classList.add('on');
      }
      start();
    };

    const onActivity = () => {
      clearTimeout(idleTimer);
      idleTimer = setTimeout(enterIdle, idleTimeoutMs);
      if (!idle) return;
      idle = false;
      if (revealed) {
        aimAt(lastClientX, lastClientY, false);
      } else {
        well.classList.remove('on');
      }
    };

    const onMove = event => {
      onActivity();
      if (!finePointer) return;
      lastClientX = event.clientX;
      lastClientY = event.clientY;
      if (!revealed) {
        aimAt(lastClientX, lastClientY, true);
        well.classList.add('on');
        revealed = true;
        return;
      }
      aimAt(lastClientX, lastClientY, false);
    };

    const onViewChange = () => {
      if (!revealed || idle) return;
      aimAt(lastClientX, lastClientY, true);
    };

    const activity = ['pointerdown', 'keydown', 'wheel', 'scroll'];
    window.addEventListener('pointermove', onMove, { passive: true });
    activity.forEach(type =>
      window.addEventListener(type, onActivity, { passive: true })
    );
    window.addEventListener('resize', onViewChange);
    window.visualViewport?.addEventListener('resize', onViewChange);
    window.visualViewport?.addEventListener('scroll', onViewChange);
    idleTimer = setTimeout(enterIdle, idleTimeoutMs);

    return () => {
      window.removeEventListener('pointermove', onMove);
      activity.forEach(type => window.removeEventListener(type, onActivity));
      window.removeEventListener('resize', onViewChange);
      window.visualViewport?.removeEventListener('resize', onViewChange);
      window.visualViewport?.removeEventListener('scroll', onViewChange);
      clearTimeout(idleTimer);
      if (raf) cancelAnimationFrame(raf);
    };
  });
</script>

<div class="well" bind:this={well} aria-hidden="true"></div>
