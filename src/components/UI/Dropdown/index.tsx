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
  const [mounted, setMounted] = useState(false);
  const [internalValue, setInternalValue] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    setInternalValue(value);
  }, []);

  useEffect(() => {
    if (mounted) setInternalValue(value);
  }, [value, mounted]);

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

  return (
    <Select.Root
      disabled={disabled}
      value={internalValue || placeholder}
      onValueChange={handleValueChange}
    >
      <Select.Trigger
        aria-label={resolvedPlaceholder}
        className={cn(
          "border-1 border-black inline-flex min-w-fit cursor-pointer items-center justify-between rounded-md text-black  min-w-32 px-(--custom-xs) py-(--custom-xs)",
          "focus:border-primary-400 focus:ring-1 focus:ring-primary-400 focus:bg-primary-100",
          triggerClassName,
        )}
      >
        {triggerPrefix ? (
          <span className="flex items-center">{triggerPrefix}</span>
        ) : null}
        <Select.Value
          className={cn("text-left", valueClassName)}
          placeholder={resolvedPlaceholder}
          suppressHydrationWarning
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
            "z-50 overflow-hidden rounded-sm p-4 [box-shadow:0px_10px_38px_-10px_rgba(22,23,24,0.35),0px_10px_20px_-15px_rgba(22,23,24,0.2)] bg-white",
            contentClassName,
          )}
        >
          <Select.Viewport
            className="[&::-webkit-scrollbar-thumb]:bg-black [&::-webkit-scrollbar-thumb:hover]:bg-grey [&::-webkit-scrollbar-track]:bg-grey overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full"
            style={{
              maxHeight,
              scrollbarWidth: "thin",
              scrollbarColor: "#d1d5db #f3f4f6",
            }}
          >
            {options.map((option) => (
              <Select.Item
                key={option.value}
                className="data-highlighted:bg-primary-100 text-md focus:border-primary-400 relative flex h-6 items-center rounded-sm py-0 pr-8 pl-2.5 leading-none select-none focus-visible:outline-none data-[state=checked]:font-semibold"
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
