'use client';

import { cn } from '@/shared/lib/css';
import {
  getLocalTimeZone,
  parseDate,
  type CalendarDate
} from '@internationalized/date';
import { CaretLeftIcon, CaretRightIcon } from '@radix-ui/react-icons';
import { useCallback, useMemo } from 'react';
import {
  Button,
  Calendar,
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeaderCell,
  Heading,
  type CalendarProps
} from 'react-aria-components';

type InputDateProps<T extends CalendarDate> = Omit<
  CalendarProps<T>,
  'aria-label' | 'value' | 'onChange'
> & {
  // Forces aria-label to be passed down
  'aria-label': string;
  value?: Date | null;
  onChange?: (date: Date) => void;
  onMonthChange?: (date: Date, newMonth: 'prev' | 'next') => void;
};

const InputDate = <T extends CalendarDate>({
  className,
  value: valueProps,
  onChange: onChangeProps,
  onMonthChange: onMonthChangeProps,
  ...props
}: InputDateProps<T>) => {
  const value = useMemo(() => {
    const val = valueProps?.toISOString().split('T');

    return parseDate(
      val?.[0] ||
        // Today, generating it here rather than storing in a variable, just so it only executes if val is undefined
        new Date(Date.now()).toISOString().split('T')[0]
    );
  }, [valueProps]);

  const onChange = useCallback(
    (date: CalendarDate) => {
      onChangeProps?.(date.toDate(getLocalTimeZone()));
    },
    [onChangeProps]
  );

  const onMonthChange = useCallback(
    (newMonth: 'prev' | 'next') => () => {
      onMonthChangeProps?.(value.toDate(getLocalTimeZone()), newMonth);
    },
    [onMonthChangeProps, value]
  );

  return (
    <Calendar
      className={cn(
        'flex h-full w-full flex-col items-center justify-center',
        className
      )}
      {...props}
      value={value}
      onChange={onChange}
    >
      <header className="m-[0_4px_.5rem_4px] flex w-full items-center">
        <Button
          className="h-8 w-8 cursor-pointer p-0"
          slot="previous"
          onClick={onMonthChange('prev')}
        >
          <CaretLeftIcon className="h-6 w-6" />
        </Button>
        <Heading className="m-0 flex-[1] text-center" />
        <Button
          className="h-8 w-8 cursor-pointer p-0"
          slot="next"
          onClick={onMonthChange('next')}
        >
          <CaretRightIcon className="h-6 w-6" />
        </Button>
      </header>
      <CalendarGrid className="w-full">
        <CalendarGridHeader>
          {(day) => <CalendarHeaderCell>{day}</CalendarHeaderCell>}
        </CalendarGridHeader>
        <CalendarGridBody>
          {(date) => (
            <CalendarCell
              date={date}
              className={cn(
                // Base
                'm-px mx-auto w-8 cursor-default rounded-full text-center leading-8 outline-0 forced-color-adjust-none not-disabled:cursor-pointer',
                // Today:
                'not-data-selected:not-hover:data-today:bg-primary-100',
                // Days outside of the month
                'data-outside-month:hidden',
                'data-unavailable:cursor-not-allowed data-unavailable:opacity-20',
                // Hover
                'hover:bg-primary-400 hover:text-white',
                // Pressed(if mouse is currently clicking)
                'data-pressed:bg-primary-400 data-pressed:text-white',
                // Focused(if user navigates with keyboard)
                'data-focus-visible:outline-primary-500 data-focus-visible:outline-2 data-focus-visible:outline-offset-2',
                // Selected
                'not-hover:data-selected:bg-primary-700 not-hover:data-selected:text-white'
              )}
            />
          )}
        </CalendarGridBody>
      </CalendarGrid>
    </Calendar>
  );
};

export default InputDate;
