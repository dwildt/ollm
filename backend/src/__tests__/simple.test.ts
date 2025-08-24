describe('Simple Backend Test', () => {
  test('should pass basic test', () => {
    expect(2 + 2).toBe(4);
  });

  test('should handle async operation', async () => {
    const result = await Promise.resolve('test');
    expect(result).toBe('test');
  });
});