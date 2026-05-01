"use server";

import { createSupabaseAdminClient } from "@/lib/supabase/server";
import {
  wizardSubmissionSchema,
  type WizardSubmissionInput,
} from "@/lib/submission-schema";
import { QUESTIONS_BY_CATEGORY } from "@/lib/form-config";
import type { WizardAnswerKey } from "@/lib/types";

export type SubmitResult = { ok: true } | { ok: false; error: string };

export async function submitFeedback(
  input: WizardSubmissionInput,
): Promise<SubmitResult> {
  const parsed = wizardSubmissionSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error:
        "Invalid submission: " +
        parsed.error.issues.map((i) => i.message).join("; "),
    };
  }

  const data = parsed.data;
  const supabase = createSupabaseAdminClient();

  const { data: surveyRow, error: surveyError } = await supabase
    .from("survey_responses")
    .insert({
      category_id: data.category_id,
      name: data.name,
      company: data.company,
      answers: data.answers,
    })
    .select("id")
    .single();

  if (surveyError) {
    return { ok: false, error: surveyError.message };
  }

  const submissionId = surveyRow?.id as string | undefined;

  // For each question marked goesToBoard: true, persist a feedback row keyed
  // by the answer text so it can show up on the feedback wall.
  const boardQuestions = QUESTIONS_BY_CATEGORY[data.category_id].filter(
    (q) => q.goesToBoard,
  );

  const feedbackRows = boardQuestions
    .map((q) => {
      const answer = data.answers[q.id as WizardAnswerKey] as
        | string
        | number
        | undefined;
      if (typeof answer !== "string") return null;
      const trimmed = answer.trim();
      if (!trimmed) return null;
      return {
        category_id: data.category_id,
        quote: trimmed.slice(0, 500),
        name: data.name,
        company: data.company,
        question_key: q.id,
        submission_id: submissionId ?? null,
      };
    })
    .filter((row): row is NonNullable<typeof row> => row !== null);

  if (feedbackRows.length > 0) {
    const { error: feedbackError } = await supabase
      .from("feedback")
      .insert(feedbackRows);
    if (feedbackError) {
      return { ok: false, error: feedbackError.message };
    }
  }

  return { ok: true };
}
