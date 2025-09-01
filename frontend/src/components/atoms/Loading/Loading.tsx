import React from 'react';
import './Loading.css';

export type LoadingVariant = 'spinner' | 'dots' | 'pulse' | 'skeleton';
export type LoadingSize = 'sm' | 'md' | 'lg';

export interface LoadingProps {
  variant?: LoadingVariant;
  size?: LoadingSize;
  className?: string;
  label?: string;
  color?: string;
}

export interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  className?: string;
  rounded?: boolean;
}

const Spinner: React.FC<LoadingProps> = ({
  size = 'md',
  className = '',
  label = 'Carregando...',
  color,
  ...rest
}) => {
  const spinnerClasses = [
    'loading-spinner',
    `loading-spinner--${size}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <div
      className={spinnerClasses}
      role="status"
      aria-label={label}
      style={{ color }}
      {...rest}
    >
      <svg className="loading-spinner__svg" viewBox="0 0 24 24">
        <circle
          className="loading-spinner__circle"
          cx="12"
          cy="12"
          r="10"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      <span className="sr-only">{label}</span>
    </div>
  );
};

const LoadingDots: React.FC<LoadingProps> = ({
  size = 'md',
  className = '',
  label = 'Carregando...',
  color,
  ...rest
}) => {
  const dotsClasses = [
    'loading-dots',
    `loading-dots--${size}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <div
      className={dotsClasses}
      role="status"
      aria-label={label}
      style={{ color }}
      {...rest}
    >
      <div className="loading-dots__dot" />
      <div className="loading-dots__dot" />
      <div className="loading-dots__dot" />
      <span className="sr-only">{label}</span>
    </div>
  );
};

const LoadingPulse: React.FC<LoadingProps> = ({
  size = 'md',
  className = '',
  label = 'Carregando...',
  ...rest
}) => {
  const pulseClasses = [
    'loading-pulse',
    `loading-pulse--${size}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <div
      className={pulseClasses}
      role="status"
      aria-label={label}
      {...rest}
    >
      <div className="loading-pulse__circle" />
      <span className="sr-only">{label}</span>
    </div>
  );
};

const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = '1rem',
  className = '',
  rounded = false,
  ...rest
}) => {
  const skeletonClasses = [
    'loading-skeleton',
    rounded && 'loading-skeleton--rounded',
    className
  ].filter(Boolean).join(' ');

  const style = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  return (
    <div
      className={skeletonClasses}
      style={style}
      aria-hidden="true"
      {...rest}
    />
  );
};

const Loading: React.FC<LoadingProps> = ({
  variant = 'spinner',
  ...props
}) => {
  switch (variant) {
    case 'dots':
      return <LoadingDots {...props} />;
    case 'pulse':
      return <LoadingPulse {...props} />;
    case 'skeleton':
      // For skeleton, we need different props, so this is more of a fallback
      return <Skeleton />;
    case 'spinner':
    default:
      return <Spinner {...props} />;
  }
};

export { Spinner, LoadingDots, LoadingPulse, Skeleton };
export default Loading;