/* based on https://github.com/Microflash/remark-callout-directives */
/* inspired by https://github.com/withastro/starlight/blob/main/packages/starlight/integrations/asides.ts */

import { visit } from "unist-util-visit";
import { h } from "hastscript";

/**
 * adds callouts for asides just like starlight
 * you must add the respective .css file to the pages you use this on
 *
 * ```
 * :::tip[Tip Example]
 * example tip
 * :::
 * ```
 * supported callotus: note, tip, caution, danger and success
 * @see {@link callouts} to edit icons
 */
export default function astroStarlightRemarkAsides() {
  return (tree) => {
    visit(tree, (node) => {
      if (node.type === "containerDirective") {
        if (!callouts[node.name]) {
          return;
        }

        const callout = callouts[node.name];
        const data = node.data || (node.data = {});
        const { ...attributes } = node.attributes;
        // logic to support :::tip{title="title"} syntax and default to Tip for :::tip
        let title = node.attributes.title || callout.title;

        node.attributes = {
          ...attributes,
          class:
            "class" in attributes
              ? `callout callout-${node.name} ${attributes.class}`
              : `callout callout-${node.name}`,
        };

        // logic to support :::tip[title] syntax
        // remark-directive converts a container’s “label” to a paragraph at children[0] with the `directiveLabel` property set to true
        if (node.children[0].data?.directiveLabel) {
          title = node.children[0].children[0].value;
          node.children.shift();
        }

        node.children = generate(title, node.children, callout.icon);

        // TO DO: maybe get rid of h just make it set the classes in hProperties without needing hast
        const hast = h("aside", node.attributes);
        data.hName = hast.tagName;
        data.hProperties = hast.properties;
      }
    });
  };
}

const callouts = {
  note: {
    title: "Note",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" aria-hidden="true"><path d="M12 8h.01M12 12v4"/><circle cx="12" cy="12" r="10"/></svg>`,
  },
  success: {
    title: "Success",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" aria-hidden="true"><path d="m8 12 2.7 2.7L16 9.3"/><circle cx="12" cy="12" r="10"/></svg>`,
  },
  caution: {
    title: "Caution",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" aria-hidden="true"><path d="M12 9v4m0 4h.01M8.681 4.082C9.351 2.797 10.621 2 12 2s2.649.797 3.319 2.082l6.203 11.904a4.28 4.28 0 0 1-.046 4.019C20.793 21.241 19.549 22 18.203 22H5.797c-1.346 0-2.59-.759-3.273-1.995a4.28 4.28 0 0 1-.046-4.019L8.681 4.082Z"/></svg>`,
  },
  danger: {
    title: "Danger",
    icon: `<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden="true"><path d="M12 7C11.7348 7 11.4804 7.10536 11.2929 7.29289C11.1054 7.48043 11 7.73478 11 8V12C11 12.2652 11.1054 12.5196 11.2929 12.7071C11.4804 12.8946 11.7348 13 12 13C12.2652 13 12.5196 12.8946 12.7071 12.7071C12.8946 12.5196 13 12.2652 13 12V8C13 7.73478 12.8946 7.48043 12.7071 7.29289C12.5196 7.10536 12.2652 7 12 7ZM12 15C11.8022 15 11.6089 15.0586 11.4444 15.1685C11.28 15.2784 11.1518 15.4346 11.0761 15.6173C11.0004 15.8 10.9806 16.0011 11.0192 16.1951C11.0578 16.3891 11.153 16.5673 11.2929 16.7071C11.4327 16.847 11.6109 16.9422 11.8049 16.9808C11.9989 17.0194 12.2 16.9996 12.3827 16.9239C12.5654 16.8482 12.7216 16.72 12.8315 16.5556C12.9414 16.3911 13 16.1978 13 16C13 15.7348 12.8946 15.4804 12.7071 15.2929C12.5196 15.1054 12.2652 15 12 15ZM21.71 7.56L16.44 2.29C16.2484 2.10727 15.9948 2.00368 15.73 2H8.27C8.00523 2.00368 7.75163 2.10727 7.56 2.29L2.29 7.56C2.10727 7.75163 2.00368 8.00523 2 8.27V15.73C2.00368 15.9948 2.10727 16.2484 2.29 16.44L7.56 21.71C7.75163 21.8927 8.00523 21.9963 8.27 22H15.73C15.9948 21.9963 16.2484 21.8927 16.44 21.71L21.71 16.44C21.8927 16.2484 21.9963 15.9948 22 15.73V8.27C21.9963 8.00523 21.8927 7.75163 21.71 7.56ZM20 15.31L15.31 20H8.69L4 15.31V8.69L8.69 4H15.31L20 8.69V15.31Z"></path></svg>`,
  },
  tip: {
    title: "Tip",
    icon: `<svg viewBox="0 0 16 16" width="24" height="24" aria-hidden="true" fill="currentColor"><path d="M8 1.5c-2.363 0-4 1.69-4 3.75 0 .984.424 1.625.984 2.304l.214.253c.223.264.47.556.673.848.284.411.537.896.621 1.49a.75.75 0 0 1-1.484.211c-.04-.282-.163-.547-.37-.847a8.456 8.456 0 0 0-.542-.68c-.084-.1-.173-.205-.268-.32C3.201 7.75 2.5 6.766 2.5 5.25 2.5 2.31 4.863 0 8 0s5.5 2.31 5.5 5.25c0 1.516-.701 2.5-1.328 3.259-.095.115-.184.22-.268.319-.207.245-.383.453-.541.681-.208.3-.33.565-.37.847a.751.751 0 0 1-1.485-.212c.084-.593.337-1.078.621-1.489.203-.292.45-.584.673-.848.075-.088.147-.173.213-.253.561-.679.985-1.32.985-2.304 0-2.06-1.637-3.75-4-3.75ZM5.75 12h4.5a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1 0-1.5ZM6 15.25a.75.75 0 0 1 .75-.75h2.5a.75.75 0 0 1 0 1.5h-2.5a.75.75 0 0 1-.75-.75Z"></path></svg>`,
  },
};

function generate(title, children, icon) {
  const iconNode = {
    type: "html",
    value: icon,
  };

  const titleNode = {
    type: "paragraph",
    children: [
      {
        type: "text",
        value: title,
      },
    ],
    data: {
      hName: "span",
      hProperties: { className: ["callout-title"] },
    },
  };

  return [
    {
      type: "paragraph",
      data: {
        hName: "div",
        hProperties: { className: ["callout-indicator"] },
      },
      children: [iconNode, titleNode],
    },
    {
      type: "paragraph",
      data: {
        hName: "div",
        hProperties: { className: ["callout-content"] },
      },
      children,
    },
  ];
}
