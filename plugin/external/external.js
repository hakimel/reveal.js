// external.js – Updated for modern Reveal.js (v4+)
// This plugin loads external HTML fragments into your presentation by looking for
// elements with the data-external or data-external-replace attributes.
//
// Usage: In your Reveal.initialize config, include this plugin.
// For example:
//   import External from "./plugin/external/external.js";
//   Reveal.initialize({
//     plugins: [RevealMarkdown, RevealHighlight, RevealNotes, Editor, External]
//   });

const External = {
  id: "external",

  init: function (reveal) {
    "use strict";
    // Get configuration from the Reveal instance.
    // In modern Reveal.js, configuration is passed to Reveal.initialize.
    // We check if the config has an "external" property; if not, use defaults.
    const config = reveal.getConfig ? reveal.getConfig() : {};
    config.external = config.external || {};
    const options = {
      async: !!config.external.async, // default false
      mapAttributes: Array.isArray(config.external.mapAttributes)
        ? config.external.mapAttributes
        : config.external.mapAttributes
        ? ["src"]
        : [],
    };

    // Helper: Parse a node’s data-external or data-external-replace attribute.
    function getTarget(node) {
      let url = node.getAttribute("data-external") || "";
      let isReplace = false;
      if (url === "") {
        url = node.getAttribute("data-external-replace") || "";
        isReplace = true;
      }
      if (url.length > 0) {
        const r = url.match(/^([^#]+)(?:#(.+))?/);
        return {
          url: r[1] || "",
          fragment: r[2] || "",
          isReplace: isReplace,
        };
      }
      return null;
    }

    // Helper: Convert a relative URL if needed.
    function convertUrl(src, path) {
      if (path !== "" && src.indexOf(".") === 0) {
        return path + "/" + src;
      }
      return src;
    }

    // Helper: Convert specified attributes (like src) on nodes
    function convertAttributes(attributeName, container, path) {
      const nodes = container.querySelectorAll("[" + attributeName + "]");
      if (container.getAttribute(attributeName)) {
        container.setAttribute(
          attributeName,
          convertUrl(container.getAttribute(attributeName), path)
        );
      }
      for (let i = 0; i < nodes.length; i++) {
        nodes[i].setAttribute(
          attributeName,
          convertUrl(nodes[i].getAttribute(attributeName), path)
        );
      }
    }

    // Helper: Convert URLs for all attributes we need to map.
    function convertUrls(container, path) {
      for (let i = 0; i < options.mapAttributes.length; i++) {
        convertAttributes(options.mapAttributes[i], container, path);
      }
    }

    // Update a section (or external target) with the loaded content.
    function updateSection(section, target, path) {
      const url = path !== "" ? path + "/" + target.url : target.url;
      const xhr = new XMLHttpRequest();

      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if (
            (xhr.status >= 200 && xhr.status < 300) ||
            (xhr.status === 0 && xhr.responseText !== "")
          ) {
            const basePath = url.substr(0, url.lastIndexOf("/"));
            const parser = new DOMParser();
            const htmlDoc = parser.parseFromString(
              xhr.responseText,
              "text/html"
            );
            let nodes;
            if (target.fragment !== "") {
              nodes = htmlDoc.querySelectorAll(target.fragment);
            } else {
              nodes = htmlDoc.querySelector("body").childNodes;
            }
            if (!target.isReplace) {
              section.innerHTML = "";
            }
            for (let i = 0; i < nodes.length; i++) {
              convertUrls(nodes[i], basePath);
              const node = document.importNode(nodes[i], true);
              if (target.isReplace) {
                section.parentNode.insertBefore(node, section);
              } else {
                section.appendChild(node);
              }
              // If the inserted node itself has external targets, process them.
              if (node instanceof Element) {
                loadExternal(node, basePath);
              }
            }
            if (target.isReplace) {
              section.parentNode.removeChild(section);
            }
            if (options.async) {
              reveal.sync();
              reveal.setState(reveal.getState());
            }
          } else {
            console.error(
              "ERROR: The attempt to fetch " +
                url +
                " failed with HTTP status " +
                xhr.status +
                "."
            );
          }
        }
      };

      xhr.open("GET", url, options.async);
      try {
        xhr.send();
      } catch (e) {
        console.error(
          "Failed to get the file " +
            url +
            ". Make sure that the presentation and the file are served by an HTTP server. " +
            e
        );
      }
    }

    // Recursively process external targets in a given container.
    function loadExternal(container, path) {
      path = typeof path === "undefined" ? "" : path;
      if (
        container instanceof Element &&
        (container.hasAttribute("data-external") ||
          container.hasAttribute("data-external-replace"))
      ) {
        const target = getTarget(container);
        if (target) {
          updateSection(container, target, path);
        }
      } else {
        const sections = container.querySelectorAll(
          "[data-external], [data-external-replace]"
        );
        for (let i = 0; i < sections.length; i++) {
          const section = sections[i];
          const target = getTarget(section);
          if (target) {
            updateSection(section, target, path);
          }
        }
      }
    }

    // Start by processing the whole document.
    loadExternal(document, "");
  },
};

export default External;
