/**
 * UI component that lets the use control auto-slide
 * playback via play/pause.
 */
export default class Playback {
  /**
   * @param {HTMLElement} container The component will append
   * itself to this
   * @param {function} progressCheck A method which will be
   * called frequently to get the current playback progress on
   * a range of 0-1
   */
  constructor(container, progressCheck) {
    // Cosmetics
    this.diameter = 100;
    this.diameter2 = this.diameter / 2;
    this.thickness = 6;

    // Flags if we are currently playing
    this.playing = false;

    // Current progress on a 0-1 range
    this.progress = 0;

    // Used to loop the animation smoothly
    this.progressOffset = 1;

    this.container = container;
    this.progressCheck = progressCheck;

    this.canvas = document.createElement("canvas");
    this.canvas.className = "playback";
    this.canvas.width = this.diameter;
    this.canvas.height = this.diameter;
    this.canvas.style.width = this.diameter2 + "px";
    this.canvas.style.height = this.diameter2 + "px";
    this.context = this.canvas.getContext("2d");

    this.container.appendChild(this.canvas);

    this.render();
  }

  setPlaying(value) {
    const wasPlaying = this.playing;

    this.playing = value;

    // Start repainting if we weren't already
    if (!wasPlaying && this.playing) {
      this.animate();
    } else {
      this.render();
    }
  }

  animate() {
    const progressBefore = this.progress;

    this.progress = this.progressCheck();

    // When we loop, offset the progress so that it eases
    // smoothly rather than immediately resetting
    if (progressBefore > 0.8 && this.progress < 0.2) {
      this.progressOffset = this.progress;
    }

    this.render();

    if (this.playing) {
      requestAnimationFrame(this.animate.bind(this));
    }
  }

  /**
   * Renders the current progress and playback state.
   */
  render() {
    let progress = this.playing ? this.progress : 0,
      radius = this.diameter2 - this.thickness,
      x = this.diameter2,
      y = this.diameter2,
      iconSize = 28;

    // Ease towards 1
    this.progressOffset += (1 - this.progressOffset) * 0.1;

    const endAngle = -Math.PI / 2 + progress * (Math.PI * 2);
    const startAngle = -Math.PI / 2 + this.progressOffset * (Math.PI * 2);

    this.context.save();
    this.context.clearRect(0, 0, this.diameter, this.diameter);

    // Solid background color
    this.context.beginPath();
    this.context.arc(x, y, radius + 4, 0, Math.PI * 2, false);
    this.context.fillStyle = "rgba( 0, 0, 0, 0.4 )";
    this.context.fill();

    // Draw progress track
    this.context.beginPath();
    this.context.arc(x, y, radius, 0, Math.PI * 2, false);
    this.context.lineWidth = this.thickness;
    this.context.strokeStyle = "rgba( 255, 255, 255, 0.2 )";
    this.context.stroke();

    if (this.playing) {
      // Draw progress on top of track
      this.context.beginPath();
      this.context.arc(x, y, radius, startAngle, endAngle, false);
      this.context.lineWidth = this.thickness;
      this.context.strokeStyle = "#fff";
      this.context.stroke();
    }

    this.context.translate(x - iconSize / 2, y - iconSize / 2);

    // Draw play/pause icons
    if (this.playing) {
      this.context.fillStyle = "#fff";
      this.context.fillRect(0, 0, iconSize / 2 - 4, iconSize);
      this.context.fillRect(iconSize / 2 + 4, 0, iconSize / 2 - 4, iconSize);
    } else {
      this.context.beginPath();
      this.context.translate(4, 0);
      this.context.moveTo(0, 0);
      this.context.lineTo(iconSize - 4, iconSize / 2);
      this.context.lineTo(0, iconSize);
      this.context.fillStyle = "#fff";
      this.context.fill();
    }

    this.context.restore();
  }

  on(type, listener) {
    this.canvas.addEventListener(type, listener, false);
  }

  off(type, listener) {
    this.canvas.removeEventListener(type, listener, false);
  }

  destroy() {
    this.playing = false;

    if (this.canvas.parentNode) {
      this.container.removeChild(this.canvas);
    }
  }
}
