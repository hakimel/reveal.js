# SmartArt PRICING Layout - Quick Syntax Guide

## Basic Syntax

```markdown
::: smartart [Heading] PRICING
intro: [Optional description text]
- [Plan] | [Price] | [Description] | [CTA] | [Features]
- [*] [Plan] | [Price] | [Description] | [CTA] | [Features]
:::
```

## Components Breakdown

### 1. Plan Name (Required)
```
- Basic
- Pro
- Enterprise
```

### 2. Price (Required)
**Formats that work:**
```
$9/month          → Displays: "$9" + "/month"
$99/year          → Displays: "$99" + "/year"
$29               → Displays: "$29" (no period)
€15/mo            → Displays: "€15" + "/mo"
Contact Us        → Displays: "Contact Us" (custom text)
Custom            → Displays: "Custom" (custom text)
Free              → Displays: "Free"
```

### 3. Description (Optional)
```
Best for individuals and small projects.
Perfect for professionals and growing teams.
Designed for large organizations.
```

### 4. CTA Label (Optional)
```
Get Started
Start Free Trial
Contact Sales
Choose Plan
Buy Now
```

### 5. Features (Optional, semicolon-separated)
```
Feature 1; Feature 2; Feature 3
100 API calls/month; Basic analytics; Community support
All Basic Features; Advanced tools; Priority support
```

## Featured/Highlighted Plans

Use `[*]` or `[!]` before the plan name:

```markdown
- [*] Pro | $29/month | Our most popular plan | Get Started | Feature 1; Feature 2
- [!] Business | $99/month | Best value | Try Free | Feature A; Feature B
```

**Featured plan benefits:**
- "Popular" diagonal ribbon badge (yellow)
- Primary blue border (2px)
- Enhanced shadow effect
- Primary blue CTA button
- Stands out visually

## Complete Examples

### Example 1: 3-Card Standard Pricing
```markdown
::: smartart Pricing Plans PRICING
intro: Choose the plan that fits your needs.
- Starter | $0/month | Perfect for trying out | Sign Up | 5 projects; 1GB storage; Community support
- [*] Pro | $19/month | Best for professionals | Get Started | 50 projects; 50GB storage; Priority support; API access
- Enterprise | Contact Us | For large teams | Contact Sales | Unlimited projects; Dedicated support; Custom SLA
:::
```

### Example 2: 2-Card Simple Pricing
```markdown
::: smartart Simple Pricing PRICING
- Individual | $15/month | For solo creators | Start Free | Unlimited projects; 100GB storage; Basic support
- [*] Team | $49/month | For collaborative teams | Try 14 Days Free | Everything in Individual; Unlimited storage; Team features; Priority support
:::
```

### Example 3: Compact (No Heading)
```markdown
::: smartart PRICING
- Basic | $9 | Essential features | Buy Now | Feature A; Feature B; Feature C
- [*] Plus | $29 | Everything in Basic plus more | Subscribe | Feature A; Feature B; Feature C; Feature D; Feature E
:::
```

### Example 4: Dark Theme
```markdown
<section data-markdown data-background="#0f172a">
::: smartart Flexible Pricing PRICING
intro: Plans that scale with your business.
- Free | $0 | Get started for free | Sign Up | 100 API calls; Basic analytics
- [!] Pro | $99/month | For growing teams | Start Trial | Unlimited API calls; Advanced analytics; Priority support
- Enterprise | Custom | For large organizations | Contact Us | Everything in Pro; Dedicated support; Custom deployment
:::
</section>
```

## Styling Notes

### Colors
- **Primary blue:** `#137fec` (featured plans, CTAs)
- **Yellow badge:** `#f59e0b` ("Popular" ribbon)
- **Borders:** Light gray for standard, primary blue for featured
- **Text:** Inherits from theme

### Responsive Behavior
- **Desktop (>992px):** 3 columns
- **Tablet (768-992px):** 2 columns (or fewer if less than 3 cards)
- **Mobile (<768px):** 1 column (stacked)

### Typography
- **Plan name:** Bold, ~1.3rem
- **Price:** Extra bold, ~3rem
- **Period:** Regular, ~1rem, muted
- **Description:** Regular, ~0.9rem, muted
- **Features:** Regular, ~0.9rem, with checkmark icons

## Tips for Best Results

1. **Keep descriptions concise** - 1-2 sentences max
2. **Limit features to 3-6 per plan** - More readable on mobile
3. **Use consistent feature structure** - "X projects", "Y storage", "Z support"
4. **Mark your best plan as featured** - Use `[*]` or `[!]`
5. **Test on mobile** - Ensure cards don't overflow
6. **Use semantic pricing** - "$9/month" is better than "$9 per month"

## Common Patterns

### SaaS Pricing
```markdown
- Free | $0 | For individuals | Sign Up | 5 users; 10GB storage; Community support
- [*] Team | $29/user/month | For small teams | Start Trial | 20 users; 100GB storage; Priority support; Integrations
- Enterprise | Custom | For large orgs | Contact Sales | Unlimited users; Unlimited storage; Dedicated support; Custom SLA
```

### Tiered Feature Access
```markdown
- Basic | $9/month | Essential features | Get Started | Core features; Email support
- [*] Professional | $29/month | Advanced features | Try Free | All Basic; Advanced tools; Priority support; API access
- Premium | $99/month | Full access | Subscribe | All Professional; White-label; Custom integrations; Dedicated account manager
```

### Freemium Model
```markdown
- Free | $0 | Forever free | Sign Up | Basic features; 1 user; Community support
- [!] Premium | $15/month | Unlock all features | Upgrade Now | All features; Unlimited users; Priority support; No ads
```

## Checkmark Icons

Features automatically get green checkmark icons from Iconify:
```
✓ Feature name appears here
```

All features are rendered as:
```html
<ul class="smartart__pricing-features">
  <li class="smartart__pricing-feature">
    <img src="https://api.iconify.design/lucide:check-circle.svg" alt="Included">
    <span>Feature text</span>
  </li>
</ul>
```

## Accessibility

The pricing layout includes:
- Semantic HTML structure
- Proper heading hierarchy (h2 → h3)
- Link elements for CTAs
- Alt text on icons
- High contrast colors
- Keyboard navigation support
