import type { WizardQuestion } from "@/lib/types";

export const loanEvaluationQuestions: WizardQuestion[] = [
  {
    id: "context",
    type: "choice",
    prompt:
      "How would you describe your approach to getting to a credit decision today?",
    options: [
      { value: "manual_random", label: "Manual / Random" },
      { value: "siloed", label: "Siloed / disconnected" },
      {
        value: "multiple_data_feeds",
        label: "Involves bringing together multiple data feeds",
      },
      {
        value: "synthesized_dashboard",
        label: "Involves viewing a dashboard of synthesized insights",
      },
      { value: "predictive_agentic", label: "Predictive / Agentic" },
    ],
  },
  {
    id: "oneWord",
    type: "one-word",
    prompt:
      "What is one word you would use to describe what proactive loan evaluation center offers?",
    placeholder: "One word",
  },
  {
    id: "disappointment",
    type: "choice",
    prompt:
      "If you were to use this for 2-3 months and then someone took it away, how would you feel?",
    options: [
      { value: "very_disappointed", label: "Very disappointed" },
      { value: "somewhat_disappointed", label: "Somewhat disappointed" },
      { value: "not_disappointed", label: "Not disappointed" },
    ],
  },
  {
    id: "comfort",
    type: "textarea",
    prompt:
      "If the system flagged a loan as a likely approval, what information would you need to see to go forward with the drafting of a credit memo for this loan?",
  },
  {
    id: "docsRating",
    type: "scale",
    prompt:
      "On a scale where 1 is a dealbreaker for your reputation and 5 is a strategic win for your speed, where do AI drafted documents land for you?",
    min: 1,
    max: 5,
    minLabel: "Dealbreaker for reputation",
    maxLabel: "Strategic win for speed",
  },
  {
    id: "wishlist",
    type: "textarea",
    prompt:
      "Is there anything that you would add or take away from the loan evaluation center?",
    goesToBoard: true,
  },
];
