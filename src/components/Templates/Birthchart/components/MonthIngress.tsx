export type IngressEntry = { date: string; planet: string; sign: string };

export default function MonthIngress({
  ingress,
  monthLabel,
  year,
}: {
  ingress: IngressEntry;
  monthLabel: string;
  year: number;
}) {
  const date = new Date(ingress.date);
  const day = date.getDate();

  return (
    <div className="p-4 bg-gray-700 rounded-md border border-gray-600">
      <div className="flex justify-between items-start">
        <h4 className="text-lg font-medium text-white">
          {ingress.planet} enters {ingress.sign}
        </h4>
        <span className="text-gray-400 text-sm">
          {monthLabel} {day}, {year}
        </span>
      </div>
    </div>
  );
}
