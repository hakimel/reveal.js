#### Example app

DisplayNumbers component

```html
<v-card elevation="2">
  <v-card-title>{{ title }}</v-card-title>
  <v-card-text>
    <v-chip v-for="n of numbers" :key="n" class="ma-1">
      {{ n }}
    </v-chip>
  </v-card-text>
</v-card>
```

```js
export default {
  name: 'DisplayNumbers',
  props: {
    title: String,
    numbers: Array,
  },
};
```

<aside class="notes">
Last but not least, our sub-component, using passed properties to display the title and the list.
Oh, if the tags in the template seems strange, I'm sorry.
I'm using Vuetify to fake my UI badass experience.
Vuetify is a nice Vue UI library with pre-designed material components.
So I can use them in no-brainer mode, without even touching a line of CSS.
</aside>
