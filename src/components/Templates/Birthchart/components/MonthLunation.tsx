import { type Lunation } from "@/shared/types";
import { formatDegree } from "@/shared/lib/textHelpers";

export default function MonthLunation({
  lunation,
  monthLabel,
  year,
}: {
  lunation: Lunation;
  monthLabel: string;
  year: number;
}) {
  const date = new Date(lunation.date);
  const day = date.getDate();
  const typeLabel =
    lunation.lunationType === "new moon" ? "New Moon" : "Full Moon";

  return (
    <div className="p-4 bg-gray-700 rounded-md border border-gray-600">
      <div className="flex justify-between items-start">
        <h4 className="text-lg font-medium text-white">{typeLabel}</h4>
        <span className="text-gray-400 text-sm">
          {monthLabel} {day}, {year}
        </span>
      </div>
      <p className="text-gray-300 text-sm mt-1">
        {lunation.position.sign}{" "}
        {formatDegree(lunation.position.degree, lunation.position.minute)}
      </p>
    </div>
  );
}
