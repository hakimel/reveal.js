/**
 * A plugin which enables rendering of math equations inside
 * of reveal.js slides. Essentially a thin wrapper for KaTeX.
 *
 * @author Hakim El Hattab
 * @author Gerhard Burger
 */
export const KaTeX = () => {
  let deck;

  let defaultOptions = {
    version: "latest",
    delimiters: [
      { left: "$$", right: "$$", display: true }, // Note: $$ has to come before $
      { left: "$", right: "$", display: false },
      { left: "\\(", right: "\\)", display: false },
      { left: "\\[", right: "\\]", display: true },
    ],
    ignoredTags: ["script", "noscript", "style", "textarea", "pre"],
  };

  const loadCss = (src) => {
    let link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = src;
    document.head.appendChild(link);
  };

  /**
   * Loads a JavaScript file and returns a Promise for when it is loaded
   * Credits: https://aaronsmith.online/easily-load-an-external-script-using-javascript/
   */
  const loadScript = (src) => {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.onload = resolve;
      script.onerror = reject;
      script.src = src;
      document.head.append(script);
    });
  };

  async function loadScripts(urls) {
    for (const url of urls) {
      await loadScript(url);
    }
  }

  return {
    id: "katex",

    init: function (reveal) {
      deck = reveal;

      let revealOptions = deck.getConfig().katex || {};

      let options = { ...defaultOptions, ...revealOptions };
      const { local, version, extensions, ...katexOptions } = options;

      let baseUrl = options.local || "https://cdn.jsdelivr.net/npm/katex";
      let versionString = options.local ? "" : "@" + options.version;

      let cssUrl = baseUrl + versionString + "/dist/katex.min.css";
      let katexUrl = baseUrl + versionString + "/dist/katex.min.js";
      let mhchemUrl = baseUrl + versionString + "/dist/contrib/mhchem.min.js";
      let karUrl = baseUrl + versionString + "/dist/contrib/auto-render.min.js";

      let katexScripts = [katexUrl];
      if (options.extensions && options.extensions.includes("mhchem")) {
        katexScripts.push(mhchemUrl);
      }
      katexScripts.push(karUrl);

      const renderMath = () => {
        renderMathInElement(reveal.getSlidesElement(), katexOptions);
        deck.layout();
      };

      loadCss(cssUrl);

      // For some reason dynamically loading with defer attribute doesn't result in the expected behavior, the below code does
      loadScripts(katexScripts).then(() => {
        if (deck.isReady()) {
          renderMath();
        } else {
          deck.on("ready", renderMath.bind(this));
        }
      });
    },
  };
};
