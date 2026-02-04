import React from 'react';
import { cva, type VariantProps } from 'cva';
import { cn } from '@/shared/lib/css';

const buttonVariants = cva({
  base: 'rounded-md focus:ring-2 transition-colors duration-200 cursor-pointer',
  variants: {
    variant: {
      primary:
        'bg-primary-500 hover:bg-primary-700 focus:ring-primary-500 text-white',
      secondary:
        'bg-secondary-500 hover:bg-gray-700 focus:ring-gray-500 text-white',
      danger: 'bg-danger-500 hover:bg-red-700 focus:ring-red-500 text-white',
      outline:
        'bg-transparent border border-primary-500 text-primary-500 hover:bg-primary-100 focus:ring-primary-200',
      text: 'bg-transparent text-white hover:text-primary-700 hover:bg-transparent focus:ring-0 underline-offset-4 hover:underline'
    },
    size: {
      xs: 'min-w-[80px] px-(--custom-xs) py-2 text-xs',
      sm: 'min-w-[100px] px-(--custom-sm) py-[var(--custom-xs)] text-sm',
      md: 'min-w-[120px] px-(--custom-md) py-[var(--custom-sm)]',
      lg: 'min-w-[150px] px-(--custom-lg) py-[var(--custom-md)] text-lg',
      xl: 'min-w-[180px] px-(--custom-xl) py-[var(--custom-lg)] text-xl',
      icon: 'p-2 w-7 h-7 flex items-center justify-center text-lg'
    },
    disabled: {
      true: 'opacity-50 cursor-not-allowed'
    }
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md'
  }
});

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    children?: React.ReactNode;
    className?: string;
  };

const Button: React.FC<ButtonProps> = ({
  children,
  variant,
  size,
  disabled = false,
  className,
  ...props
}) => {
  return (
    <button
      className={cn(buttonVariants({ variant, size, disabled, className }))}
      disabled={disabled}
      type="button"
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
