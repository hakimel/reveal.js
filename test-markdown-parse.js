// Test what markdown would generate for smartart blocks

const markdownInput = `::: smartart Project Updates LINED intro: Quick overview of the team's current priorities.
- Design System Refresh | Update components to the new brand guidelines. | icon=lucide:brush
- API Integration Testing | Final phase of testing for the new payment gateway. | icon=lucide:server-cog
:::`;

console.log('Markdown input:');
console.log(markdownInput);
console.log('\n---\n');

// Markdown would parse this as:
// - A paragraph starting with "::: smartart Project Updates LINED intro: ..."
// - A bullet list with two items
// - A paragraph with ":::"

console.log('Expected HTML structure after markdown processing:');
console.log(`
<p>::: smartart Project Updates LINED intro: Quick overview of the team's current priorities.</p>
<ul>
  <li>Design System Refresh | Update components to the new brand guidelines. | icon=lucide:brush</li>
  <li>API Integration Testing | Final phase of testing for the new payment gateway. | icon=lucide:server-cog</li>
</ul>
<p>:::</p>
`);

console.log('\nThe problem:');
console.log('- The renderWithin function queries for "p, li, blockquote, pre" elements');
console.log('- It reads element.textContent for each element individually');
console.log('- The first <p> only contains: "::: smartart Project Updates LINED intro: ..."');
console.log('- The <li> elements are separate and contain the list items');
console.log('- The closing ::: is in a different <p>');
console.log('- So parseBlock never sees the complete block!');

console.log('\nThis is why the raw syntax shows - markdown created multiple separate elements');
console.log('and the SmartArt plugin can\'t find the complete block to parse and replace!');
