# 🤝 Contributing to JARVIS HUD

Thank you for considering contributing to JARVIS HUD! This document provides guidelines and instructions for contributing.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on what is best for the community
- Show empathy towards other community members

## How Can I Contribute?

### Reporting Bugs

1. Check if the bug has already been reported in [Issues](https://github.com/your-username/jarvis-hud/issues)
2. If not, create a new issue with:
   - Clear title
   - Detailed description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots/videos if applicable
   - Browser and OS version

### Suggesting Enhancements

1. Check existing [Issues](https://github.com/your-username/jarvis-hud/issues) and [Discussions](https://github.com/your-username/jarvis-hud/discussions)
2. Create a new discussion or issue with:
   - Clear use case
   - Expected benefits
   - Possible implementation approach

### Code Contributions

Areas where contributions are welcome:
- 🐛 Bug fixes
- ✨ New features
- 📝 Documentation improvements
- 🎨 UI/UX enhancements
- ⚡ Performance optimizations
- 🌐 Translations
- ✅ Test coverage

## Development Setup

### Prerequisites

- Node.js 18+ or Bun
- Git
- Code editor (VS Code recommended)

### Setup Steps

1. **Fork the repository**
   - Click "Fork" button on GitHub

2. **Clone your fork**
```bash
git clone https://github.com/your-username/jarvis-hud.git
cd jarvis-hud
```

3. **Add upstream remote**
```bash
git remote add upstream https://github.com/original-owner/jarvis-hud.git
```

4. **Install dependencies**
```bash
npm install
```

5. **Start dev server**
```bash
npm run dev
```

6. **Create a branch**
```bash
git checkout -b feature/your-feature-name
```

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Avoid `any` type - use proper typing
- Define interfaces for component props
- Use type inference where possible

```typescript
// ✅ Good
interface Props {
  name: string;
  age: number;
}

function Component({ name, age }: Props) {
  // ...
}

// ❌ Bad
function Component(props: any) {
  // ...
}
```

### React

- Use functional components with hooks
- Use proper hook dependencies
- Memoize expensive calculations
- Clean up effects properly

```typescript
// ✅ Good
useEffect(() => {
  const subscription = subscribe();
  return () => subscription.unsubscribe();
}, [dependency]);

// ❌ Bad
useEffect(() => {
  subscribe();
}, []); // No cleanup
```

### Naming Conventions

- Components: `PascalCase` (e.g., `FaceTracker.tsx`)
- Functions: `camelCase` (e.g., `calculateDistance`)
- Constants: `UPPER_SNAKE_CASE` (e.g., `MAX_FACES`)
- Types/Interfaces: `PascalCase` (e.g., `FaceLandmark`)

### File Organization

```
src/
├── components/        # Reusable UI components
├── lib/              # Utilities and core logic
├── types/            # TypeScript type definitions
└── index.css         # Global styles
```

### Comments

- Write self-documenting code
- Add comments for complex logic
- Use JSDoc for functions

```typescript
/**
 * Analyzes facial landmarks to determine emotional state
 * @param landmarks - Array of facial landmark points
 * @returns Detected mood with confidence score
 */
export function analyzeFacialEmotion(landmarks: NormalizedLandmark[]): MoodState {
  // Implementation
}
```

### Styling

- Use Tailwind CSS utility classes
- Follow existing design system (defined in `index.css`)
- Use semantic color tokens (e.g., `text-glow` not `text-cyan-400`)
- Responsive design is mandatory

```tsx
// ✅ Good
<div className="hud-panel text-glow">

// ❌ Bad
<div className="bg-gray-800 text-cyan-400">
```

## Commit Guidelines

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code formatting (no logic change)
- `refactor`: Code restructuring
- `perf`: Performance improvements
- `test`: Adding tests
- `chore`: Maintenance tasks

### Examples

```bash
feat(camera): add IP camera support

Add ability to connect to IP/WiFi cameras via MJPEG or HLS streams.
Includes URL validation and error handling.

Closes #123
```

```bash
fix(tracking): prevent infinite re-render in Globe component

Remove lastGesture from useEffect dependencies to fix loop.

Fixes #456
```

## Pull Request Process

### Before Submitting

1. **Update from upstream**
```bash
git fetch upstream
git rebase upstream/main
```

2. **Test your changes**
```bash
npm run build  # Ensure build works
```

3. **Lint your code**
```bash
npm run lint  # If available
```

### PR Checklist

- [ ] Code follows project style guidelines
- [ ] Comments added for complex logic
- [ ] No console.log statements (except intentional logging)
- [ ] Tested in Chrome, Firefox, and Edge
- [ ] Camera functionality tested (if applicable)
- [ ] Responsive design verified
- [ ] No TypeScript errors
- [ ] Build succeeds

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How to test the changes

## Screenshots/Videos
If applicable

## Related Issues
Closes #XXX
```

### Review Process

1. Maintainers will review your PR
2. Address any requested changes
3. Once approved, PR will be merged
4. Your contribution will be credited

## Development Tips

### Debugging MediaPipe

```typescript
// Enable verbose logging
console.log('Face detected:', faces);
console.log('Hand landmarks:', hands);
```

### Testing Camera Features

- Test with different browsers
- Test with different camera resolutions
- Test with IP camera (if accessible)
- Test permission denied scenarios

### Performance Testing

```typescript
// Measure performance
const start = performance.now();
// ... code to measure
console.log(`Execution time: ${performance.now() - start}ms`);
```

## Questions?

- 💬 [Start a Discussion](https://github.com/your-username/jarvis-hud/discussions)
- 📧 Email: your-email@example.com

---

Thank you for contributing! 🙏
