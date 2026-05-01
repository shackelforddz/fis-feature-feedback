import type { WizardQuestion } from "@/lib/types";

export const portfolioQuestions: WizardQuestion[] = [
  {
    id: "context",
    type: "choice",
    prompt:
      "When your team reaches out to a prospect today, how would you describe the trigger that got them there?",
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
      "What is one word you would use to describe what portfolio insights offers?",
    placeholder: "One word",
  },
  {
    id: "disappointment",
    type: "choice",
    prompt:
      "If you were to use portfolio insights for 2-3 months and then someone took it away, how would you feel?",
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
      "If the system flags an opportunity for you, what information would you need to see about that opportunity to feel comfortable calling a client?",
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
      "Is there anything that you would add or take away from portfolio insights?",
    goesToBoard: true,
  },
];
