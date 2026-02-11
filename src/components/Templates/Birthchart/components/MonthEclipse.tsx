import { type Eclipse } from "@/shared/types";
import { formatDegree } from "@/shared/lib/textHelpers";

export default function MonthEclipse({
  eclipse,
  monthLabel,
  year,
}: {
  eclipse: Eclipse;
  monthLabel: string;
  year: number;
}) {
  const date = new Date(eclipse.date);
  const day = date.getDate();

  return (
    <div className="p-4 bg-gray-700 rounded-md border border-gray-600">
      <div className="flex justify-between items-start">
        <h4 className="text-lg font-medium text-white">{eclipse.type}</h4>
        <span className="text-gray-400 text-sm">
          {monthLabel} {day}, {year}
        </span>
      </div>
      <p className="text-gray-300 text-sm mt-1">
        {eclipse.position.sign}{" "}
        {formatDegree(eclipse.position.degree, eclipse.position.minute)}{" "}
        &middot; {eclipse.modality}
      </p>
    </div>
  );
}
