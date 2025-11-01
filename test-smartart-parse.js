// Test parseBlock logic with inline intro

const testInput = `:::     smartart   Project Updates LINED intro: Quick overview of the team's current priorities.
- Design System Refresh | Update components to the new brand guidelines. | icon=lucide:brush
- API Integration Testing | Final phase of testing for the new payment gateway. | icon=lucide:server-cog
:::`;

console.log('Testing input:');
console.log(testInput);
console.log('\n---PARSING---\n');

// Simulate the parseBlock logic
const match = testInput.trim().match(/^:::\s*smartart\s+([\s\S]+?)\s*:::\s*$/i);
if (!match) {
  console.log('NO MATCH!');
  process.exit(1);
}

const body = match[1].trim();
const lines = body.split(/\n+/).map(line => line.trim()).filter(Boolean);
console.log('Lines:', lines);

const firstLineTokens = lines[0].split(/\s+/).filter(Boolean);
console.log('First line tokens:', firstLineTokens);

const ORIENTATION_MAP = {
  TB: 'vertical',
  BT: 'vertical',
  LR: 'horizontal',
  RL: 'horizontal',
  GRID: 'grid',
  AUTO: 'grid',
  LINED: 'lined'
};

const orientationIndex = firstLineTokens.findIndex(token =>
  ORIENTATION_MAP[token.toUpperCase()]
);
console.log('Orientation index:', orientationIndex);

const orientation = orientationIndex >= 0 ? firstLineTokens[orientationIndex].toUpperCase() : 'TB';
const headingTokens = orientationIndex >= 0 ? firstLineTokens.slice(0, orientationIndex) : firstLineTokens;
const remainderTokens = orientationIndex >= 0 ? firstLineTokens.slice(orientationIndex + 1) : [];

console.log('Orientation:', orientation);
console.log('Heading tokens:', headingTokens);
console.log('Remainder tokens:', remainderTokens);

const heading = headingTokens.join(' ').trim();
const firstItemCandidate = remainderTokens.join(' ').trim();

console.log('\nHeading:', heading);
console.log('First item candidate:', firstItemCandidate);

const sanitizedFirst = firstItemCandidate.replace(/^[-*+]\s+/, '');
const introMatch = sanitizedFirst.match(/^(?:intro|summary|description)\s*:\s*(.+)$/i);

console.log('\nSanitized first:', sanitizedFirst);
console.log('Intro match:', introMatch ? introMatch[1] : 'NO MATCH');

if (introMatch) {
  console.log('\n✓ INTRO EXTRACTED SUCCESSFULLY!');
  console.log('Intro text:', introMatch[1]);
} else {
  console.log('\n✗ INTRO NOT EXTRACTED - THIS IS THE BUG!');
}
