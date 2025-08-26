import React from 'react';
import { renderHook } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { useTemplateFromUrl } from '../useTemplateFromUrl';
import { templateService } from '../../services/templateService';

// Mock the template service
jest.mock('../../services/templateService');
const mockTemplateService = templateService as jest.Mocked<typeof templateService>;

const renderHookWithRouter = (initialEntries: string[]) => {
  return renderHook(() => useTemplateFromUrl(), {
    wrapper: ({ children }: { children: React.ReactNode }) => 
      React.createElement(MemoryRouter, { initialEntries }, children)
  });
};

describe('useTemplateFromUrl', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('returns null template when no templateSlug in URL', () => {
    const { result } = renderHookWithRouter(['/']);
    
    expect(result.current.template).toBeNull();
    expect(result.current.parameters).toEqual({});
    expect(result.current.hasTemplate).toBe(false);
    expect(result.current.hasParameters).toBe(false);
  });

  test('returns template when valid templateSlug in URL', () => {
    const mockTemplate = {
      id: 'code-review',
      name: 'Code Review',
      slug: 'code-review',
      description: 'Test',
      category: 'Dev',
      tags: [],
      prompt: 'Test prompt',
      parameters: []
    };

    mockTemplateService.getTemplate.mockReturnValue(mockTemplate);
    
    const { result } = renderHookWithRouter(['/chat/code-review']);
    
    expect(result.current.template).toEqual(mockTemplate);
    expect(result.current.hasTemplate).toBe(true);
    expect(mockTemplateService.getTemplate).toHaveBeenCalledWith('code-review');
  });

  test('returns null template when invalid templateSlug in URL', () => {
    mockTemplateService.getTemplate.mockReturnValue(null);
    
    const { result } = renderHookWithRouter(['/chat/invalid-template']);
    
    expect(result.current.template).toBeNull();
    expect(result.current.hasTemplate).toBe(false);
    expect(mockTemplateService.getTemplate).toHaveBeenCalledWith('invalid-template');
  });

  test('extracts URL parameters when template exists', () => {
    const mockTemplate = {
      id: 'code-review',
      name: 'Code Review',
      slug: 'code-review',
      description: 'Test',
      category: 'Dev',
      tags: [],
      prompt: 'Test prompt',
      parameters: []
    };

    mockTemplateService.getTemplate.mockReturnValue(mockTemplate);
    
    const { result } = renderHookWithRouter(['/chat/code-review?language=javascript&code=test']);
    
    expect(result.current.template).toEqual(mockTemplate);
    expect(result.current.parameters).toEqual({
      language: 'javascript',
      code: 'test'
    });
    expect(result.current.hasTemplate).toBe(true);
    expect(result.current.hasParameters).toBe(true);
  });

  test('ignores URL parameters when template does not exist', () => {
    mockTemplateService.getTemplate.mockReturnValue(null);
    
    const { result } = renderHookWithRouter(['/chat/invalid?language=javascript']);
    
    expect(result.current.template).toBeNull();
    expect(result.current.parameters).toEqual({});
    expect(result.current.hasTemplate).toBe(false);
    expect(result.current.hasParameters).toBe(false);
  });

  test('handles empty URL parameters', () => {
    const mockTemplate = {
      id: 'code-review',
      name: 'Code Review',
      slug: 'code-review',
      description: 'Test',
      category: 'Dev',
      tags: [],
      prompt: 'Test prompt',
      parameters: []
    };

    mockTemplateService.getTemplate.mockReturnValue(mockTemplate);
    
    const { result } = renderHookWithRouter(['/chat/code-review?language=&code=test']);
    
    expect(result.current.parameters).toEqual({
      language: '',
      code: 'test'
    });
  });

  test('handles URL encoded parameters', () => {
    const mockTemplate = {
      id: 'brainstorm',
      name: 'Brainstorm',
      slug: 'brainstorm',
      description: 'Test',
      category: 'Creative',
      tags: [],
      prompt: 'Test prompt',
      parameters: []
    };

    mockTemplateService.getTemplate.mockReturnValue(mockTemplate);
    
    const { result } = renderHookWithRouter(['/chat/brainstorm?topic=new%20product&goal=increase%20sales']);
    
    expect(result.current.parameters).toEqual({
      topic: 'new product',
      goal: 'increase sales'
    });
  });
});