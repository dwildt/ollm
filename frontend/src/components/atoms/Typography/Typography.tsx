import React from 'react';
import './Typography.css';

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
export type TextVariant = 'body' | 'body-sm' | 'caption' | 'code';
export type TextAlign = 'left' | 'center' | 'right';
export type TextColor = 'primary' | 'secondary' | 'tertiary' | 'inverse' | 'success' | 'warning' | 'error' | 'info';

interface BaseTypographyProps {
  className?: string;
  align?: TextAlign;
  color?: TextColor;
  children: React.ReactNode;
}

export interface HeadingProps extends BaseTypographyProps {
  level: HeadingLevel;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

export interface TextProps extends BaseTypographyProps {
  variant?: TextVariant;
  as?: 'p' | 'span' | 'div' | 'code' | 'pre';
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold';
  truncate?: boolean;
}

const Heading: React.FC<HeadingProps> = ({
  level,
  as,
  className = '',
  align = 'left',
  color = 'primary',
  children,
  ...rest
}) => {
  const Component = as || (`h${level}` as keyof JSX.IntrinsicElements);
  
  const headingClasses = [
    'typography-heading',
    `typography-heading--h${level}`,
    align !== 'left' && `typography--align-${align}`,
    color !== 'primary' && `typography--color-${color}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <Component className={headingClasses} {...rest}>
      {children}
    </Component>
  );
};

const Text: React.FC<TextProps> = ({
  variant = 'body',
  as = 'p',
  className = '',
  align = 'left',
  color = 'primary',
  weight = 'normal',
  truncate = false,
  children,
  ...rest
}) => {
  const Component = as;
  
  const textClasses = [
    'typography-text',
    `typography-text--${variant}`,
    weight !== 'normal' && `typography--weight-${weight}`,
    align !== 'left' && `typography--align-${align}`,
    color !== 'primary' && `typography--color-${color}`,
    truncate && 'typography--truncate',
    className
  ].filter(Boolean).join(' ');

  return (
    <Component className={textClasses} {...rest}>
      {children}
    </Component>
  );
};

export { Heading, Text };
export default Heading;