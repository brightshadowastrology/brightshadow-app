"use client";

/**
 * NOTE: In Next.js App Router this component must be dynamically imported
 * with { ssr: false } to avoid server-side rendering errors with @react-pdf/renderer.
 *
 * Example:
 *   const BirthchartPDFDownload = dynamic(
 *     () => import('./pdf/BirthchartPDFDownload'),
 *     { ssr: false },
 *   );
 */

import { useBirthChart } from "@/components/Providers/BirthChartContext";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { BirthchartPDF } from "./BirthchartPDF";

export function BirthchartPDFDownload() {
  const { birthChartData, birthInfo, sectPlanets, isDayChart } = useBirthChart();

  if (!birthChartData || !sectPlanets) return null;

  const document = (
    <BirthchartPDF
      birthChartData={birthChartData}
      sectPlanets={sectPlanets}
      isDayChart={isDayChart}
      birthInfo={birthInfo}
    />
  );

  return (
    <PDFDownloadLink document={document} fileName="birthchart-report.pdf">
      {({ loading }) => (
        <button
          className="px-4 py-2 rounded-md bg-primary-600 hover:bg-primary-500 text-white text-sm font-medium transition-colors w-full"
          disabled={loading}
        >
          {loading ? "Generating PDF…" : "Download PDF"}
        </button>
      )}
    </PDFDownloadLink>
  );
}

export default BirthchartPDFDownload;
