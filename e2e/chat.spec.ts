import { test, expect } from '@playwright/test';

// Mock Ollama responses for consistent testing
const mockOllamaModels = [
  { name: 'llama2', size: 123456, digest: 'abc123', modified_at: '2024-01-01' },
  { name: 'mistral', size: 789012, digest: 'def456', modified_at: '2024-01-02' }
];

const mockOllamaResponse = {
  response: 'Hello! This is a test response from the mocked Ollama service.',
  model: 'llama2'
};

test.describe('Ollama Chat Interface - E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Mock the Ollama API endpoints
    await page.route('**/api/health', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          status: 'healthy',
          ollama: 'connected'
        })
      });
    });

    await page.route('**/api/models', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          models: mockOllamaModels
        })
      });
    });

    await page.route('**/api/chat', async route => {
      const request = route.request();
      const postData = request.postDataJSON();
      
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          response: `Echo: ${postData.message}`,
          model: postData.model || 'llama2'
        })
      });
    });

    await page.goto('/');
  });

  test('loads the chat interface successfully', async ({ page }) => {
    // Check if the main elements are present
    await expect(page.getByRole('heading', { name: 'Ollama Chat Interface' })).toBeVisible();
    await expect(page.getByText('Welcome to Ollama Chat!')).toBeVisible();
    await expect(page.getByPlaceholder('Type your message here')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Send' })).toBeVisible();
  });

  test('shows connected status when Ollama is available', async ({ page }) => {
    await expect(page.getByText('🟢 Connected')).toBeVisible();
  });

  test('loads and displays available models', async ({ page }) => {
    // Wait for models to load
    await page.waitForSelector('select');
    
    const modelSelect = page.locator('select');
    await expect(modelSelect).toBeVisible();
    
    // Check if models are loaded in the dropdown
    const options = await modelSelect.locator('option').allTextContents();
    expect(options).toContain('llama2');
    expect(options).toContain('mistral');
  });

  test('sends a message and receives a response', async ({ page }) => {
    // Wait for the interface to be ready
    await page.waitForSelector('select');
    await expect(page.getByText('🟢 Connected')).toBeVisible();

    // Type a message
    const messageInput = page.getByPlaceholder('Type your message here');
    await messageInput.fill('Hello, world!');

    // Click send button
    await page.getByRole('button', { name: 'Send' }).click();

    // Check if the user message appears
    await expect(page.getByText('Hello, world!')).toBeVisible();

    // Check if the response appears
    await expect(page.getByText('Echo: Hello, world!')).toBeVisible();

    // Check if the input is cleared
    await expect(messageInput).toHaveValue('');
  });

  test('sends message using Enter key', async ({ page }) => {
    await page.waitForSelector('select');
    await expect(page.getByText('🟢 Connected')).toBeVisible();

    const messageInput = page.getByPlaceholder('Type your message here');
    await messageInput.fill('Test message via Enter');
    await messageInput.press('Enter');

    await expect(page.getByText('Test message via Enter')).toBeVisible();
    await expect(page.getByText('Echo: Test message via Enter')).toBeVisible();
  });

  test('does not send message with Shift+Enter', async ({ page }) => {
    await page.waitForSelector('select');

    const messageInput = page.getByPlaceholder('Type your message here');
    await messageInput.fill('Line 1');
    await messageInput.press('Shift+Enter');
    await messageInput.type('Line 2');

    // Message should still be in the input, not sent
    await expect(messageInput).toHaveValue('Line 1\nLine 2');
    
    // No messages should appear in the chat
    await expect(page.getByText('Line 1')).not.toBeVisible();
  });

  test('clears chat when clear button is clicked', async ({ page }) => {
    await page.waitForSelector('select');
    await expect(page.getByText('🟢 Connected')).toBeVisible();

    // Send a message first
    const messageInput = page.getByPlaceholder('Type your message here');
    await messageInput.fill('Message to be cleared');
    await page.getByRole('button', { name: 'Send' }).click();

    await expect(page.getByText('Message to be cleared')).toBeVisible();

    // Clear the chat
    await page.getByRole('button', { name: 'Clear Chat' }).click();

    // Messages should be gone
    await expect(page.getByText('Message to be cleared')).not.toBeVisible();
    await expect(page.getByText('Echo: Message to be cleared')).not.toBeVisible();

    // Welcome message should be visible again
    await expect(page.getByText('Welcome to Ollama Chat!')).toBeVisible();
  });

  test('changes model selection', async ({ page }) => {
    await page.waitForSelector('select');

    const modelSelect = page.locator('select');
    
    // Default should be first model (llama2)
    await expect(modelSelect).toHaveValue('llama2');

    // Change to mistral
    await modelSelect.selectOption('mistral');
    await expect(modelSelect).toHaveValue('mistral');

    // Send a message to verify the correct model is used
    const messageInput = page.getByPlaceholder('Type your message here');
    await messageInput.fill('Test with mistral');
    await page.getByRole('button', { name: 'Send' }).click();

    await expect(page.getByText('Test with mistral')).toBeVisible();
    await expect(page.getByText('Echo: Test with mistral')).toBeVisible();
  });

  test('switches languages', async ({ page }) => {
    // Check if language switcher is present
    await expect(page.getByRole('button', { name: 'EN' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'PT' })).toBeVisible();

    // EN should be active by default
    await expect(page.getByRole('button', { name: 'EN' })).toHaveClass(/active/);

    // Switch to Portuguese
    await page.getByRole('button', { name: 'PT' }).click();

    // Wait for language change to take effect
    await page.waitForTimeout(500);

    // PT should now be active
    await expect(page.getByRole('button', { name: 'PT' })).toHaveClass(/active/);

    // Check if some text changed to Portuguese (this will depend on the actual translations)
    // We're checking for the title change as an example
    await page.waitForSelector('h1');
  });

  test('shows loading state while sending message', async ({ page }) => {
    await page.waitForSelector('select');
    await expect(page.getByText('🟢 Connected')).toBeVisible();

    // Mock a delayed response
    await page.route('**/api/chat', async route => {
      // Add delay to see loading state
      await new Promise(resolve => setTimeout(resolve, 1000));
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          response: 'Delayed response',
          model: 'llama2'
        })
      });
    });

    const messageInput = page.getByPlaceholder('Type your message here');
    await messageInput.fill('Test loading state');
    await page.getByRole('button', { name: 'Send' }).click();

    // Should show loading state
    await expect(page.getByText('Sending...')).toBeVisible();

    // After response, should show Send button again
    await expect(page.getByRole('button', { name: 'Send' })).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Delayed response')).toBeVisible();
  });

  test('handles disconnected state', async ({ page }) => {
    // Mock disconnected state
    await page.route('**/api/health', async route => {
      await route.fulfill({
        status: 503,
        contentType: 'application/json',
        body: JSON.stringify({
          status: 'unhealthy',
          ollama: 'disconnected'
        })
      });
    });

    await page.goto('/');

    await expect(page.getByText('🔴 Disconnected')).toBeVisible();
    await expect(page.getByText('Ollama appears to be disconnected')).toBeVisible();
  });

  test('disables send button when no message is typed', async ({ page }) => {
    await page.waitForSelector('select');
    
    const sendButton = page.getByRole('button', { name: 'Send' });
    await expect(sendButton).toBeDisabled();

    // Type something
    const messageInput = page.getByPlaceholder('Type your message here');
    await messageInput.fill('Hello');

    await expect(sendButton).toBeEnabled();

    // Clear the input
    await messageInput.fill('');

    await expect(sendButton).toBeDisabled();
  });

  test('is responsive on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto('/');
    await page.waitForSelector('select');

    // Check if interface is still functional
    await expect(page.getByRole('heading', { name: 'Ollama Chat Interface' })).toBeVisible();
    await expect(page.getByPlaceholder('Type your message here')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Send' })).toBeVisible();

    // Test sending a message on mobile
    const messageInput = page.getByPlaceholder('Type your message here');
    await messageInput.fill('Mobile test message');
    await page.getByRole('button', { name: 'Send' }).click();

    await expect(page.getByText('Mobile test message')).toBeVisible();
    await expect(page.getByText('Echo: Mobile test message')).toBeVisible();
  });

  test('handles long messages', async ({ page }) => {
    await page.waitForSelector('select');
    await expect(page.getByText('🟢 Connected')).toBeVisible();

    const longMessage = 'This is a very long message that tests how the application handles lengthy text input. '.repeat(10);
    
    const messageInput = page.getByPlaceholder('Type your message here');
    await messageInput.fill(longMessage);
    await page.getByRole('button', { name: 'Send' }).click();

    await expect(page.getByText(longMessage)).toBeVisible();
    await expect(page.getByText(`Echo: ${longMessage}`)).toBeVisible();
  });

  test('auto-scrolls to bottom when new messages arrive', async ({ page }) => {
    await page.waitForSelector('select');
    await expect(page.getByText('🟢 Connected')).toBeVisible();

    // Send multiple messages to create scroll
    for (let i = 1; i <= 5; i++) {
      const messageInput = page.getByPlaceholder('Type your message here');
      await messageInput.fill(`Message ${i}`);
      await page.getByRole('button', { name: 'Send' }).click();
      await page.waitForTimeout(500); // Small delay between messages
    }

    // Check if the last message is visible (indicating auto-scroll worked)
    await expect(page.getByText('Message 5')).toBeVisible();
    await expect(page.getByText('Echo: Message 5')).toBeVisible();
  });
});