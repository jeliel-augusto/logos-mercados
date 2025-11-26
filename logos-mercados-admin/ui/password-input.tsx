import { PasswordInput as MantinePasswordInput } from '@mantine/core';

interface PasswordInputProps extends React.ComponentProps<typeof MantinePasswordInput> {
  // Extends all Mantine PasswordInput props
}

export function PasswordInput({ ...props }: PasswordInputProps) {
  return <MantinePasswordInput {...props} />;
}
