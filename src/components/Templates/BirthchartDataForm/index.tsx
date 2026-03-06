"use client";

import Dropdown from "@/components/UI/Dropdown";
import Input from "@/components/UI/Form/Input";
import * as constants from "@/shared/lib/constants";
import { useForm, Controller } from "react-hook-form";
import * as Form from "@radix-ui/react-form";
import InputTimePicker from "@/components/UI/Form/InputTimePicker";
import { Time } from "@internationalized/date";
import { useEffect, useState } from "react";
import { type TimeValue } from "react-aria";
import Button from "@/components/UI/Button";
import PlacesAutocomplete, {
  type PlaceDetails,
} from "@/components/UI/PlacesAutocomplete";

type BirthchartFormData = {
  day: string;
  month: string;
  year: string;
  time: TimeValue | null;
  place: PlaceDetails | null;
};

type BirthchartDataFormProps = {
  onSubmit: (data: BirthchartFormData) => Promise<void>;
};

export default function BirthchartDataForm({
  onSubmit,
}: BirthchartDataFormProps): React.ReactNode {
  const today = new Date();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<BirthchartFormData>({
    defaultValues: {
      day: today.getDate().toString(),
      month: constants.MONTHS[today.getMonth()].value,
      year: today.getFullYear().toString(),
      time: new Time(12, 0),
      place: null,
    },
  });

  useEffect(() => {
    reset({
      day: today.getDate().toString(),
      month: constants.MONTHS[today.getMonth()].value,
      year: today.getFullYear().toString(),
      time: new Time(12, 0),
      place: null,
    });
  }, [reset]);

  return (
    <Form.Root
      className="flex w-[100%] flex-col py-8"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex w-full gap-4 items-start">
        {/* Day */}
        <Input
          label="Day"
          error={errors.day?.message}
          type="number"
          containerClassName="flex-1"
          {...register("day", {
            required: "Day is required",
            min: { value: 1, message: "Day must be at least 1" },
            max: { value: 31, message: "Day must be at most 31" },
          })}
        />

        {/* Month */}
        <div>
          <label className="block mb-2 text-gray-400">Month</label>
          <Controller
            name="month"
            control={control}
            rules={{ required: "Month is required" }}
            render={({ field }) => (
              <Dropdown
                options={constants.MONTHS.map((m) => ({
                  label: m.label,
                  value: m.value,
                }))}
                placeholder="Select month"
                onChange={(value) => field.onChange(value)}
                value={field.value}
              />
            )}
          />
          {errors.month && (
            <p className="text-red-500 text-sm mt-1">{errors.month.message}</p>
          )}
        </div>

        {/* Year */}
        <Input
          label="Year"
          error={errors.year?.message}
          type="number"
          containerClassName="flex-1"
          {...register("year", {
            required: "Year is required",
            min: { value: 1900, message: "Year must be at least 1900" },
            max: { value: 2100, message: "Year must be at most 2100" },
          })}
        />

        {/* Time */}
        <Controller
          name="time"
          control={control}
          rules={{ required: "Birth time is required" }}
          render={({ field }) => (
            <InputTimePicker
              name="birthTime"
              label="Birth Time"
              value={field.value}
              onChange={field.onChange}
              isRequired
              error={errors.time?.message}
              hourCycle={12}
            />
          )}
        />
      </div>

      {/* Places Autocomplete */}
      <Controller
        name="place"
        control={control}
        rules={{ required: "Place is required" }}
        render={({ field }) => (
          <PlacesAutocomplete
            name="place"
            label="Birthplace"
            onSelect={(place) => field.onChange(place)}
            error={errors.place?.message}
          />
        )}
      />

      <Button type="submit" className="w-full mt-6">
        Submit
      </Button>
    </Form.Root>
  );
}
