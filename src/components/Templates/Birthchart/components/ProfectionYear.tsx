import { getOrdinal } from "@/shared/lib/textHelpers";
import { signDescriptions, houseTopics } from "@/shared/lib/text";
import { type ProfectionYearData } from "@/shared/types";

type ProfectionYearProps = {
  data: ProfectionYearData;
};

const lordDescriptions: Record<string, string> = {
  Mars: "Take bold action and pursue your goals with courage. Watch for conflicts but use your drive productively.",
  Venus:
    "Focus on relationships, creativity, and enjoying life's pleasures. A year for harmony and beauty.",
  Mercury:
    "Communication and learning take center stage. Great for studies, writing, and making connections.",
  Moon: "Emotional growth and domestic matters are highlighted. Trust your intuition and nurture yourself.",
  Sun: "Step into the spotlight and express your authentic self. A year for leadership and vitality.",
  Jupiter:
    "Expansion and opportunities abound. Say yes to growth, travel, and broadening your horizons.",
  Saturn:
    "A year of hard work and building foundations. Embrace discipline for lasting achievements.",
  Uranus:
    "Expect the unexpected. Embrace change and innovation, even if it feels disruptive.",
  Neptune:
    "Spiritual and creative pursuits flourish. Stay grounded while exploring your dreams.",
  Pluto:
    "Deep transformation awaits. Let go of what no longer serves you and embrace rebirth.",
};

export default function ProfectionYear({ data }: ProfectionYearProps) {
  const { profectionYear, profectionSign, lordOfYear } = data;

  const houseThemes = `Your ${houseTopics[profectionYear]
    .join(", ")
    .replace(/, ([^,]*)$/, ", and $1")}.`;

  const signText = `This year emphasizes being 
              ${signDescriptions[profectionSign].join(", ").replace(/, ([^,]*)$/, ", and $1")} in areas of life related to 
              ${houseThemes.toLowerCase()}`;

  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-xl font-semibold mb-4">Your Annual Profection</h3>

        <div className="p-6 bg-gray-800 rounded-lg border border-gray-700 space-y-4">
          <div className="flex items-center gap-4">
            <div className="text-4xl font-bold text-white">
              {profectionYear}
            </div>
            <div>
              <p className="text-lg text-white">
                {getOrdinal(profectionYear)} House Year
              </p>
              <p className="text-gray-400 text-sm">{houseThemes || ""}</p>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-4">
            <h4 className="text-lg font-medium text-white mb-2">
              Profected to {profectionSign}
            </h4>
            <p className="text-gray-300">{signText}</p>
          </div>

          <div className="border-t border-gray-700 pt-4">
            <h4 className="text-lg font-medium text-white mb-2">
              Lord of the Year: {lordOfYear}
            </h4>
            <p className="text-gray-300">
              {lordDescriptions[lordOfYear] ||
                `${lordOfYear} guides your year with its unique energy.`}
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Pay attention to {lordOfYear}&apos;s transits and condition in
              your natal chart for timing of key events.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
