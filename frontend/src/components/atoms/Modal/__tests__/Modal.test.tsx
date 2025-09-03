import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Modal } from '../Modal';

describe('Modal Component', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    children: <div>Modal content</div>
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders modal when isOpen is true', () => {
    render(<Modal {...defaultProps} />);
    
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Modal content')).toBeInTheDocument();
  });

  it('does not render modal when isOpen is false', () => {
    render(<Modal {...defaultProps} isOpen={false} />);
    
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders title when provided', () => {
    render(<Modal {...defaultProps} title="Test Modal" />);
    
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-labelledby', 'modal-title');
  });

  it('renders close button by default', () => {
    render(<Modal {...defaultProps} title="Test Modal" />);
    
    const closeButton = screen.getByLabelText('Fechar');
    expect(closeButton).toBeInTheDocument();
  });

  it('hides close button when showCloseButton is false', () => {
    render(<Modal {...defaultProps} title="Test Modal" showCloseButton={false} />);
    
    expect(screen.queryByLabelText('Fechar')).not.toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    render(<Modal {...defaultProps} title="Test Modal" />);
    
    fireEvent.click(screen.getByLabelText('Fechar'));
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when overlay is clicked', () => {
    render(<Modal {...defaultProps} />);
    
    const overlay = screen.getByRole('dialog').parentElement;
    fireEvent.click(overlay!);
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose when modal content is clicked', () => {
    render(<Modal {...defaultProps} />);
    
    fireEvent.click(screen.getByRole('dialog'));
    expect(defaultProps.onClose).not.toHaveBeenCalled();
  });

  it('calls onClose when Escape key is pressed', () => {
    render(<Modal {...defaultProps} />);
    
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('applies correct size classes', () => {
    const { rerender } = render(<Modal {...defaultProps} size="small" />);
    expect(screen.getByRole('dialog')).toHaveClass('modal-small');

    rerender(<Modal {...defaultProps} size="large" />);
    expect(screen.getByRole('dialog')).toHaveClass('modal-large');

    rerender(<Modal {...defaultProps} size="fullscreen" />);
    expect(screen.getByRole('dialog')).toHaveClass('modal-fullscreen');
  });

  it('defaults to medium size', () => {
    render(<Modal {...defaultProps} />);
    expect(screen.getByRole('dialog')).toHaveClass('modal-medium');
  });

  it('prevents body scroll when modal is open', () => {
    const { unmount } = render(<Modal {...defaultProps} />);
    
    expect(document.body.style.overflow).toBe('hidden');
    
    unmount();
    expect(document.body.style.overflow).toBe('unset');
  });
});