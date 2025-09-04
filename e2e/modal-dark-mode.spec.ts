import { test, expect } from '@playwright/test';

test.describe('Modal Dark Mode', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('modal has proper background in light mode', async ({ page }) => {
    // Open template selector modal
    await page.click('[data-testid="template-selector-button"]');
    
    // Wait for modal to be visible
    await expect(page.locator('[data-testid="modal-overlay"]')).toBeVisible();
    
    // Check modal overlay background color in light mode
    const modalOverlay = page.locator('[data-testid="modal-overlay"]');
    const backgroundColor = await modalOverlay.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });
    
    // Should be dark semi-transparent overlay in light mode
    expect(backgroundColor).toBe('rgba(0, 0, 0, 0.85)');
  });

  test('modal has proper background in dark mode', async ({ page }) => {
    // Enable dark mode
    await page.click('[data-testid="dark-mode-toggle"]');
    
    // Wait for dark mode to be applied
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    
    // Open template selector modal
    await page.click('[data-testid="template-selector-button"]');
    
    // Wait for modal to be visible
    await expect(page.locator('[data-testid="modal-overlay"]')).toBeVisible();
    
    // Check modal overlay background color in dark mode
    const modalOverlay = page.locator('[data-testid="modal-overlay"]');
    const backgroundColor = await modalOverlay.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });
    
    // Should be darker overlay in dark mode
    expect(backgroundColor).toBe('rgba(15, 15, 15, 0.9)');
  });

  test('modal content is readable in both modes', async ({ page }) => {
    // Test light mode readability
    await page.click('[data-testid="template-selector-button"]');
    await expect(page.locator('[data-testid="modal-overlay"]')).toBeVisible();
    
    // Check if template cards are visible and have proper contrast
    const templateCard = page.locator('.template-card').first();
    await expect(templateCard).toBeVisible();
    
    // Close modal
    await page.click('[data-testid="modal-overlay"]');
    await expect(page.locator('[data-testid="modal-overlay"]')).not.toBeVisible();
    
    // Enable dark mode
    await page.click('[data-testid="dark-mode-toggle"]');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    
    // Test dark mode readability
    await page.click('[data-testid="template-selector-button"]');
    await expect(page.locator('[data-testid="modal-overlay"]')).toBeVisible();
    
    // Check if template cards are still visible with proper contrast
    await expect(templateCard).toBeVisible();
    
    // Verify text is readable (not transparent/invisible)
    const templateTitle = page.locator('.template-name').first();
    const textColor = await templateTitle.evaluate((el) => {
      return window.getComputedStyle(el).color;
    });
    
    // Should not be transparent or same as background
    expect(textColor).not.toBe('rgba(0, 0, 0, 0)');
    expect(textColor).not.toBe('transparent');
  });

  test('modal closes properly in both modes', async ({ page }) => {
    // Test closing in light mode
    await page.click('[data-testid="template-selector-button"]');
    await expect(page.locator('[data-testid="modal-overlay"]')).toBeVisible();
    await page.click('[data-testid="modal-overlay"]');
    await expect(page.locator('[data-testid="modal-overlay"]')).not.toBeVisible();
    
    // Enable dark mode
    await page.click('[data-testid="dark-mode-toggle"]');
    
    // Test closing in dark mode
    await page.click('[data-testid="template-selector-button"]');
    await expect(page.locator('[data-testid="modal-overlay"]')).toBeVisible();
    await page.click('[data-testid="modal-overlay"]');
    await expect(page.locator('[data-testid="modal-overlay"]')).not.toBeVisible();
  });
});