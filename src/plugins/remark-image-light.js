// @ts-nocheck
/**
 * Remark plugin that transforms :::image-light container directives into
 * a <div class="doc-image-light"> wrapper.
 *
 * Usage in MDX:
 *
 *   :::image-light
 *   ![alt text](./img/my-diagram.png)
 *   :::
 *
 * The wrapper applies a light background to images in dark mode AND light mode,
 * which is useful for diagrams with transparent backgrounds.
 *
 * Requires `remark-directive` to be registered before this plugin.
 */

const { visit } = require('unist-util-visit');

/** @type {import('unified').Plugin} */
function remarkImageLight() {
  return (tree) => {
    visit(tree, (node) => {
      if (node.type === 'containerDirective' && node.name === 'image-light') {
        const data = node.data || (node.data = {});
        // Render as a <div> with the CSS class
        data.hName = 'div';
        data.hProperties = {
          className: ['doc-image-light'],
          ...(node.attributes || {}),
        };
      }
    });
  };
}

module.exports = remarkImageLight;