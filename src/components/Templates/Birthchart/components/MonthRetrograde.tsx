import { type RetrogradeEvent } from "./MajorTransits";
import { formatDegree } from "@/shared/lib/textHelpers";

export default function MonthRetrograde({
  retrograde,
  monthLabel,
  year,
}: {
  retrograde: RetrogradeEvent;
  monthLabel: string;
  year: number;
}) {
  const date = new Date(retrograde.date);
  const phase = retrograde.isStarting
    ? "Mercury Retrograde begins"
    : "Mercury Retrograde ends";

  return (
    <div className="p-4 bg-gray-700 rounded-md border border-gray-600">
      <div className="flex justify-between items-start">
        <h4 className="text-lg font-medium text-white">{phase}</h4>
        <span className="text-gray-400 text-sm">
          {monthLabel} {date.getDate()}, {year}
        </span>
      </div>
      <p className="text-gray-300 text-sm mt-1">
        {retrograde.position.sign}{" "}
        {formatDegree(retrograde.position.degree, retrograde.position.minute)}
      </p>
    </div>
  );
}
