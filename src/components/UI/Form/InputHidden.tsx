import { unstable_PasswordToggleField as PasswordToggleField } from 'radix-ui';
import { EyeClosedIcon, EyeOpenIcon } from '@radix-ui/react-icons';
import { type ComponentProps } from 'react';
import * as Form from '@radix-ui/react-form';

type InputProps = Omit<
  React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >,
  'name'
> &
  ComponentProps<(typeof PasswordToggleField)['Input']> & {
    name: string;
    label?: React.ReactNode;
    error?: React.ReactNode;
  };

const InputHidden: React.FC<InputProps> = ({ label, error, ...props }) => {
  const { required, name } = props;
  return (
    <Form.Field className="mb-(--custom-md)" name={name}>
      <div className="flex items-center">
        <Form.Label className="pb-[5px]">
          <span className="text-gray-400">{label}</span>{' '}
          {required && <span className="text-danger-400">*</span>}
        </Form.Label>
      </div>
      <PasswordToggleField.Root>
        <div className="focus:border-primary-400 focus:ring-primary-400 flex w-full justify-between rounded-md border-1 border-gray-300 px-(--custom-sm) py-(--custom-xs) text-gray-400">
          <PasswordToggleField.Input
            className="bg-transparent outline-none"
            style={{ width: '90%' }}
            {...props}
          />
          <PasswordToggleField.Toggle className="Toggle">
            <PasswordToggleField.Icon
              hidden={<EyeClosedIcon />}
              visible={<EyeOpenIcon />}
            />
          </PasswordToggleField.Toggle>
        </div>
      </PasswordToggleField.Root>
      <div className="text-danger-400 flex items-center py-1 text-sm">
        {error && <Form.Message>{error}</Form.Message>}
      </div>
    </Form.Field>
  );
};

export default InputHidden;
