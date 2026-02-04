import { cn } from '@/shared/lib/css';
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Field,
  Label
} from '@headlessui/react';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { type RefObject, useState } from 'react';
import { useController, type UseControllerProps } from 'react-hook-form';

type Item = {
  id: string | number;
  name: string;
};

type InputAutocompleteProps<
  T extends Item,
  // This any is expected because it's a generic type for form values
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TFormValues extends Record<string, any>
> = Omit<
  React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >,
  'name'
> &
  Omit<UseControllerProps<TFormValues>, 'control'> & {
    ref?: RefObject<HTMLInputElement | null>;
    // Forces control to be passed down
    control: NonNullable<UseControllerProps<TFormValues>['control']>;
    label?: string;
    // Force items to be passed as a prop
    items: T[];
    renderItem?: (item: T) => React.ReactNode;
    // This is a default naming for the input read only
    // eslint-disable-next-line react/boolean-prop-naming
    readOnly?: boolean;
  };

const InputAutocomplete = <
  T extends Item,
  // This any is expected because it's a generic type for form values
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TFormValues extends Record<string, any>
>({
  label,
  className,
  items,
  renderItem,
  ...props
}: InputAutocompleteProps<T, TFormValues>) => {
  const {
    field: { onChange, value },
    fieldState: { error }
  } = useController(props);

  // Intentionally not using `control` prop here
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { control, disabled, readOnly, required, ...fieldProps } = props;

  // Internal state for the query
  const [query, setQuery] = useState('');

  const filteredItems =
    query === ''
      ? items
      : items.filter((item) =>
          item.name.toLowerCase().includes(query.toLowerCase())
        );

  return (
    <Field className={className}>
      {/* Label */}
      <div className="flex items-center">
        <Label className="pb-[5px] text-gray-400">
          {label}
          {required && <span className="text-danger-400">*</span>}
        </Label>
      </div>

      <Combobox<T | null>
        disabled={disabled || readOnly}
        value={value || null}
        virtual={{ options: filteredItems }}
        onChange={readOnly ? () => {} : onChange}
        onClose={() => setQuery('')}
      >
        <div className="relative">
          <span
            className={cn(
              'absolute top-0 bottom-0 left-2 flex h-full items-center justify-center',
              {
                'text-gray-300': readOnly || disabled,
                'text-primary-300': !readOnly && !disabled
              }
            )}
          >
            <MagnifyingGlassIcon className="pointer-none w-6" />
          </span>
          <ComboboxInput<T>
            disabled={disabled || readOnly}
            displayValue={(item) => item?.name}
            className={cn(
              'w-full rounded-md border-1 px-(--custom-xs) py-(--custom-xs) pr-[32px] pl-[32px]',
              {
                'focus:border-primary-400 focus:ring-primary-400 border-gray-300 bg-white':
                  !readOnly && !disabled,
                'cursor-not-allowed border-gray-200 bg-gray-50 text-gray-500':
                  readOnly || disabled
              }
            )}
            onChange={
              readOnly ? () => {} : (event) => setQuery(event.target.value)
            }
            {...fieldProps}
          />
        </div>

        {error && (
          <div className="text-danger-400 animate-slideUp flex items-center py-1 text-sm">
            {error.message}
          </div>
        )}

        <ComboboxOptions
          anchor="bottom"
          className="slide-in-from-top-10 data-open:animate-in mt-1 max-h-48! w-(--input-width) overflow-y-auto rounded-md border border-gray-200 bg-white shadow-lg empty:invisible"
        >
          {({ option: item }: { option: T }) => (
            <ComboboxOption
              key={item.id}
              value={item}
              className={cn('group w-full', {
                ['cursor-pointer px-(--custom-sm) py-2 data-focus:bg-gray-100 data-selected:font-bold']:
                  !renderItem
              })}
            >
              {renderItem ? renderItem(item) : item.name}
            </ComboboxOption>
          )}
        </ComboboxOptions>
      </Combobox>
    </Field>
  );
};

export default InputAutocomplete;
