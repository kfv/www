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
                        console.log("Section in view:", entry.target.id);
                        console.log("Section in ratio:", entry.intersectionRatio);
                        sectionInView = entry.target.id;
                    }
                });

                if (sectionInView) activeSection = sectionInView;
            },
            {
                rootMargin: '-10% 25% -75% 25%',
                threshold: 0
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

<style lang="postcss">
    .toc-sticky-wrapper {
        @apply sticky md:top-5;
    }
    .toc-container {
        @apply md:absolute md:-left-40 w-full md:w-40 border-l pl-4 text-neutral-500;
    }
    .toc-container a {
        @apply block py-1 transition-all duration-300;
    }
    .toc-container a.active {
        @apply md:font-bold md:dark:text-white md:text-black;
    }
</style>
