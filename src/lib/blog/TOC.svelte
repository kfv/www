<script>
  import { onMount } from 'svelte';
  import './TOC.css';

  export let sections = [];

  let activeSection = sections.length ? sections[0].id : '';

  const TRIGGER_OFFSET_PX = 120;
  const TRIGGER_RATIO = 0.2;

  function getTriggerLine() {
    if (typeof window === 'undefined') return 0;
    const max = window.innerHeight * TRIGGER_RATIO;
    return Math.min(TRIGGER_OFFSET_PX, max);
  }

  function computeActiveSection() {
    if (!sections.length) return;

    const trigger = getTriggerLine();
    const elements = sections
      .map(s => ({ id: s.id, el: document.getElementById(s.id) }))
      .filter(({ el }) => el);

    if (elements.length === 0) return;

    const last = elements[elements.length - 1];
    const lastRect = last.el.getBoundingClientRect();
    const viewportBottom = window.innerHeight;

    if (lastRect.bottom <= viewportBottom + 1) {
      activeSection = last.id;
      return;
    }

    let active = elements[0].id;
    for (const { id, el } of elements) {
      const top = el.getBoundingClientRect().top;
      if (top <= trigger) active = id;
    }
    activeSection = active;
  }

  onMount(() => {
    let rafId = null;

    const onScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        computeActiveSection();
        rafId = null;
      });
    };

    requestAnimationFrame(() => computeActiveSection());
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  });
</script>

<div class="toc-sticky-wrapper">
  <aside class="toc-container">
    <ul>
      {#each sections as section}
        <li>
          <a href="#{section.id}" class:active={activeSection === section.id}>
            {section.title}
          </a>
        </li>
      {/each}
    </ul>
  </aside>
</div>
