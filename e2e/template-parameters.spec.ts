import { test, expect } from '@playwright/test';

test.describe('Template Parameters - E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for initial page load
    await page.waitForTimeout(2000);
  });

  test('brainstorm template parameters should be editable', async ({ page }) => {
    // Wait for page to load and check if templates section is already visible
    await page.waitForSelector('button:has-text("Mostrar Templates"), button:has-text("Ocultar Templates")', { timeout: 10000 });
    
    // Click the template button to show templates
    const templateButton = page.locator('button:has-text("Mostrar Templates")');
    const isButtonVisible = await templateButton.isVisible();
    
    if (isButtonVisible) {
      await templateButton.click();
    }
    
    // Wait for select dropdown to be visible
    const templateSelect = page.locator('#template-select');
    await templateSelect.waitFor({ state: 'visible', timeout: 10000 });
    
    // Select brainstorm template
    await templateSelect.selectOption('brainstorm');
    
    // Wait for parameter form to appear
    await page.waitForSelector('.parameter-form-container', { timeout: 10000 });
    await expect(page.getByText('Configure os Parâmetros')).toBeVisible();
    
    // Check if the topic input is visible and editable
    const topicInput = page.locator('input#param-topic');
    await expect(topicInput).toBeVisible();
    
    // Test typing in the topic field
    await topicInput.fill('Marketing Digital');
    await expect(topicInput).toHaveValue('Marketing Digital');
    
    // Check if the goal input is visible and editable
    const goalInput = page.locator('input#param-goal');
    await expect(goalInput).toBeVisible();
    
    // Test typing in the goal field
    await goalInput.fill('aumentar vendas online');
    await expect(goalInput).toHaveValue('aumentar vendas online');
    
    // Check if the audience input is visible and editable  
    const audienceInput = page.locator('input#param-audience');
    await expect(audienceInput).toBeVisible();
    
    // Test typing in the audience field
    await audienceInput.fill('pequenos empresários');
    await expect(audienceInput).toHaveValue('pequenos empresários');
    
    // Check if submit button is enabled
    const submitButton = page.getByRole('button', { name: 'Iniciar Conversa' });
    await expect(submitButton).not.toBeDisabled();
    
    // Test editing again to ensure inputs remain editable
    await topicInput.clear();
    await topicInput.fill('E-commerce');
    await expect(topicInput).toHaveValue('E-commerce');
  });

  test('should show validation errors for required fields', async ({ page }) => {
    // Wait for page to load
    await page.waitForSelector('button:has-text("Mostrar Templates")', { timeout: 10000 });
    await expect(page.getByText('🟢 Connected')).toBeVisible();

    // Open template selector
    await page.getByText('Mostrar Templates').click();
    
    // Wait for select dropdown to be visible
    await page.waitForSelector('#template-select', { timeout: 10000 });
    
    // Select a template with parameters
    await page.selectOption('#template-select', 'code-review');
    
    // Wait for parameter form to appear
    await page.waitForSelector('.parameter-form-container');
    
    // Try to submit without filling required fields
    const submitButton = page.getByRole('button', { name: 'Iniciar Conversa' });
    await expect(submitButton).toBeDisabled();
    
    // Fill language but not code
    await page.locator('input#param-language').fill('JavaScript');
    await expect(submitButton).toBeDisabled();
    
    // Fill code field
    await page.locator('textarea#param-code').fill('console.log("test")');
    await expect(submitButton).not.toBeDisabled();
  });
});