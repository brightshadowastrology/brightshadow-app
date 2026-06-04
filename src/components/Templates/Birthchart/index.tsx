"use client";

import { BirthChartProvider } from "@/components/Providers/BirthChartContext";
import { type PlaceDetails } from "@/components/UI/PlacesAutocomplete";
import * as constants from "@/shared/lib/constants";
import { trpc } from "@/shared/lib/trpc";
import { type PlanetPoint, type SectPlanets } from "@/shared/types";
import moment from "moment-timezone";
import dynamic from "next/dynamic";
import { useState } from "react";
import { type TimeValue } from "react-aria";
import { type BirthInfo } from "@/shared/types";
import BirthchartDataForm from "../BirthchartDataForm";
import { getIsDayChart, getSectPlanets } from "@/shared/lib/textHelpers";
import BirthchartData from "./components/BirthchartData";

const BirthchartPDFDownload = dynamic(
  () => import("./pdf/BirthchartPDFDownload"),
  { ssr: false },
);

type BirthchartFormData = {
  day: string;
  month: string;
  year: string;
  time: TimeValue | null;
  place: PlaceDetails | null;
};

export default function Birthchart() {
  const [birthChartData, setBirthChartData] = useState<PlanetPoint[] | null>(
    null,
  );
  const [birthInfo, setBirthInfo] = useState<BirthInfo | null>(null);
  const [isDayChart, setIsDayChart] = useState<boolean | null>(null);
  const [sectPlanets, setSectPlanets] = useState<SectPlanets | null>(null);

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
        birthTime: `${String(data.time.hour).padStart(2, "0")}:${String(data.time.minute).padStart(2, "0")} ${data.time.hour >= 12 ? "PM" : "AM"}`,
        location:
          data.place.formattedAddress ||
          data.place.displayName ||
          "Unknown location",
      });

      // Get ascendant sign from birth chart and call getProfectionYear
      const ascendant = result.find((p) => p.planet === "Ascendant");
      const descendant = result.find((p) => p.planet === "Descendant");
      const sun = result.find((p) => p.planet === "Sun");
      if (ascendant && descendant && sun) {
        const isDayChart = getIsDayChart(sun, ascendant, descendant);
        setIsDayChart(isDayChart);
        const sectPlanetsResult = getSectPlanets(isDayChart, result);
        setSectPlanets(sectPlanetsResult);
      }
    } catch (error) {
      console.error("tRPC fetchQuery error:", error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center font-sansk">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-start py-32 px-16 sm:items-start">
        <div className="w-full flex justify-center">
          <h1 className="text-3xl">Birthchart Interpretation Report</h1>
        </div>

        <BirthchartDataForm onSubmit={onSubmit} />

        <BirthChartProvider
          value={birthChartData}
          birthInfo={birthInfo}
          profectionYear={null}
          isDayChart={isDayChart}
          sectPlanets={sectPlanets}
        >
          {birthChartData && sectPlanets && (
            <div className="mt-8 w-full space-y-4">
              <BirthchartPDFDownload />
              <BirthchartData
                data={birthChartData}
                isDayChart={isDayChart}
                sectPlanets={sectPlanets}
              />
            </div>
          )}
        </BirthChartProvider>
      </main>
    </div>
  );
}
