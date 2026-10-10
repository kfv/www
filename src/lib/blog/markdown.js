// mdsvex hooks for blog posts.  These run in the preprocessor at build
// time; nothing here reaches the browser.

function text(node) {
  if (node.value !== undefined) return node.value;
  return (node.children || []).map(text).join('');
}

function slug(s) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// Script, style and svelte:* blocks must stay at the top level, or mdsvex
// won't hoist them out of the layout.
function hoisted(node) {
  return node.type === 'html' && /^<(script|style|svelte:)/.test(node.value);
}

// Wrap each `##` heading and what follows it, up to the next one, in a
// <section id="...">, and list them in the front matter as `sections` for
// the TOC.  The TOC tracks sections rather than headings: it marks the last
// one active once its bottom is on screen.
export function sections() {
  return (tree, file) => {
    const children = [];
    const toc = [];
    let section = null;

    for (const node of tree.children) {
      if (node.type === 'heading' && node.depth === 2) {
        const title = text(node);
        const id = slug(title);
        toc.push({ id, title });
        section = {
          type: 'section',
          data: { hName: 'section', hProperties: { id } },
          children: [node],
        };
        children.push(section);
      } else if (section && !hoisted(node)) {
        section.children.push(node);
      } else {
        children.push(node);
      }
    }

    tree.children = children;
    file.data.fm = { ...file.data.fm, sections: toc };
  };
}

// Render fenced code through CodeBlock, which the post layout exports.
// mdsvex imports a layout's exports as `Components`.
export function highlighter(code) {
  return `<Components.CodeBlock code={${JSON.stringify(code)}} />`;
}
