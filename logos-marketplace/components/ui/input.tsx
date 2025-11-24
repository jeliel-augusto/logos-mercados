import * as React from 'react';
import { TextInput, type TextInputProps } from 'react-native';
import { cn } from '@/lib/utils';

export interface InputProps extends TextInputProps {
  className?: string;
}

const Input = React.forwardRef<React.ElementRef<typeof TextInput>, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <TextInput
        ref={ref}
        className={cn(
          'h-12 rounded-md border border-input bg-background px-3 text-base placeholder:text-muted-foreground focus:border-ring',
          className
        )}
        placeholderTextColor="#94a3b8"
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

export { Input };
