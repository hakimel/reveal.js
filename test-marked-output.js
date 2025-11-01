// Test what marked produces for different smartart syntaxes

import { marked } from 'marked';

const inlineIntro = `::: smartart Project Updates LINED intro: Quick overview of the team's current priorities.
- Design System Refresh | Update components to the new brand guidelines. | icon=lucide:brush
- API Integration Testing | Final phase of testing for the new payment gateway. | icon=lucide:server-cog
:::`;

const separateIntro = `::: smartart Project Updates LINED
intro: Key initiatives driving product innovation and customer value this quarter.
- Design System Refresh | Update components to the new brand guidelines. | icon=lucide:brush
- API Integration Testing | Final phase of testing for the new payment gateway. | icon=lucide:server-cog
:::`;

console.log('=== INLINE INTRO (NOT WORKING) ===\n');
console.log('Input:');
console.log(inlineIntro);
console.log('\nMarked output:');
const inlineHTML = marked(inlineIntro);
console.log(inlineHTML);

console.log('\n\n=== SEPARATE INTRO (WORKING) ===\n');
console.log('Input:');
console.log(separateIntro);
console.log('\nMarked output:');
const separateHTML = marked(separateIntro);
console.log(separateHTML);

console.log('\n\n=== ANALYSIS ===\n');
console.log('Now let\'s check if a <p> element would contain the full text...');
