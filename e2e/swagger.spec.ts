import { test, expect } from '@playwright/test';

test.describe('Swagger API Documentation', () => {
  test.beforeEach(async ({ page }) => {
    // Ensure we're in development mode for these tests
    await page.goto('http://localhost:4001/api-docs/');
  });

  test('should load Swagger UI interface', async ({ page }) => {
    // Check if Swagger UI is loaded
    await expect(page.locator('.swagger-ui')).toBeVisible();
    
    // Check if the API title is present
    await expect(page.locator('h2')).toContainText('OLLM API');
    
    // Check if version is displayed
    await expect(page.locator('.info .version')).toContainText('1.0.0');
  });

  test('should display all API endpoints', async ({ page }) => {
    // Wait for the Swagger UI to load completely
    await page.waitForSelector('.opblock', { timeout: 10000 });
    
    // Check if all main endpoints are present
    const endpoints = [
      '/api/models',
      '/api/health', 
      '/api/chat',
      '/api/{templateSlug}'
    ];
    
    for (const endpoint of endpoints) {
      await expect(page.locator(`text=${endpoint}`)).toBeVisible();
    }
  });

  test('should organize endpoints by tags', async ({ page }) => {
    // Check if endpoints are properly organized by tags
    const tags = ['Models', 'Health', 'Chat', 'Templates'];
    
    for (const tag of tags) {
      await expect(page.locator(`h4:has-text("${tag}")`)).toBeVisible();
    }
  });

  test('should expand endpoint details', async ({ page }) => {
    // Click on the models endpoint to expand it
    await page.click('text=/api/models');
    
    // Wait for the endpoint to expand
    await page.waitForSelector('.opblock.opblock-get.is-open');
    
    // Check if response examples are shown
    await expect(page.locator('text=200')).toBeVisible();
    await expect(page.locator('text=List of available models')).toBeVisible();
  });

  test('should show request/response schemas', async ({ page }) => {
    // Expand the chat endpoint
    await page.click('text=/api/chat');
    await page.waitForSelector('.opblock.opblock-post.is-open');
    
    // Check if request schema is displayed
    await expect(page.locator('text=ChatRequest')).toBeVisible();
    
    // Check if response schema is displayed  
    await expect(page.locator('text=ChatResponse')).toBeVisible();
  });

  test('should display example values', async ({ page }) => {
    // Expand the template endpoint
    await page.click('text=/api/{templateSlug}');
    await page.waitForSelector('.opblock.opblock-get.is-open');
    
    // Check if example template slug is shown
    await expect(page.locator('text=english-teacher')).toBeVisible();
    
    // Check if example query parameter is shown
    await expect(page.locator('text=Hello world')).toBeVisible();
  });

  test('should allow trying out endpoints', async ({ page }) => {
    // Expand the health endpoint
    await page.click('text=/api/health');
    await page.waitForSelector('.opblock.opblock-get.is-open');
    
    // Click "Try it out" button
    await page.click('button:has-text("Try it out")');
    
    // Execute the request
    await page.click('button:has-text("Execute")');
    
    // Wait for response
    await page.waitForSelector('.responses-wrapper .response', { timeout: 15000 });
    
    // Check if we get a response (should be 200 if Ollama is running, or 503 if not)
    const responseCode = await page.locator('.response .response-col_status').first();
    await expect(responseCode).toBeVisible();
  });

  test('should show model schemas correctly', async ({ page }) => {
    // Look for schema definitions
    await expect(page.locator('text=Schemas')).toBeVisible();
    
    // Check if all main schemas are present in the UI
    const schemas = ['Model', 'ChatRequest', 'ChatResponse', 'HealthResponse', 'TemplateResponse', 'ErrorResponse'];
    
    // Scroll down to schemas section
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    
    for (const schema of schemas) {
      await expect(page.locator(`text=${schema}`)).toBeVisible();
    }
  });

  test('should handle server connection status', async ({ page }) => {
    // Check if server info is displayed
    await expect(page.locator('.servers')).toBeVisible();
    
    // Should show development server URL
    await expect(page.locator('text=http://localhost:4001')).toBeVisible();
    
    // Should show server description
    await expect(page.locator('text=Development server')).toBeVisible();
  });
});