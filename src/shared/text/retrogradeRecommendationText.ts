export const getRetrogradeRecommendationText = (
  retrogradePlanet: string,
  houseTopics: string,
): string => {
  switch (retrogradePlanet) {
    case "mercury":
      return `This is a time when you may miscommunicate or experience delays around your ${houseTopics}. For these same reasons however, it's an excellent time to slow down, review, and reconsider these areas of life.`;
    case "venus":
      return `This is a time when relationships, values, and finances connected to your ${houseTopics} may feel uncertain or require revisiting. Use this period to reflect on what truly matters to you in these areas before making new commitments.`;
    case "mars":
      return `This is a time when your drive and momentum around your ${houseTopics} may stall or turn inward. Rather than pushing forward, use this period to reassess your strategy and conserve your energy for when direct motion resumes.`;
    default:
      return `This is a time when the themes of your ${houseTopics} may feel uncertain or require revisiting. Use this period to reflect on what truly matters to you in these areas before making new commitments.`;
  }
};
