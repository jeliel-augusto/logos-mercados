import { Button as MantineButton } from '@mantine/core';

interface ButtonProps extends React.ComponentProps<typeof MantineButton> {
  // Extends all Mantine Button props
}

export function Button({ children, ...props }: ButtonProps) {
  return <MantineButton {...props}>{children}</MantineButton>;
}
