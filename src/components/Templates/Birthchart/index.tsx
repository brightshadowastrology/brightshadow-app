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
import { trpc } from "@/shared/lib/trpc";
import { type PlanetPoint, type ProfectionYearData } from "@/shared/types";
import { type BirthInfo } from "../../Providers/BirthChartContext";
import BirthchartData from "./components/BirthchartData";
import ProfectionYear from "./components/ProfectionYear";
import moment from "moment-timezone";
import YearlyTransits from "./components/YearlyTransits";
import { BirthChartProvider } from "../../Providers/BirthChartContext";

type BirthchartFormData = {
  day: string;
  month: string;
  year: string;
  time: TimeValue | null;
  place: PlaceDetails | null;
};

export default function Birthchart() {
  const today = new Date();
  const [birthChartData, setBirthChartData] = useState<PlanetPoint[] | null>(
    null,
  );
  const [profectionYear, setProfectionYear] =
    useState<ProfectionYearData | null>(null);
  const [birthInfo, setBirthInfo] = useState<BirthInfo | null>(null);
  const [isDayChart, setIsDayChart] = useState<boolean | null>(null);

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

  const trpcContext = trpc.useContext();

  const onSubmit = async (data: BirthchartFormData) => {
    if (!data.place?.location || !data.time) return;

    const monthIndex = constants.MONTHS.findIndex(
      (m) => m.value === data.month,
    );
    // datestring in this format: 1991-05-13 11:49:00
    const dateString = `${data.year}-${String(monthIndex + 1).padStart(2, "0")}-${String(data.day).padStart(2, "0")} ${String(
      data.time.hour,
    ).padStart(2, "0")}:${String(data.time.minute).padStart(2, "0")}:00`;

    // Convert from dateString to UTC using moment-timezone
    const utcDate = moment
      .tz(dateString, data.place.timeZone || "UTC")
      .utc()
      .toDate();

    try {
      const result = await trpcContext.fetchQuery([
        "astro.getBirthChartData",
        {
          date: utcDate,
          longitude: data.place.location.longitude,
          latitude: data.place.location.latitude,
        },
      ]);

      setBirthChartData(result);
      setBirthInfo({
        birthDate: dateString.split(" ")[0],
        birthTime: `${String(data.time.hour).padStart(2, "0")}:${String(data.time.minute).padStart(2, "0")}`,
        location: data.place.displayName,
      });

      // Get ascendant sign from birth chart and call getProfectionYear
      const ascendant = result.find((p) => p.planet === "Ascendant");
      const sun = result.find((p) => p.planet === "Sun");
      if (ascendant) {
        const profectionResult = await trpcContext.fetchQuery([
          "astro.getProfectionYear",
          {
            ascendantSign: ascendant.position.sign,
            birthdate: utcDate.toISOString(),
          },
        ]);
        setProfectionYear(profectionResult);
      }
      if (sun && ascendant) {
        const isDayChartResult = await trpcContext.fetchQuery([
          "astro.getIsDayChart",
          {
            sunPlacement: sun.position,
            ascendant: ascendant.position,
          },
        ]);
        setIsDayChart(isDayChartResult);
      }
    } catch (error) {
      console.error("tRPC fetchQuery error:", error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center font-sansk">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-start py-32 px-16 sm:items-start">
        <h2>Enter Birthchart Data</h2>

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
                <p className="text-red-500 text-sm mt-1">
                  {errors.month.message}
                </p>
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

        <BirthChartProvider value={birthChartData} birthInfo={birthInfo} profectionYear={profectionYear} isDayChart={isDayChart}>
          {birthChartData && (
            <div className="mt-8 w-full">
              <BirthchartData data={birthChartData} isDayChart={isDayChart} />
            </div>
          )}

          {profectionYear && (
            <div className="mt-8 w-full">
              <ProfectionYear data={profectionYear} />
            </div>
          )}

          {birthChartData && (
            <div className="mt-8 w-full">
              <YearlyTransits />
            </div>
          )}
        </BirthChartProvider>
      </main>
    </div>
  );
}
