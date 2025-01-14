var t = [],
  e = [
    "hljs-tag",
    "hljs-name",
    "hljs-attr",
    "hljs-string",
    "hljs-attribute",
    "hljs-selector-pseudo",
  ],
  n = function (e) {
    e.setAttribute("contentEditable", "true");

    // Find the associated section and ensure it has an ID
    var section = e.closest("section");
    var sectionId = section.id || `section-${Date.now()}`;
    section.id = sectionId;

    // Find the data-edit container
    var n = section.querySelector("[data-edit]");
    var hiddenCodeBlock = section.querySelector(".hidden-code-block");

    if (n) {
      var updateDataEdit = function () {
        var visibleContent = e.textContent;
        var hiddenContent = hiddenCodeBlock ? hiddenCodeBlock.textContent : "";

        // Combine content and display in data-edit
        n.innerHTML = `
          ${visibleContent}
          ${hiddenContent}
        `;

        // Extract <style> block and scope its CSS by prepending the section ID
        var styleBlock = section.querySelector("style");
        if (styleBlock) {
          var styleContent = styleBlock.innerHTML.trim();

          // Prepend the section ID to each CSS selector
          var scopedStyle = styleContent.replace(
            /(^|\s)([a-zA-Z.#][^,{]*)/g,
            (match, prefix, selector) =>
              `${prefix}#${sectionId} ${selector.trim()}`
          );

          // Remove any existing scoped style for this section
          var existingScopedStyle = document.getElementById(
            `scoped-style-${sectionId}`
          );
          if (existingScopedStyle) existingScopedStyle.remove();

          // Create a new <style> element and append it to the head
          var newStyle = document.createElement("style");
          newStyle.id = `scoped-style-${sectionId}`;
          newStyle.innerHTML = scopedStyle;
          document.head.appendChild(newStyle);
        }
      };

      e.addEventListener("keyup", updateDataEdit);
      if (hiddenCodeBlock)
        hiddenCodeBlock.addEventListener("keyup", updateDataEdit);

      updateDataEdit();

      t.push(e);
      if (hiddenCodeBlock) t.push(hiddenCodeBlock);
    }
  },
  i = {
    id: "editor",
    init: function (t) {
      t.getRevealElement().addEventListener("click", function (t) {
        var i = t.target;
        if (
          (i.classList.contains("hljs") &&
            null === i.getAttribute("contentEditable") &&
            n(i),
          Array.from(i.classList).some(function (t) {
            return e.includes(t);
          }))
        ) {
          var r = i.closest(".hljs");
          null === r.getAttribute("contentEditable") && n(r);
        }
      });
    },
    destroy: function () {
      t.forEach(function (t) {
        t.removeAttribute("contentEditable"), t.removeEventListener("keyup");
      });
    },
  },
  r = function () {
    return i;
  };
export { r as default };
