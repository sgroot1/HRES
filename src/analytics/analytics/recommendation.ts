export interface Recommendation {

  title: string;

  confidence: number;

}

export function getRecommendation(): Recommendation {

  return {

    title:
      "Collect additional runs before making a setup change.",

    confidence: 0,

  };

}
