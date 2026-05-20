## Description

<!-- Provide a brief summary of the changes and the motivation for this Pull Request. -->

## Linked Issues

<!-- Link any related issues here using "Closes #123" or similar. -->

## Type of Change

- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update
- [ ] Refactor (code change that neither fixes a bug nor adds a feature)
- [ ] Performance improvement

## Engineering Standards Checklist

### React & Architecture

- [ ] No `useEffect` for derived calculations (values computed directly during render)
- [ ] No unnecessary state duplication (derived values are not stored in state)
- [ ] Components are focused and composable (no monolithic components)
- [ ] Zustand selectors are atomic (no whole-store consumption)
- [ ] Feature boundaries respected (no cross-feature internal imports)

### Mantine & UI

- [ ] No inline `style={{ }}` for static styling (Mantine theme props used)
- [ ] No hardcoded hex colors (semantic theme variables used)
- [ ] Layout uses `<Stack>`, `<Group>`, `<Grid>` — not margin hacks
- [ ] Touch targets are at least 44px on mobile
- [ ] Dark mode compatible (semantic colors only)

### Performance

- [ ] Lists exceeding 50 items use `@tanstack/react-virtual`
- [ ] No `.toArray()` on full database tables
- [ ] Heavy dependencies are lazy-loaded via dynamic `import()`
- [ ] Blob Object URLs are properly revoked on cleanup

### Accessibility

- [ ] All `<ActionIcon>` elements have descriptive `aria-label`
- [ ] Interactive cards use `component="button"` polymorphism
- [ ] Focus rings are preserved on interactive elements

### Quality Gates

- [ ] `npm run format` — passes
- [ ] `npm run lint` — passes
- [ ] `npm run type-check` — passes
- [ ] `npm run build` — passes

## Screenshots / Videos

<!-- If this PR changes the UI, please provide screenshots or a short video recording. -->

## Additional Context

<!-- Add any other context about the PR here. -->
