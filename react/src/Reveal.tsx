import '../../dist/reveal.css'
import '../../dist/theme/black.css'
import _Reveal from '../../dist/reveal.esm.js';
import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';


const Reveal = forwardRef((props: {children: React.ReactNode, [key: string]: any}, ref) => {
  const {children, ...revealProps} = props;
  const deckDivRef = useRef<HTMLDivElement>(null);
  const deckRef = useRef<any>(null);

  useImperativeHandle(ref, () => deckRef.current);

  useEffect(() => {
      // Prevents double initialization in strict mode
      if (deckRef.current) return;

      deckRef.current = new _Reveal(deckDivRef.current!, revealProps);
      deckRef.current.initialize();

      return () => {
          try {
              if (deckRef.current) {
                  deckRef.current.destroy();
                  deckRef.current = null;
              }
          } catch (e) {
              console.warn("Reveal.js destroy call failed.");
          }
      };
  }, []);

  return (
      // The presentation is sized based on the width and height of
      // our parent element. Make sure the parent is not 0-height.
      <div className="reveal" ref={deckDivRef}>
          <div className="slides">
              {children}
          </div>
      </div>
  );
});

export default Reveal;
