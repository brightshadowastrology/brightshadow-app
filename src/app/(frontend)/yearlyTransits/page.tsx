import AppProvider from "@/components/Providers/AppProvider";
import YearlyTransits from "@/components/Templates/YearlyTransits";

export default function BirthchartPage() {
  return (
    <AppProvider>
      <YearlyTransits />
    </AppProvider>
  );
}
