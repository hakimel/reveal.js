// !(function (t, e) {
//   "object" == typeof exports && "undefined" != typeof module
//     ? (module.exports = e())
//     : "function" == typeof define && define.amd
//     ? define(e)
//     : ((t = "undefined" != typeof globalThis ? globalThis : t || self).Editor =
//         e());
// })(this, function () {
//   "use strict";
//   var t = [],
//     e = [
//       "hljs-tag",
//       "hljs-name",
//       "hljs-attr",
//       "hljs-string",
//       "hljs-attribute",
//       "hljs-selector-pseudo",
//     ],
//     n = function (e) {
//       e.setAttribute("contentEditable", "true");
//       var n = e.closest("section").querySelector("[data-edit]");
//       n &&
//         (e.addEventListener("keyup", function () {
//           var t = e.textContent;
//           n.innerHTML = t;
//         }),
//         t.push(e));
//     },
//     i = {
//       id: "editor",
//       init: function (t) {
//         t.getRevealElement().addEventListener("click", function (t) {
//           var i = t.target;
//           if (
//             (i.classList.contains("hljs") &&
//               null === i.getAttribute("contentEditable") &&
//               n(i),
//             Array.from(i.classList).some(function (t) {
//               return e.includes(t);
//             }))
//           ) {
//             var o = i.closest(".hljs");
//             null === o.getAttribute("contentEditable") && n(o);
//           }
//         });
//       },
//       destroy: function () {
//         t.forEach(function (t) {
//           t.removeAttribute("contentEditable"), t.removeEventListener("keyup");
//         });
//       },
//     };
//   return function () {
//     return i;
//   };
// });


(function (t, e) {
  if (typeof exports === "object" && typeof module !== "undefined") {
    module.exports = e();
  } else if (typeof define === "function" && define.amd) {
    define(e);
  } else {
    (t = typeof globalThis !== "undefined" ? globalThis : t || self).Editor = e();
  }
})(this, function () {
  "use strict";

  var t = [],
    e = [
      "hljs-tag",
      "hljs-name",
      "hljs-attr",
      "hljs-string",
      "hljs-attribute",
      "hljs-selector-pseudo"
    ];

  // var n = function (e) {
  //   e.setAttribute("contentEditable", "true");
  //   var n = e.closest("section").querySelector("[data-edit]");
  //   if (n) {
  //     e.addEventListener("keyup", function () {
  //       var t = e.textContent;
  //       n.innerHTML = t;
  //     });
  //     t.push(e);
  //   }
  // };
  var n = function(e) {
    e.setAttribute("contentEditable", "true");
    
    // Find the associated data-edit container
    var n = e.closest("section").querySelector("[data-edit]");
    
    // Find the hidden code block (optional)
    var hiddenCodeBlock = e.closest("section").querySelector(".hidden-code-block");
    
    if (n) {
      // Function to update data-edit with content from both blocks
      var updateDataEdit = function() {
        var visibleContent = e.textContent;
        var hiddenContent = hiddenCodeBlock ? hiddenCodeBlock.textContent : "";
        
        // Combine content (or handle differently if needed)
        n.innerHTML = `<pre><code>${visibleContent}</code></pre><pre><code>${hiddenContent}</code></pre>`;
      };
      
      // Add event listeners for both visible and hidden blocks
      e.addEventListener("keyup", updateDataEdit);
      
      if (hiddenCodeBlock) {
        hiddenCodeBlock.addEventListener("keyup", updateDataEdit);
      }
      
      // Initial update
      updateDataEdit();
      
      t.push(e);
      if (hiddenCodeBlock) t.push(hiddenCodeBlock);
    }
  };  

  var i = {
    id: "editor",
    init: function (t) {
      t.getRevealElement().addEventListener("click", function (t) {
        var i = t.target;
        if (
          i.classList.contains("hljs") &&
          i.getAttribute("contentEditable") === null
        ) {
          n(i);
        }
        if (
          Array.from(i.classList).some(function (t) {
            return e.includes(t);
          })
        ) {
          var o = i.closest(".hljs");
          if (o.getAttribute("contentEditable") === null) {
            n(o);
          }
        }
      });
    },
    destroy: function () {
      t.forEach(function (t) {
        t.removeAttribute("contentEditable");
        t.removeEventListener("keyup");
      });
    }
  };

  return function () {
    return i;
  };
});
