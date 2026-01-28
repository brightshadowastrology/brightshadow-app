import Dropdown from "@/components/UI/Dropdown";
import { useState } from "react";

export default function Birthchart() {
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

  const months = [
    { label: "January", value: "01" },
    { label: "February", value: "02" },
    { label: "March", value: "03" },
    { label: "April", value: "04" },
    { label: "May", value: "05" },
    { label: "June", value: "06" },
    { label: "July", value: "07" },
    { label: "August", value: "08" },
    { label: "September", value: "09" },
    { label: "October", value: "10" },
    { label: "November", value: "11" },
    { label: "December", value: "12" },
  ];

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <h2>Enter Birthchart Data</h2>
        {/* Month */}
        <Dropdown
          options={months}
          placeholder="Select month"
          onChange={setSelectedMonth}
          value={selectedMonth}
        />
      </main>
    </div>
  );
}
