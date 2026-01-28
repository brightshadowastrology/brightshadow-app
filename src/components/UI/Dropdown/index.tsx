"use client";

import { cn } from "@/shared/lib/css";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { Select } from "radix-ui";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";

export type DropdownOption = {
  label: string;
  value: string;
};

export type DropdownProps = {
  align?: "center" | "end" | "start";
  caretIcon?: ReactNode;
  contentClassName?: string;
  disabled?: boolean;
  iconClassName?: string;
  isAlphabeticalSort?: boolean;
  maxHeight?: string;
  onChange: (value: string) => void;
  options: DropdownOption[];
  placeholder?: string;
  position?: "bottom" | "left" | "right" | "top";
  sideOffset?: number;
  triggerClassName?: string;
  triggerPrefix?: ReactNode;
  value: string | null;
  valueClassName?: string;
};

/**
 * Custom dropdown component using Radix UI Select.
 */
const Dropdown: React.FC<DropdownProps> = ({
  align = "center",
  caretIcon,
  contentClassName,
  disabled = false,
  iconClassName,
  isAlphabeticalSort = true,
  maxHeight = "200px",
  onChange,
  options,
  placeholder,
  position = "bottom",
  sideOffset = 0,
  triggerClassName,
  triggerPrefix,
  value,
  valueClassName,
}) => {
  const resolvedPlaceholder = placeholder ?? "--";
  const [internalValue, setInternalValue] = useState<string | null>(value);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  /**
   * Handle value change
   */
  const handleValueChange = (newValue: string) => {
    const selectedOption = options.find((option) => option.value === newValue);
    if (selectedOption) {
      setInternalValue(selectedOption.value);
      onChange(newValue);
    }
  };

  // * Sort options alphabetically by label - memoized for performance
  const sortedOptions = useMemo(() => {
    if (!isAlphabeticalSort) return options;
    return [...options].sort((a, b) => a.label.localeCompare(b.label));
  }, [options, isAlphabeticalSort]);

  return (
    <Select.Root
      disabled={disabled}
      value={internalValue || placeholder}
      onValueChange={handleValueChange}
    >
      <Select.Trigger
        aria-label={resolvedPlaceholder}
        className={cn(
          "border-overlay-6 px-sm py-sm focus:fancy-underline data-focus:fancy-underline inline-flex min-w-fit cursor-pointer items-center justify-between gap-2 rounded-md border text-white focus-visible:outline-none",
          triggerClassName,
        )}
      >
        {triggerPrefix ? (
          <span className="flex items-center">{triggerPrefix}</span>
        ) : null}
        <Select.Value
          className={cn("text-left", valueClassName)}
          placeholder={resolvedPlaceholder}
        />
        <Select.Icon className={cn("mt-0.5 ml-2", iconClassName)}>
          {caretIcon ?? <ChevronDownIcon />}
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content
          align={align}
          position="popper"
          side={position}
          sideOffset={sideOffset}
          style={{ maxHeight }}
          className={cn(
            "z-50 overflow-hidden rounded-sm p-4 [box-shadow:0px_10px_38px_-10px_rgba(22,23,24,0.35),0px_10px_20px_-15px_rgba(22,23,24,0.2)]",
            contentClassName,
          )}
        >
          <Select.Viewport
            className="[&::-webkit-scrollbar-thumb]:bg-overlay-3 [&::-webkit-scrollbar-thumb:hover]:bg-overlay-3 [&::-webkit-scrollbar-track]:bg-overlay-1 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full"
            style={{
              maxHeight,
              scrollbarWidth: "thin",
              scrollbarColor: "#d1d5db #f3f4f6",
            }}
          >
            {sortedOptions.map((option) => (
              <Select.Item
                key={option.value}
                className="data-highlighted:bg-overlay-5 text-md focus:fancy-underline relative flex h-6 items-center rounded-sm py-0 pr-8 pl-2.5 leading-none select-none focus-visible:outline-none data-highlighted:text-white data-[state=checked]:font-semibold"
                value={option.value}
              >
                <Select.ItemText>{option.label}</Select.ItemText>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
};

export default Dropdown;
