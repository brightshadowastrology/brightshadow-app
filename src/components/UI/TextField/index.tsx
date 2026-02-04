import * as React from 'react';
import Input from '@/components/UI/Form/Input';

export interface TextFieldProps {
  label?: string;
  value?: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  onChange?: (value: string) => void;
  setErrorMessage?: (message: string | null) => void;
}

export const TextField: React.FC<TextFieldProps> = ({
  label,
  value,
  placeholder,
  type = 'text',
  required = false,
  disabled = false,
  onChange,
  setErrorMessage = null
}) => {
  const [error, setError] = React.useState<string | null>(null);

  // Update the return JSX to use these handlers and display errors
  React.useEffect(() => {
    // Validate initial value if provided
    const validate = (val: string): boolean => {
      // Basic validation based on type
      if (val.length > 0) {
        if (type === 'email' && !/^\S+@\S+\.\S+$/.test(val)) {
          setError('Veuillez saisir une adresse email valide');
          setErrorMessage?.('Veuillez saisir une adresse email valide');
          return false;
        }

        // accept only format (514) 123-4567 or 514-123-4567
        if (
          type === 'phone' &&
          !/^\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{4}$/.test(val)
        ) {
          setError('Veuillez saisir un numéro de téléphone valide');
          setErrorMessage?.('Veuillez saisir un numéro de téléphone valide');
          return false;
        }
      }

      setError(null);
      setErrorMessage?.(null);
      return true;
    };

    if (value && value.length > 0) {
      validate(value);
    }
  }, [value]);

  // Clear error when user starts typing again
  const handleInputChange = (val: string) => {
    if (onChange) {
      onChange(val || '');
    }
  };

  // Wrapping this in another component for backwards compatibility
  return (
    <Input
      disabled={disabled}
      error={error}
      label={label}
      name="search" // ! This was set as search in the original code but is probably incorrect
      placeholder={placeholder || ''}
      required={required}
      type={type}
      value={value}
      onChange={(e) => handleInputChange(e.target.value)}
    />
  );
};

export default TextField;
