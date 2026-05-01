export type CategoryId =
  | "portfolio-insights"
  | "risk-mitigation"
  | "loan-evaluation"
  | "scenario-analysis";

export type Category = {
  id: CategoryId;
  name: string;
  shortLabel: string;
  description: string;
};

export type WizardQuestion =
  | {
      id: WizardAnswerKey;
      type: "textarea" | "one-word";
      prompt: string;
      placeholder?: string;
      goesToBoard?: boolean;
    }
  | {
      id: WizardAnswerKey;
      type: "choice";
      prompt: string;
      options: { value: string; label: string }[];
      goesToBoard?: boolean;
    }
  | {
      id: WizardAnswerKey;
      type: "scale";
      prompt: string;
      min: number;
      max: number;
      minLabel: string;
      maxLabel: string;
      goesToBoard?: boolean;
    };

export type WizardAnswerKey =
  | "context"
  | "oneWord"
  | "disappointment"
  | "comfort"
  | "docsRating"
  | "wishlist";

export type WizardAnswers = {
  context: string;
  oneWord: string;
  disappointment:
    | "very_disappointed"
    | "somewhat_disappointed"
    | "not_disappointed";
  comfort: string;
  docsRating: number;
  wishlist: string;
};

export type WizardSubmission = {
  category_id: CategoryId;
  name: string;
  company: string;
  answers: WizardAnswers;
};
