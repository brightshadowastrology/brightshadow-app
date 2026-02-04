import { cn } from "@/shared/lib/css";
import { useEffect, useState } from "react";
import { type TimeValue } from "react-aria";
import {
  TimeField as AriaTimeField,
  DateInput,
  DateSegment,
  FieldError,
  TimeFieldProps as AriaTimeFieldProps,
} from "react-aria-components";
import { type TimeFieldStateOptions } from "react-stately";

type InputTimePickerProps<T extends TimeValue = TimeValue> =
  AriaTimeFieldProps<T> &
    Omit<TimeFieldStateOptions, "locale"> & {
      name: string;
      containerClassName?: string;
      className?: string;
      required?: boolean;
      label?: React.ReactNode;
      error?: React.ReactNode;
      locale?: string;
      date?: Date;
    };

export default function InputTimePicker({
  label,
  error,
  containerClassName,
  className,
  ...props
}: InputTimePickerProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className={cn("flex flex-col gap-2", containerClassName)}>
      {label && (
        <span className="text-gray-400">
          {label}
          {props.isRequired && <span className="text-danger-400">*</span>}
        </span>
      )}

      {mounted ? (
        <AriaTimeField {...props}>
          <DateInput
            className={cn(
              "flex w-full rounded-md border-1 border-black py-(--custom-xs)",
              "focus-within:border-black focus-within:ring-1 focus-within:ring-primary-400",
              "hover:border-gray-400",
              className,
            )}
          >
            {(segment) => (
              <DateSegment
                segment={segment}
                className={cn(
                  "rounded px-0.5 tabular-nums outline-none",
                  "focus:bg-primary-100 focus:text-primary-900",
                  "placeholder-shown:text-gray-400",
                  segment.isPlaceholder && "text-gray-400",
                )}
              />
            )}
          </DateInput>
        </AriaTimeField>
      ) : (
        <div
          className={cn(
            "flex w-full rounded-md border-1 border-gray-300",
            "hover:border-gray-400",
            className,
          )}
        >
          <span className="rounded px-1 py-1 tabular-nums text-gray-400">
            --:--
          </span>
        </div>
      )}

      {error && (
        <FieldError className="text-danger-400 text-sm">{error}</FieldError>
      )}
    </div>
  );
}
