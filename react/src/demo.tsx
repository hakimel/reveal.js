import React, { ReactElement, useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import Reveal from './Reveal.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Demo2 />
  </React.StrictMode>,
)

function Demo1() {
  return (
    <div style={{width: 600, height: 600}}>
      <Reveal embedded={true}>
        <section>slide 1</section>
        <section>slide 2</section>
      </Reveal>
    </div>
  );
}

function Demo2() {
  const revealApiRef = React.useRef<any>(null);
  const [slides, setSlides] = useState<string[]>([
    'slide 1',
    'slide 2',
  ]);

  useEffect(() => {
    if (revealApiRef.current) {
      revealApiRef.current.sync();

      // This should not be necessary, the sync() method needs to
      // be revised to call updateSlides() internally.
      revealApiRef.current.slide();
    }
  }, [slides]);

  return (
    <div style={{width: 600, height: 600}}>
      <Reveal embedded={true} ref={revealApiRef}>
        {slides.map((slide, i) => (
          <section key={i}>
            {slide}
          </section>
        ))}
      </Reveal>

      <button onClick={() => {
        setSlides([...slides, `slide ${slides.length + 1}`]);
      }}>Append slide</button>

      <button onClick={() => {
        revealApiRef.current.next();
      }}>Next slide</button>
    </div>
  );
}