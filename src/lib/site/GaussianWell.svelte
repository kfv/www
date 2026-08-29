<script>
  import { onMount } from 'svelte';
  import './GaussianWell.css';

  let well;

  onMount(() => {
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    const finePointer = window.matchMedia(
      '(hover: hover) and (pointer: fine)'
    ).matches;
    if (reduceMotion || !finePointer || !well) return;

    const damping = 0.1;
    let x = 0;
    let y = 0;
    let tx = 0;
    let ty = 0;
    let raf = 0;
    let running = false;
    let revealed = false;
    let lastClientX = 0;
    let lastClientY = 0;

    const setWell = () => {
      well.style.setProperty('--well-x', `${x}px`);
      well.style.setProperty('--well-y', `${y}px`);
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

    const aimAt = (clientX, clientY, snap) => {
      const next = localFromClient(clientX, clientY);
      tx = next.x;
      ty = next.y;
      if (snap) {
        x = tx;
        y = ty;
        setWell();
        running = false;
        if (raf) {
          cancelAnimationFrame(raf);
          raf = 0;
        }
        return;
      }
      if (!running) {
        running = true;
        raf = requestAnimationFrame(tick);
      }
    };

    const tick = () => {
      x += (tx - x) * damping;
      y += (ty - y) * damping;
      setWell();

      const dx = tx - x;
      const dy = ty - y;
      if (dx * dx + dy * dy > 0.04) {
        raf = requestAnimationFrame(tick);
        return;
      }

      x = tx;
      y = ty;
      setWell();
      running = false;
      raf = 0;
    };

    const onMove = event => {
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
      if (!revealed) return;
      aimAt(lastClientX, lastClientY, true);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('resize', onViewChange);
    window.visualViewport?.addEventListener('resize', onViewChange);
    window.visualViewport?.addEventListener('scroll', onViewChange);

    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('resize', onViewChange);
      window.visualViewport?.removeEventListener('resize', onViewChange);
      window.visualViewport?.removeEventListener('scroll', onViewChange);
      if (raf) cancelAnimationFrame(raf);
    };
  });
</script>

<div class="well" bind:this={well} aria-hidden="true"></div>
