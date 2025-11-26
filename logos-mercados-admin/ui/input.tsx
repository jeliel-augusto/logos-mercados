import { TextInput as MantineTextInput } from '@mantine/core';

interface InputProps extends React.ComponentProps<typeof MantineTextInput> {
  // Extends all Mantine TextInput props
}

export function Input({ ...props }: InputProps) {
  return <MantineTextInput {...props} />;
}
