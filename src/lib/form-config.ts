import type { Category, CategoryId, WizardQuestion } from "@/lib/types";
import { portfolioQuestions } from "@/content/portfolio-questions";
import { riskQuestions } from "@/content/risk-questions";
import { loanEvaluationQuestions } from "@/content/loan-evaluation-questions";
import { scenarioAnalysisQuestions } from "@/content/scenario-analysis-questions";

export const CATEGORIES: Category[] = [
  {
    id: "portfolio-insights",
    name: "Portfolio Insights",
    shortLabel: "Portfolio",
    description:
      "Identify upsell / cross-sell leads via lookalike modeling with generated documents for review.",
  },
  {
    id: "risk-mitigation",
    name: "Risk Mitigation",
    shortLabel: "Risk",
    description:
      "Surface warnings based on borrower health and external signals — with strategies to mitigate, restructure, or monetize.",
  },
  {
    id: "loan-evaluation",
    name: "Loan Evaluation Center",
    shortLabel: "Loan",
    description:
      "Pre-approve loans with supporting evidence and generated documents for review.",
  },
  {
    id: "scenario-analysis",
    name: "Visual Scenario Analysis",
    shortLabel: "Scenario",
    description:
      "Automate insight extraction for real-time stress testing of deal-structure variables.",
  },
];

export const QUESTIONS_BY_CATEGORY: Record<CategoryId, WizardQuestion[]> = {
  "portfolio-insights": portfolioQuestions,
  "risk-mitigation": riskQuestions,
  "loan-evaluation": loanEvaluationQuestions,
  "scenario-analysis": scenarioAnalysisQuestions,
};

export const CATEGORY_BY_ID: Record<CategoryId, Category> = CATEGORIES.reduce(
  (acc, c) => {
    acc[c.id] = c;
    return acc;
  },
  {} as Record<CategoryId, Category>,
);
