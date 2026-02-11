import { type RetrogradePeriod } from "@/shared/types";
import { formatDate, formatDegree } from "@/shared/lib/textHelpers";

export default function MonthRetrograde({
  retrograde,
  month,
  year,
}: {
  retrograde: RetrogradePeriod;
  month: number;
  year: number;
}) {
  const startDate = new Date(retrograde.start.date);
  const endDate = new Date(retrograde.end.date);
  const startsThisMonth =
    startDate.getMonth() === month && startDate.getFullYear() === year;
  const endsThisMonth =
    endDate.getMonth() === month && endDate.getFullYear() === year;

  let phase = "Mercury Retrograde (ongoing)";
  if (startsThisMonth && endsThisMonth) {
    phase = "Mercury Retrograde (starts & ends)";
  } else if (startsThisMonth) {
    phase = "Mercury Retrograde begins";
  } else if (endsThisMonth) {
    phase = "Mercury Retrograde ends";
  }

  return (
    <div className="p-4 bg-gray-700 rounded-md border border-gray-600">
      <h4 className="text-lg font-medium text-white">{phase}</h4>
      <div className="flex justify-between items-start mt-1">
        <p className="text-gray-300 text-sm">
          {formatDate(retrograde.start.date)} &ndash;{" "}
          {formatDate(retrograde.end.date)}
        </p>
      </div>
      <p className="text-gray-300 text-sm mt-1">
        {retrograde.start.position.sign}{" "}
        {formatDegree(
          retrograde.start.position.degree,
          retrograde.start.position.minute,
        )}{" "}
        &rarr; {retrograde.end.position.sign}{" "}
        {formatDegree(
          retrograde.end.position.degree,
          retrograde.end.position.minute,
        )}
      </p>
    </div>
  );
}
