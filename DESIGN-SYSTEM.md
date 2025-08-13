# CORNMAN Design System Documentation

## 🎯 Overview

The CORNMAN Design System is a comprehensive, urban streetwear-inspired design language built for modern business applications. It embodies the spirit of hustle, authenticity, and street culture while maintaining professional functionality.

## 🎨 Design Philosophy

- **Street Corn. Elevated.** - Taking something humble and making it premium
- **Urban Streetwear Aesthetic** - Bold, confident, and authentic
- **Moody & Cinematic** - Dark themes with dramatic lighting effects
- **Hustle-First** - Optimized for entrepreneurs and creators
- **Real-Time Everything** - Live data, instant feedback, constant activity

## 🌈 Color Palette

### Primary Brand Colors

```css
--brand-electric: #39ff14 /* Signature neon green */ --brand-electric-dark: #2ecc11
  /* Hover/active states */ --brand-electric-light: #4dff28 /* Light variants */;
```

### Dark Theme (Primary)

```css
--dark-950: #0a0a0a /* Pure black backgrounds */ --dark-900: #121212 /* Main background */
  --dark-850: #1a1a1a /* Elevated surfaces */ --dark-800: #1e1e1e /* Card backgrounds */
  --dark-700: #2a2a2a /* Interactive elements */ --dark-600: #333333 /* Borders/dividers */
  --dark-500: #4a4a4a /* Disabled states */ --dark-400: #666666 /* Secondary text */
  --dark-300: #888888 /* Tertiary text */ --dark-200: #aaaaaa /* Light text */ --dark-100: #e0e0e0
  /* Primary text */ --dark-50: #f5f5f5 /* Brightest text */;
```

### Accent Colors (Streetwear Inspired)

```css
--accent-orange: #ff6b35 /* Energy/Warning */ --accent-yellow: #ffd23f /* Attention/Success */
  --accent-purple: #8b5cf6 /* Premium/VIP */ --accent-cyan: #06b6d4 /* Info/Tech */
  --accent-red: #ef4444 /* Error/Danger */;
```

### Status Colors

```css
--status-success: #10b981 --status-warning: #f59e0b --status-error: #ef4444 --status-info: #06b6d4;
```

## 🔤 Typography

### Font Stack

- **Display Font**: Teko (Condensed, Bold, Impactful)
- **Body Font**: Roboto Mono (Technical, Monospace, Clean)
- **Fallbacks**: System fonts for reliability

### Type Scale

```css
/* Display (Hero Text) */
display-xl: 6rem (96px)     /* Main brand headers */
display-lg: 4.5rem (72px)   /* Section heroes */
display-md: 3.5rem (56px)   /* Large displays */
display-sm: 2.5rem (40px)   /* Card titles */

/* Headings */
heading-xl: 2rem (32px)     /* Major sections */
heading-lg: 1.75rem (28px)  /* Sub-sections */
heading-md: 1.5rem (24px)   /* Card headers */
heading-sm: 1.25rem (20px)  /* Small headings */

/* Body Text */
body-xl: 1.125rem (18px)    /* Large body text */
body-lg: 1rem (16px)        /* Default body */
body-md: 0.875rem (14px)    /* Small body */
body-sm: 0.75rem (12px)     /* Fine print */
caption: 0.6875rem (11px)   /* Captions */
```

## 🔲 Spacing System (8px Grid)

```css
/* Base units (multiples of 8px) */
spacing-1: 4px
spacing-2: 8px
spacing-3: 12px
spacing-4: 16px
spacing-5: 20px
spacing-6: 24px
spacing-8: 32px
spacing-10: 40px
spacing-12: 48px
spacing-16: 64px
spacing-20: 80px
spacing-24: 96px
```

## 🎛️ Component Library

### Buttons

```tsx
// Primary Brand Button
<Button variant="primary">GENERATE</Button>

// Secondary Button
<Button variant="secondary">Cancel</Button>

// Outline Button
<Button variant="outline">Learn More</Button>

// With Icons
<Button leftIcon={<Icon />}>Action</Button>
```

### Cards

```tsx
// Basic Card
<Card>Content</Card>

// Glass Morphism
<Card variant="glass">Content</Card>

// With Hover Effect
<Card hover>Interactive Content</Card>

// Status Card
<StatusCard
  title="Revenue"
  value="RM 4,250"
  change={{ value: 12, label: "vs last month" }}
  color="brand"
/>
```

### Form Elements

```tsx
// Input with Label
<Input
  label="Business Name"
  placeholder="Enter your business name"
  leftIcon={<BusinessIcon />}
/>

// Textarea
<Textarea
  label="Description"
  rows={4}
/>

// Toggle Switch
<Toggle
  checked={darkMode}
  onChange={setDarkMode}
  label="Dark Mode"
/>
```

### Progress & Status

```tsx
// Progress Bar
<Progress
  value={75}
  max={100}
  color="brand"
  showLabel
/>

// Badge
<Badge variant="success">Online</Badge>
<Badge variant="warning">Pending</Badge>
```

## 🎨 Visual Effects

### Animations

```css
/* Signature glow effect */
.animate-glow-pulse

/* Slide in from bottom */
.animate-slide-in-up

/* Scale in effect */
.animate-scale-in

/* Floating effect */
.animate-float
```

### Shadows & Glows

```css
/* Brand glow */
.shadow-glow-brand

/* Elevation shadows */
.shadow-elevation-1
.shadow-elevation-2
.shadow-elevation-3
```

### Background Effects

```css
/* Brand gradient */
.bg-brand-gradient

/* Hero mesh pattern */
.bg-hero-mesh

/* Shimmer effect */
.bg-shimmer-gradient
```

## 🌙 Dark Mode Support

The design system includes comprehensive dark mode support with:

- Automatic theme detection
- Smooth transitions between modes
- Persistent user preferences
- Optimized contrast ratios

### Implementation

```tsx
import { ThemeProvider, useTheme } from './contexts/ThemeContext';

// Wrap your app
<ThemeProvider defaultTheme="dark">
  <App />
</ThemeProvider>;

// Use in components
const { theme, toggleTheme, isDark } = useTheme();
```

## 📱 Responsive Design

### Breakpoints

```css
sm: 640px    /* Mobile landscape */
md: 768px    /* Tablet */
lg: 1024px   /* Desktop */
xl: 1280px   /* Large desktop */
2xl: 1536px  /* Extra large */
```

### Mobile-First Approach

All components are designed mobile-first with progressive enhancement for larger screens.

## 🔧 Customization

### CSS Custom Properties

```css
:root {
  --brand-primary: #39ff14;
  --spacing-unit: 8px;
  --border-radius: 0.5rem;
  --transition-duration: 200ms;
}
```

### Tailwind Configuration

The design system is built on Tailwind CSS with extensive customization in `tailwind.config.js`.

## 🎯 Usage Guidelines

### Do's

✅ Use the brand electric color for primary actions
✅ Maintain consistent spacing using the 8px grid
✅ Apply hover effects to interactive elements
✅ Use the Teko font for headings and display text
✅ Implement proper contrast ratios for accessibility

### Don'ts

❌ Don't use colors outside the defined palette
❌ Don't break the spacing system
❌ Don't mix different border radius values randomly
❌ Don't use light mode as default (brand is dark-first)
❌ Don't overcomplicate animations

## 🔍 Accessibility

- Minimum 4.5:1 contrast ratio for text
- Focus indicators for all interactive elements
- Semantic HTML structure
- Screen reader friendly
- Keyboard navigation support

## 📦 Implementation

### Installation

```bash
npm install tailwindcss @types/react
```

### Setup

1. Copy `tailwind.config.js` to your project
2. Import the ThemeProvider
3. Wrap your app with the providers
4. Use the component library

### Example App Structure

```tsx
function App() {
  return (
    <ThemeProvider defaultTheme="dark">
      <div className="min-h-screen bg-dark-900 text-dark-100">
        <Header />
        <main className="container mx-auto px-4">
          <Section title="Dashboard" titleGradient>
            <Card variant="glass">
              <CardContent>Your content here</CardContent>
            </Card>
          </Section>
        </main>
      </div>
    </ThemeProvider>
  );
}
```

## 🚀 Future Enhancements

- [ ] Light mode optimization
- [ ] Animation performance improvements
- [ ] More component variants
- [ ] Better mobile interactions
- [ ] Advanced theming options
- [ ] Component documentation site
- [ ] Figma design kit

---

**CORNMAN Design System v1.0**  
_Street Corn. Elevated._

Built with ❤️ for the hustle.
