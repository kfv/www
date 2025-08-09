<script>
  import { onMount } from 'svelte';
  export let sections = [];

  let activeSection = sections.length ? sections[0].id : '';

  onMount(() => {
    const observer = new IntersectionObserver(
      entries => {
        let sectionInView = '';

        entries.forEach(entry => {
          if (entry.isIntersecting) {
            console.log('Section in view:', entry.target.id);
            console.log('Section in ratio:', entry.intersectionRatio);
            sectionInView = entry.target.id;
          }
        });

        if (sectionInView) activeSection = sectionInView;
      },
      {
        rootMargin: '-10% 25% -75% 25%',
        threshold: 0,
      }
    );

    sections.forEach(section => {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    });

    return () => {
      sections.forEach(section => {
        const element = document.getElementById(section.id);
        if (element) observer.unobserve(element);
      });
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

<style>
  .toc-sticky-wrapper {
    position: sticky;
    top: 1.25rem;
  }

  .toc-container {
    width: 100%;
    border-left: 1px solid #e5e7eb;
    padding-left: 1rem;
    color: #6b7280;
  }

  .toc-container a {
    display: block;
    padding-top: 0.25rem;
    padding-bottom: 0.25rem;
    transition: all 0.3s;
  }

  .toc-container a.active {
    font-weight: 700;
    color: #000;
  }

  :global(.dark) .toc-container a.active {
    color: #fff;
  }

  /* Medium screens and up */
  @media (min-width: 768px) {
    .toc-sticky-wrapper {
      top: 1.25rem;
    }

    .toc-container {
      position: absolute;
      left: -10rem;
      width: 10rem;
    }

    .toc-container a.active {
      color: #000;
    }
  }
</style>
