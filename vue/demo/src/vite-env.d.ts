/// <reference types="vite/client" />

declare module 'reveal.js/*.css' {
  const content: string;
  export default content;
}

declare module 'reveal.js/*';

declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
