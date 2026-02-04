import { cn } from "@/shared/lib/css";
import * as Form from "@radix-ui/react-form";
import { type PropsWithChildren } from "react";

export type InputProps = Omit<
  React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >,
  "name"
> & {
  containerClassName?: string;
  name: string;
  label?: React.ReactNode;
  error?: React.ReactNode;
};

const Input: React.FC<PropsWithChildren<InputProps>> = ({
  label,
  error,
  className,
  children,
  containerClassName,
  ...props
}) => {
  const { required, name } = props;

  return (
    <Form.Field className={cn("mb-2", containerClassName)} name={name}>
      <div className="flex items-center">
        <Form.Label className="pb-2">
          <span className="text-gray-400">{label}</span>
          {required && <span className="text-danger-400">*</span>}
        </Form.Label>
      </div>
      <div className="relative">
        {children}
        <Form.Control asChild>
          <input
            className={cn(
              "w-full rounded-md border-1 border-black px-(--custom-xs) py-(--custom-xs)",
              "focus:border-primary-400 focus:ring-1 focus:ring-primary-400 data-highlighted:bg-primary-100 focus:bg-primary-100",
              className,
            )}
            {...props}
          />
        </Form.Control>
      </div>
      <div className="text-danger-400 flex items-center py-1 text-sm">
        {error && <Form.Message>{error}</Form.Message>}
      </div>
    </Form.Field>
  );
};

export default Input;
