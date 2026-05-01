"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CATEGORIES,
  CATEGORY_BY_ID,
  QUESTIONS_BY_CATEGORY,
} from "@/lib/form-config";
import type {
  Category,
  CategoryId,
  WizardAnswerKey,
  WizardAnswers,
  WizardQuestion,
} from "@/lib/types";
import { cn } from "@/lib/utils";
import { submitFeedback } from "@/app/actions";

import { QuestionRenderer } from "./question-renderer";

type Screen = "splash" | "category" | "question" | "identity" | "thanks";
type AnswerValue = string | number;
type Answers = Partial<Record<WizardAnswerKey, AnswerValue>>;

const RESET_AFTER_MS = 60_000;

function initialState() {
  return {
    screen: "splash" as Screen,
    categoryId: null as CategoryId | null,
    questionIdx: 0,
    answers: {} as Answers,
    name: "",
    company: "",
    error: null as string | null,
  };
}

export function Wizard() {
  const [s, setS] = useState(initialState);
  const [isPending, startTransition] = useTransition();

  const reset = useCallback(() => setS(initialState()), []);

  useEffect(() => {
    if (s.screen !== "thanks") return;
    const t = setTimeout(reset, RESET_AFTER_MS);
    return () => clearTimeout(t);
  }, [s.screen, reset]);

  const questions: WizardQuestion[] = s.categoryId
    ? QUESTIONS_BY_CATEGORY[s.categoryId]
    : [];
  const totalQuestions = questions.length;
  const currentQuestion = s.screen === "question" ? questions[s.questionIdx] : null;

  // Steps: 1 (category) + N questions + 1 (identity)
  const totalSteps = 1 + totalQuestions + 1;
  const currentStepIndex = (() => {
    switch (s.screen) {
      case "splash":
        return -1;
      case "category":
        return 0;
      case "question":
        return 1 + s.questionIdx;
      case "identity":
        return 1 + totalQuestions;
      case "thanks":
        return totalSteps;
      default:
        return 0;
    }
  })();

  const progressPct =
    s.screen === "splash"
      ? 0
      : Math.min(100, Math.round(((currentStepIndex + 1) / totalSteps) * 100));

  const canAdvance = (() => {
    if (s.screen === "category") return s.categoryId !== null;
    if (s.screen === "question" && currentQuestion) {
      return validateAnswer(currentQuestion, s.answers[currentQuestion.id]);
    }
    if (s.screen === "identity") {
      return s.name.trim().length > 0 && s.company.trim().length > 0;
    }
    return true;
  })();

  const start = () => setS((p) => ({ ...p, screen: "category" }));

  const pickCategory = (id: CategoryId) =>
    setS((p) => ({ ...p, categoryId: id }));

  const setAnswer = (id: WizardAnswerKey, value: AnswerValue) =>
    setS((p) => ({ ...p, answers: { ...p.answers, [id]: value } }));

  const next = () => {
    setS((p) => {
      if (p.screen === "category") {
        if (!p.categoryId) return p;
        return { ...p, screen: "question", questionIdx: 0 };
      }
      if (p.screen === "question") {
        const all = p.categoryId ? QUESTIONS_BY_CATEGORY[p.categoryId] : [];
        if (p.questionIdx < all.length - 1) {
          return { ...p, questionIdx: p.questionIdx + 1 };
        }
        return { ...p, screen: "identity" };
      }
      return p;
    });
  };

  const back = () => {
    setS((p) => {
      if (p.screen === "category") return { ...p, screen: "splash" };
      if (p.screen === "question") {
        if (p.questionIdx > 0) {
          return { ...p, questionIdx: p.questionIdx - 1 };
        }
        return { ...p, screen: "category" };
      }
      if (p.screen === "identity") {
        const all = p.categoryId ? QUESTIONS_BY_CATEGORY[p.categoryId] : [];
        return {
          ...p,
          screen: "question",
          questionIdx: Math.max(0, all.length - 1),
        };
      }
      return p;
    });
  };

  const submit = () => {
    if (!s.categoryId) return;
    setS((p) => ({ ...p, error: null }));
    const a = s.answers;
    const full: WizardAnswers = {
      context: String(a.context ?? "").trim(),
      oneWord: String(a.oneWord ?? "").trim(),
      disappointment:
        (a.disappointment as WizardAnswers["disappointment"]) ??
        "somewhat_disappointed",
      comfort: String(a.comfort ?? "").trim(),
      docsRating: Number(a.docsRating ?? 0),
      wishlist: String(a.wishlist ?? "").trim(),
    };
    startTransition(async () => {
      const res = await submitFeedback({
        category_id: s.categoryId!,
        name: s.name.trim(),
        company: s.company.trim(),
        answers: full,
      });
      if (res.ok) {
        setS((p) => ({ ...p, screen: "thanks" }));
      } else {
        setS((p) => ({ ...p, error: res.error }));
      }
    });
  };

  const activeCategory =
    s.categoryId !== null ? CATEGORY_BY_ID[s.categoryId] : null;

  return (
    <div className="flex min-h-screen w-full flex-col bg-background text-foreground">
      {s.screen !== "splash" && s.screen !== "thanks" && (
        <header className="sticky top-0 z-10 border-b border-border/60 bg-background/80 backdrop-blur">
          <div className="mx-auto flex w-full max-w-3xl items-center gap-4 px-6 py-4">
            <div className="flex-1">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span className="font-medium uppercase tracking-wide">
                  {activeCategory
                    ? `${activeCategory.name} feedback`
                    : "Feature feedback"}
                </span>
                <span className="tabular-nums">
                  Step {Math.max(0, currentStepIndex) + 1} of {totalSteps}
                </span>
              </div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full bg-primary transition-[width] duration-300"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          </div>
        </header>
      )}

      <main
        className={cn(
          "flex flex-1 flex-col items-stretch",
          s.screen === "splash" || s.screen === "thanks"
            ? "justify-center"
            : "justify-start",
        )}
      >
        <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-6 py-8 sm:py-12">
          {s.screen === "splash" && <Splash onStart={start} />}

          {s.screen === "category" && (
            <CategoryPicker
              selected={s.categoryId}
              onSelect={pickCategory}
            />
          )}

          {s.screen === "question" && currentQuestion && (
            <QuestionRenderer
              question={currentQuestion}
              value={s.answers[currentQuestion.id]}
              onChange={(v) => setAnswer(currentQuestion.id, v)}
            />
          )}

          {s.screen === "identity" && (
            <Identity
              name={s.name}
              company={s.company}
              onName={(v) => setS((p) => ({ ...p, name: v }))}
              onCompany={(v) => setS((p) => ({ ...p, company: v }))}
            />
          )}

          {s.screen === "thanks" && <Thanks onDone={reset} />}
        </div>
      </main>

      {s.screen !== "splash" && s.screen !== "thanks" && (
        <footer className="sticky bottom-0 border-t border-border/60 bg-background/90 backdrop-blur">
          <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-4 px-6 py-4">
            <Button
              variant="outline"
              onClick={back}
              className="h-16 min-w-[120px] px-6 text-lg"
              disabled={isPending}
            >
              <ArrowLeft className="size-5" />
              Back
            </Button>
            {s.error && (
              <p className="text-sm text-destructive" aria-live="polite">
                {s.error}
              </p>
            )}
            {s.screen === "identity" ? (
              <Button
                onClick={submit}
                className="h-16 min-w-[160px] px-6 text-lg"
                disabled={isPending || !canAdvance}
              >
                {isPending ? (
                  <>
                    <Loader2 className="size-5 animate-spin" />
                    Submitting
                  </>
                ) : (
                  <>
                    Submit
                    <Check className="size-5" />
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={next}
                className="h-16 min-w-[140px] px-6 text-lg"
                disabled={isPending || !canAdvance}
              >
                Next
                <ArrowRight className="size-5" />
              </Button>
            )}
          </div>
        </footer>
      )}
    </div>
  );
}

function validateAnswer(question: WizardQuestion, value: AnswerValue | undefined): boolean {
  if (value === undefined || value === null) return false;
  if (question.type === "scale") {
    return (
      typeof value === "number" && value >= question.min && value <= question.max
    );
  }
  if (question.type === "choice") {
    return (
      typeof value === "string" &&
      question.options.some((o) => o.value === value)
    );
  }
  if (question.type === "one-word") {
    const str = String(value).trim();
    return str.length > 0 && !/\s/.test(str);
  }
  return typeof value === "string" && value.trim().length > 0;
}

function Splash({ onStart }: { onStart: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8 text-center">
      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
          FIS Roadmap
        </p>
        <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
          Share your feedback
        </h1>
        <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
          A few quick questions about the feature you just explored. Takes about
          two minutes.
        </p>
      </div>
      <Button onClick={onStart} className="h-20 min-w-[240px] px-10 text-xl">
        Tap to begin
        <ArrowRight className="size-6" />
      </Button>
    </div>
  );
}

function CategoryPicker({
  selected,
  onSelect,
}: {
  selected: CategoryId | null;
  onSelect: (id: CategoryId) => void;
}) {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Step 1
        </p>
        <h2 className="text-3xl font-bold leading-tight text-foreground sm:text-4xl">
          Which feature would you like to leave feedback for?
        </h2>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {CATEGORIES.map((c) => (
          <CategoryCard
            key={c.id}
            category={c}
            selected={selected === c.id}
            onSelect={() => onSelect(c.id)}
          />
        ))}
      </div>
    </div>
  );
}

function CategoryCard({
  category,
  selected,
  onSelect,
}: {
  category: Category;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        "group flex min-h-[140px] flex-col items-start gap-2 rounded-2xl border-2 bg-card/40 p-6 text-left transition-colors",
        "active:scale-[0.995] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        selected
          ? "border-primary bg-primary/10"
          : "border-border hover:border-foreground/30",
      )}
    >
      <span className="text-xl font-semibold leading-tight text-foreground sm:text-2xl">
        {category.name}
      </span>
      <span className="text-base leading-relaxed text-muted-foreground">
        {category.description}
      </span>
    </button>
  );
}

function Identity({
  name,
  company,
  onName,
  onCompany,
}: {
  name: string;
  company: string;
  onName: (v: string) => void;
  onCompany: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Last step
        </p>
        <h2 className="text-3xl font-bold leading-tight text-foreground sm:text-4xl">
          Tell us who you are
        </h2>
      </div>
      <IdentityField
        label="Your name"
        value={name}
        onChange={onName}
        placeholder="Jane Doe"
      />
      <IdentityField
        label="Company"
        value={company}
        onChange={onCompany}
        placeholder="Acme Bank"
      />
      <p className="-mt-4 text-sm text-muted-foreground">
        Both fields are required.
      </p>
    </div>
  );
}

function IdentityField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="flex flex-col gap-3">
      <span className="text-2xl leading-snug font-medium text-foreground sm:text-3xl">
        {label}
      </span>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="!h-16 !text-xl"
      />
    </label>
  );
}

function Thanks({ onDone }: { onDone: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/15">
        <Check className="size-10 text-primary" />
      </div>
      <div className="flex flex-col gap-3">
        <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
          Thank you!
        </h1>
        <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
          Your feedback shapes what we build next.
        </p>
      </div>
      <Button
        onClick={onDone}
        variant="outline"
        className="h-16 min-w-[200px] px-8 text-lg"
      >
        Start new response
      </Button>
      <p className="text-sm text-muted-foreground">
        This screen will reset automatically.
      </p>
    </div>
  );
}
