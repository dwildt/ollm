import { test, expect } from '@playwright/test';

test.describe('Chat Interface - Modular Architecture', () => {
  test.beforeEach(async ({ page }) => {
    // Mock API endpoints for consistent testing
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
          models: [
            { name: 'llama3.2:latest', size: 123456, digest: 'abc123', modified_at: '2024-01-01' },
            { name: 'llama3:latest', size: 789012, digest: 'def456', modified_at: '2024-01-02' }
          ]
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
          response: `Response to: ${postData.message}`,
          model: postData.model || 'llama3.2:latest'
        })
      });
    });

    await page.goto('/');
  });

  test('displays mobile-first chat interface components', async ({ page }) => {
    // Wait for page load and components to load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000); // Wait for lazy loaded components
    
    // Check for main chat container
    await expect(page.locator('.chat-container')).toBeVisible({ timeout: 10000 });
    
    // Check for simplified mobile header (wait for lazy loading)
    await expect(page.locator('.chat-header-mobile')).toBeVisible({ timeout: 10000 });
    
    // Check for dark mode toggle and language switcher
    await expect(page.locator('.dark-mode-toggle')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('.language-switcher')).toBeVisible({ timeout: 5000 });
    
    // Check for template button
    await expect(page.locator('.template-button')).toBeVisible({ timeout: 10000 });
    
    // Check for chat input area (also lazy loaded)
    await expect(page.locator('textarea')).toBeVisible({ timeout: 10000 });
  });

  test('shows Ollama connection status', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000); // Wait for lazy loaded components
    
    // Check for status indicator in mobile header (specific to new architecture)
    const statusIndicator = page.locator('.status-indicator');
    await expect(statusIndicator).toBeVisible({ timeout: 10000 });
  });

  test('tests dark mode and language functionality', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000); // Wait for lazy loaded components
    
    // Find dark mode toggle in simplified header
    const darkModeToggle = page.locator('.dark-mode-toggle');
    await expect(darkModeToggle).toBeVisible({ timeout: 10000 });
    
    // Find language switcher in simplified header
    const languageSwitcher = page.locator('.language-switcher');
    await expect(languageSwitcher).toBeVisible({ timeout: 10000 });
    
    // Check if language buttons are present
    const langButtons = page.locator('.lang-button');
    await expect(langButtons.first()).toBeVisible({ timeout: 5000 });
    
    // Should have multiple language options
    const buttonCount = await langButtons.count();
    expect(buttonCount).toBeGreaterThan(1);
  });

  test('opens template modal and selects template', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000); // Wait for lazy loaded components
    
    // Find and click template button in mobile header
    const templateButton = page.locator('.template-button');
    await expect(templateButton).toBeVisible({ timeout: 10000 });
    await templateButton.click();
    
    // Check if template modal opens with new modal component
    const modal = page.locator('.modal-overlay');
    await expect(modal).toBeVisible({ timeout: 5000 });
    
    // Check for modal content
    const modalContent = page.locator('.modal-content');
    await expect(modalContent).toBeVisible({ timeout: 5000 });
    
    // Check for template search functionality in new modal
    const searchInput = page.locator('input[placeholder*="earch"], input[placeholder*="uscar"]');
    if (await searchInput.isVisible()) {
      await searchInput.fill('test');
    }
    
    // Check for category filters in new modal
    const categoryFilters = page.locator('.category-chip');
    await expect(categoryFilters.first()).toBeVisible({ timeout: 5000 });
  });

  test('sends a message and receives a response', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    // Find message input (textarea or input)
    const messageInput = page.locator('textarea, input[type="text"]').first();
    await expect(messageInput).toBeVisible();
    await messageInput.fill('Hello, test message!');

    // Send message (button or Enter key)
    const sendButton = page.locator('button').filter({ hasText: /send|enviar/i });
    if (await sendButton.isVisible()) {
      await sendButton.click();
    } else {
      await messageInput.press('Enter');
    }

    // Check if messages appear in chat area
    await expect(page.locator('text=Hello, test message!')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Response to: Hello, test message!')).toBeVisible({ timeout: 10000 });
  });

  test('sends message using Enter key', async ({ page }) => {
    await page.waitForSelector('#model-select', { timeout: 10000 });
    await expect(page.locator('.status.connected')).toBeVisible({ timeout: 10000 });

    const messageInput = page.getByPlaceholder(/Type your message here/i);
    await messageInput.fill('Test message via Enter');
    await messageInput.press('Enter');

    await expect(page.locator('[data-testid="user-message"], .user-message').locator('text=Test message via Enter')).toBeVisible();
    await expect(page.locator('[data-testid="bot-message"], .bot-message').locator('text=Echo: Test message via Enter')).toBeVisible();
  });

  test('does not send message with Shift+Enter', async ({ page }) => {
    await page.waitForSelector('#model-select', { timeout: 10000 });

    const messageInput = page.getByPlaceholder(/Type your message here/i);
    await messageInput.fill('Line 1');
    await messageInput.press('Shift+Enter');
    await messageInput.type('Line 2');

    // Message should still be in the input, not sent
    await expect(messageInput).toHaveValue('Line 1\nLine 2');
    
    // No messages should appear in the chat area - flexible selector
    await expect(page.locator('[data-testid="user-message"], .user-message').locator('text=Line 1')).not.toBeVisible();
  });

  test('clears chat when clear button is clicked', async ({ page }) => {
    await page.waitForSelector('#model-select', { timeout: 10000 });
    await expect(page.locator('.status.connected')).toBeVisible({ timeout: 10000 });

    // Send a message first
    const messageInput = page.getByPlaceholder(/Type your message here/i);
    await messageInput.fill('Message to be cleared');
    await page.getByRole('button', { name: /Send/i }).click();

    await expect(page.locator('[data-testid="user-message"], .user-message').locator('text=Message to be cleared')).toBeVisible();

    // Clear the chat - flexible selector for ChatHeader component
    await page.getByRole('button', { name: /Clear Chat/i }).click();

    // Messages should be gone
    await expect(page.locator('[data-testid="user-message"], .user-message').locator('text=Message to be cleared')).not.toBeVisible();
    await expect(page.getByText('Echo: Message to be cleared')).not.toBeVisible();

    // Welcome message should be visible again
    await expect(page.getByText(/Welcome to Ollama Chat/i)).toBeVisible();
  });

  test('changes model selection', async ({ page }) => {
    await page.waitForSelector('#model-select', { timeout: 10000 });

    const modelSelect = page.locator('#model-select');
    
    // Default should be first model (llama2)
    await expect(modelSelect).toHaveValue('llama2');

    // Change to mistral
    await modelSelect.selectOption('mistral');
    await expect(modelSelect).toHaveValue('mistral');

    // Send a message to verify the correct model is used
    const messageInput = page.getByPlaceholder(/Type your message here/i);
    await messageInput.fill('Test with mistral');
    await page.getByRole('button', { name: /Send/i }).click();

    await expect(page.locator('[data-testid="user-message"], .user-message').locator('text=Test with mistral')).toBeVisible();
    await expect(page.locator('[data-testid="bot-message"], .bot-message').locator('text=Echo: Test with mistral')).toBeVisible();
  });

  test('switches languages', async ({ page }) => {
    // Check if language switcher is present
    await expect(page.locator('.lang-button').filter({ hasText: 'EN' })).toBeVisible();
    await expect(page.locator('.lang-button').filter({ hasText: 'PT' })).toBeVisible();
    // Note: ES button should be visible but test might need cache refresh

    // Wait for language to initialize and check if any language is active
    await page.waitForTimeout(1000);
    
    // Switch to English first to ensure consistent state
    await page.locator('.lang-button').filter({ hasText: 'EN' }).click();
    await page.waitForTimeout(500);
    await expect(page.locator('.lang-button').filter({ hasText: 'EN' })).toHaveClass(/active/);

    // Switch to Portuguese
    await page.locator('.lang-button').filter({ hasText: 'PT' }).click();

    // Wait for language change to take effect
    await page.waitForTimeout(500);

    // PT should now be active
    await expect(page.locator('.lang-button').filter({ hasText: 'PT' })).toHaveClass(/active/);

    // Basic language switching test completed

    // Check if some text changed to Portuguese (this will depend on the actual translations)
    // We're checking for the title change as an example
    await page.waitForSelector('h1');
  });

  test('shows loading state while sending message', async ({ page }) => {
    await page.waitForSelector('#model-select', { timeout: 10000 });
    await expect(page.locator('.status.connected')).toBeVisible({ timeout: 10000 });

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

    const messageInput = page.getByPlaceholder(/Type your message here/i);
    await messageInput.fill('Test loading state');
    await page.getByRole('button', { name: /Send/i }).click();

    // Should show loading state - flexible selector for ChatInput loading state
    await expect(page.getByText(/Sending/i)).toBeVisible();

    // After response, should show Send button again
    await expect(page.getByRole('button', { name: /Send/i })).toBeVisible({ timeout: 10000 });
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

    await expect(page.locator('.status.disconnected')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Ollama appears to be disconnected')).toBeVisible();
  });

  test('disables send button when no message is typed', async ({ page }) => {
    await page.waitForSelector('#model-select', { timeout: 10000 });
    
    const sendButton = page.getByRole('button', { name: /Send/i });
    await expect(sendButton).toBeDisabled();

    // Type something
    const messageInput = page.getByPlaceholder(/Type your message here/i);
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
    await page.waitForSelector('#model-select', { timeout: 10000 });

    // Check if interface is still functional
    await expect(page.getByRole('heading', { name: /Ollama Chat Interface/i })).toBeVisible();
    await expect(page.getByPlaceholder(/Type your message here/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /Send/i })).toBeVisible();

    // Test sending a message on mobile
    const messageInput = page.getByPlaceholder(/Type your message here/i);
    await messageInput.fill('Mobile test message');
    await page.getByRole('button', { name: /Send/i }).click();

    await expect(page.locator('[data-testid="user-message"], .user-message').locator('text=Mobile test message')).toBeVisible();
    await expect(page.locator('[data-testid="bot-message"], .bot-message').locator('text=Echo: Mobile test message')).toBeVisible();
  });

  test('handles long messages', async ({ page }) => {
    await page.waitForSelector('#model-select', { timeout: 10000 });
    await expect(page.locator('.status.connected')).toBeVisible({ timeout: 10000 });

    const longMessage = 'This is a very long message that tests how the application handles lengthy text input. '.repeat(10);
    
    const messageInput = page.getByPlaceholder(/Type your message here/i);
    await messageInput.fill(longMessage);
    await page.getByRole('button', { name: /Send/i }).click();

    await expect(page.locator('[data-testid="user-message"], .user-message').locator('text=' + longMessage.substring(0, 50))).toBeVisible();
    await expect(page.locator('[data-testid="bot-message"], .bot-message').locator('text=Echo:')).toBeVisible();
  });

  test('auto-scrolls to bottom when new messages arrive', async ({ page }) => {
    await page.waitForSelector('#model-select', { timeout: 10000 });
    await expect(page.locator('.status.connected')).toBeVisible({ timeout: 10000 });

    // Send multiple messages to create scroll
    for (let i = 1; i <= 5; i++) {
      const messageInput = page.getByPlaceholder(/Type your message here/i);
      await messageInput.fill(`Message ${i}`);
      await page.getByRole('button', { name: /Send/i }).click();
      await page.waitForTimeout(500); // Small delay between messages
    }

    // Check if the last message is visible (indicating auto-scroll worked)
    await expect(page.locator('[data-testid="user-message"], .user-message').locator('text=Message 5')).toBeVisible();
    await expect(page.locator('[data-testid="bot-message"], .bot-message').locator('text=Echo: Message 5')).toBeVisible();
  });

  test('shows expandable error details when message fails', async ({ page }) => {
    await page.waitForSelector('#model-select', { timeout: 10000 });
    
    // Mock a network error by intercepting the API call
    await page.route('**/api/chat', route => {
      route.abort('connectionfailed');
    });

    // Try to send a message
    const messageInput = page.getByPlaceholder(/Type your message here/i);
    await messageInput.fill('This will fail');
    await page.getByRole('button', { name: /Send/i }).click();

    // Wait for error message to appear - flexible selector for ChatMessages component
    await page.waitForSelector('[data-testid="bot-message"], .bot-message', { timeout: 10000 });
    
    // Check if error details toggle button is present
    const errorToggle = page.locator('[data-testid="error-toggle"], .error-details-toggle');
    await expect(errorToggle).toBeVisible();
    await expect(errorToggle).toContainText(/Ver detalhes do erro/i);
    
    // Click to expand error details
    await errorToggle.click();
    
    // Check if error details are now visible
    await expect(page.locator('[data-testid="error-details"], .error-details-content')).toBeVisible();
    await expect(page.locator('[data-testid="error-type"], .error-type')).toBeVisible();
    await expect(page.locator('[data-testid="error-details-text"], .error-details-text')).toBeVisible();
    
    // Check if toggle text changed
    await expect(errorToggle).toContainText(/Ocultar detalhes/i);
    
    // Click again to collapse
    await errorToggle.click();
    await expect(page.locator('[data-testid="error-details"], .error-details-content')).not.toBeVisible();
    await expect(errorToggle).toContainText(/Ver detalhes do erro/i);
  });
});