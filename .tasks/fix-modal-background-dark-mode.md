# Fix Modal Background Dark Mode Issue

**Issue**: Modal background is transparent and unreadable due to hardcoded background color that doesn't respect dark mode settings.

**GitHub Issue**: #19

## Problem Analysis

The modal overlay in `/frontend/src/components/atoms/Modal/Modal.css` has a hardcoded background:
```css
.modal-overlay {
  background: rgba(0, 0, 0, 0.9);  /* Fixed dark background */
}
```

This doesn't adapt to the user's theme preference, causing readability issues.

## Solution

1. **Update Modal.css**
   - Replace hardcoded background with CSS custom property
   - Use `var(--color-bg-overlay)` which exists in the design system
   - Automatically adapts to light/dark themes

2. **Fix ESLint Issues**
   - Address 10 errors and 14 warnings found in lint check
   - Focus on testing-library violations and JSX boolean values

3. **Test Integration**
   - Verify modal works in both themes
   - Ensure proper readability
   - Run test suite for regression checks

## Files to Modify

- `frontend/src/components/atoms/Modal/Modal.css` (line 8)
- Various test files for lint compliance

## Expected Values

- Light mode: `--color-bg-overlay: rgba(0, 0, 0, 0.5)`
- Dark mode: `--color-bg-overlay: rgba(255, 255, 255, 0.1)`

## Commit Message

`fix: modal background respects dark mode. Closes #19`