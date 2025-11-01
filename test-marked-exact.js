// Test with exact syntax from working example

import { marked } from 'marked';

const workingExample = `## Q3 Project Roadmap

::: smartart Development Priorities LINED
intro: Key initiatives driving product innovation and customer value this quarter.
- Design System Refresh | Modernize UI components with updated brand guidelines and accessibility standards. | icon=lucide:brush
- API Integration Testing | Complete end-to-end testing of payment gateway integrations. | icon=lucide:server-cog
- Marketing Campaign Launch | Execute multi-channel Q3 campaign with creative asset rollout. | icon=lucide:megaphone
- User Onboarding Flow | Redesign sign-up experience to reduce friction and increase conversion. | icon=lucide:user-check
- Mobile App Performance | Optimize load times and reduce memory footprint by 30%. | icon=lucide:smartphone
- Security Audit | Conduct comprehensive security review and implement recommendations. | icon=lucide:shield-alert
:::`;

console.log('=== WORKING EXAMPLE FROM smartart.html ===\n');
console.log('Input:');
console.log(workingExample);
console.log('\nMarked output:');
const html = marked(workingExample);
console.log(html);
