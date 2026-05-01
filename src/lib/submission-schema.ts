import { z } from "zod";

export const categoryIdSchema = z.enum([
  "portfolio-insights",
  "risk-mitigation",
  "loan-evaluation",
  "scenario-analysis",
]);

export const wizardSubmissionSchema = z.object({
  category_id: categoryIdSchema,
  name: z.string().trim().min(1, "Name is required").max(80),
  company: z.string().trim().min(1, "Company is required").max(80),
  answers: z.object({
    context: z.string().trim().min(1, "Required").max(500),
    oneWord: z
      .string()
      .trim()
      .min(1, "Required")
      .max(40)
      .refine((v) => !/\s/.test(v), { message: "Please use one word" }),
    disappointment: z.enum([
      "very_disappointed",
      "somewhat_disappointed",
      "not_disappointed",
    ]),
    comfort: z.string().trim().min(1, "Required").max(500),
    docsRating: z.number().int().min(1).max(5),
    wishlist: z.string().trim().min(1, "Required").max(500),
  }),
});

export type WizardSubmissionInput = z.infer<typeof wizardSubmissionSchema>;
