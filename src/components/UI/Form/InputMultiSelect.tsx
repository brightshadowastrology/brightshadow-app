import * as Form from '@radix-ui/react-form';
import { useController, type UseControllerProps } from 'react-hook-form';
import {
  ComboBox,
  Input,
  Label,
  ListBox,
  ListBoxItem,
  Popover,
  type ComboBoxProps
} from 'react-aria-components';
import { cn } from '@/shared/lib/css';
import { MagnifyingGlassIcon, Cross2Icon } from '@radix-ui/react-icons';
import { useState } from 'react';

type Item = {
  id: number;
  name: string;
};

const SELECT_ALL_KEY = '__select_all__';

type InputMultiSelectProps<
  T extends Item,
  // This any is expected because it's a generic type for form values
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TFormValues extends Record<string, any>
> = Omit<
  ComboBoxProps<T>,
  'children' | 'defaultItems' | 'selectedKey' | 'onSelectionChange'
> &
  Omit<
    React.DetailedHTMLProps<
      React.InputHTMLAttributes<HTMLInputElement>,
      HTMLInputElement
    >,
    'name' | 'value' | 'onChange'
  > &
  Omit<UseControllerProps<TFormValues>, 'control' | 'defaultValue'> & {
    name: string;
    label?: string;
    containerClassName?: string;
    items: T[];
    control: NonNullable<UseControllerProps<TFormValues>['control']>;
    renderItem?: (item: T) => React.ReactNode;
    allowSelectAll?: boolean;
    selectAllLabel?: string;
    hint?: string;
  };

const InputMultiSelect = <
  T extends Item,
  // This any is expected because it's a generic type for form values
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TFormValues extends Record<string, any>
>({
  label,
  className,
  containerClassName,
  items,
  defaultValue = [],
  allowSelectAll = false,
  selectAllLabel = 'Select all',
  hint,

  renderItem,
  ...props
}: InputMultiSelectProps<T, TFormValues>) => {
  const { required } = props;
  const [inputValue, setInputValue] = useState('');
  const {
    field: { onChange, name, value = [] as number[] },
    fieldState: { error }
  } = useController(props);

  const shouldShowSelectAll = allowSelectAll && items.length > 0;
  const selectedItems = items
    ? items.filter((item) => value.includes(item.id))
    : [];
  const filteredItems = items
    ? items.filter(
        (item) =>
          !value.includes(item.id) &&
          item.name.toLowerCase().includes(inputValue.toLowerCase())
      )
    : [];

  const handleSelect = (selectedKey: string | number | null) => {
    if (selectedKey === null) {
      return;
    }

    if (selectedKey === SELECT_ALL_KEY) {
      const allIds = items.map((item) => item.id);
      const alreadyAllSelected =
        allIds.length === value.length &&
        allIds.every((id) => value.includes(id));

      if (!alreadyAllSelected) {
        onChange(allIds);
      }

      setInputValue('');
      return;
    }

    const numericKey =
      typeof selectedKey === 'string' ? Number(selectedKey) : selectedKey;

    if (!Number.isFinite(numericKey)) {
      return;
    }

    if (!value.includes(numericKey)) {
      onChange([...value, numericKey]);
      setInputValue('');
    }
  };

  const handleRemove = (itemId: number) => {
    onChange(value.filter((id: number) => id !== itemId));
  };

  return (
    <Form.Field className="mb-(--custom-md)" name={name}>
      <div className="flex items-center">
        <Form.Label className="pb-[5px]">
          <Label className="text-gray-400">{label}</Label>
          {required && <span className="text-danger-400">*</span>}
        </Form.Label>
      </div>

      <ComboBox
        inputValue={inputValue}
        onInputChange={setInputValue}
        onSelectionChange={handleSelect}
      >
        <div className={cn('relative', containerClassName)}>
          <span className="absolute top-0 bottom-0 left-2 flex h-full items-center justify-center">
            <MagnifyingGlassIcon className="pointer-none text-primary-300 w-6" />
          </span>
          <Form.Control asChild>
            <Input
              value={inputValue}
              className={cn(
                'focus:border-primary-400 focus:ring-primary-400 w-full rounded-md border-1 border-gray-300 bg-white px-(--custom-xs) py-(--custom-xs) pr-[32px] pl-[32px]',
                className
              )}
              placeholder={
                selectedItems.length > 0
                  ? `${selectedItems.length} sélectionné(s)`
                  : 'Rechercher...'
              }
              onChange={(e) => setInputValue(e.target.value)}
            />
          </Form.Control>
          {hint && <div className="mt-2 text-sm text-gray-400">{hint}</div>}
          {error && (
            <div className="text-danger-400 flex items-center py-1 text-sm">
              <Form.Message>{error.message}</Form.Message>
            </div>
          )}
        </div>

        <Popover className="w-(--trigger-width)">
          <ListBox className="block max-h-48 min-h-[unset] w-[unset] overflow-y-auto rounded-md border border-gray-200 bg-white shadow-lg">
            {shouldShowSelectAll && (
              <ListBoxItem
                className="bg-primary-50 text-primary-600 hover:bg-primary-100 data-focused:bg-primary-100 data-pressed:bg-primary-100 border-b border-gray-200 px-(--custom-sm) py-2 font-semibold data-focus-visible:outline-0"
                id={SELECT_ALL_KEY}
              >
                {selectAllLabel}
              </ListBoxItem>
            )}
            {filteredItems.map((item) => (
              <ListBoxItem
                key={item.id}
                className="cursor-pointer px-(--custom-sm) py-2 hover:bg-gray-100 data-focus-visible:outline-0 data-focused:bg-gray-100 data-pressed:bg-gray-100 data-selected:font-bold"
                id={item.id}
                textValue={item.name}
              >
                {renderItem ? renderItem(item) : item.name}
              </ListBoxItem>
            ))}
          </ListBox>
        </Popover>
      </ComboBox>

      {/* Selected items - positioned below input */}
      <div className="mt-2 flex flex-wrap gap-2">
        {selectedItems.map((item) => (
          <div
            key={item.id}
            className="bg-primary-100 text-primary-800 flex h-fit items-center gap-2 rounded-md px-2 py-1 text-sm"
          >
            <span>{renderItem ? renderItem(item) : item.name}</span>
            <button
              aria-label={`Retirer ${item.name}`}
              className="hover:bg-primary-200 rounded-full p-1"
              type="button"
              onClick={() => handleRemove(item.id)}
            >
              <Cross2Icon className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>
    </Form.Field>
  );
};

export default InputMultiSelect;
