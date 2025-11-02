class QuadrantMatrix extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });

    shadow.innerHTML = `
      <style>
        /* * :host allows styling the component element itself from the inside.
         * We set display: block because custom elements are inline by default.
         */
        :host {
          display: block; 
          width: 100%;
          height: 100%;
          font-family: sans-serif;
        }

        /* * This new wrapper uses CSS Grid to position the axis labels 
         * and the quadrant container.
         */
        .wrapper {
          display: grid;
          /* Rows: 1fr for matrix, 'auto' for x-axis label */
          grid-template-rows: 1fr auto;
          /* Columns: 'auto' for y-axis label, 1fr for matrix */
          grid-template-columns: auto 1fr;
          grid-template-areas:
            "y-axis matrix"
            "spacer x-axis";
          width: 100%;
          height: 100%;
          box-sizing: border-box;
        }

        .matrix-container {
          grid-area: matrix; /* Position it in the wrapper grid */
          display: grid;
          grid-template-columns: 1fr 1fr;
          grid-template-rows: 1fr 1fr;
          border: 1px solid #ccc;
          box-sizing: border-box;
        }

        .quadrant {
          padding: 10px;
          border: 1px solid #eee;
          display: flex;
          flex-direction: column; /* Stack content vertically */
          justify-content: center;
          align-items: center;
          text-align: center;
          box-sizing: border-box;
          overflow: auto;
        }

        .q1 { background-color: #f9f9f9; }
        .q2 { background-color: #f0f0f0; }
        .q3 { background-color: #e9e9e9; }
        .q4 { background-color: #e0e0e0; }

        /* Styles for the new axis labels */
        .axis {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 10px;
          font-weight: bold;
          color: #555;
        }

        .y-axis {
          grid-area: y-axis;
          /* Rotate the Y-axis label to be read bottom-to-top */
          writing-mode: vertical-rl;
          transform: rotate(180deg);
        }
        
        .x-axis {
          grid-area: x-axis;
        }

        /* * == Responsive Styling ==
         * This media query is *inside* the shadow DOM.
         * When the screen is 600px or less, stack everything.
         */
        @media (max-width: 600px) {
          .wrapper {
            /* Change to a single column layout */
            grid-template-columns: 1fr;
            grid-template-rows: auto 1fr auto; /* y-label, matrix, x-label */
            grid-template-areas:
              "y-axis"
              "matrix"
              "x-axis";
          }

          .y-axis {
            /* Un-rotate the label when stacked */
            writing-mode: horizontal-tb;
            transform: none;
            padding: 10px 0;
          }
          
          .x-axis {
            padding: 10px 0;
          }

          .matrix-container {
            /* Stack quadrants vertically */
            grid-template-columns: 1fr;
            grid-template-rows: 1fr 1fr 1fr 1fr;
          }
        }
      </style>

      <div class="wrapper">
        <div class="axis y-axis">
          <slot name="y-axis">Y-Axis</slot> </div>
        <div class="axis x-axis">
          <slot name="x-axis">X-Axis</slot> </div>

        <div class="matrix-container">
          <div class="quadrant q1"><slot name="quadrant-1"></slot></div>
          <div class="quadrant q2"><slot name="quadrant-2"></slot></div>
          <div class="quadrant q3"><slot name="quadrant-3"></slot></div>
          <div class="quadrant q4"><slot name="quadrant-4"></slot></div>
        </div>
      </div>
    `;
  }
}
customElements.define('quadrant-matrix', QuadrantMatrix);