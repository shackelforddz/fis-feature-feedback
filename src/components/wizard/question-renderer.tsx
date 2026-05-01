"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { WizardQuestion } from "@/lib/types";

type Value = string | number | undefined;

export function QuestionRenderer({
  question,
  value,
  onChange,
}: {
  question: WizardQuestion;
  value: Value;
  onChange: (next: string | number) => void;
}) {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl leading-snug font-bold text-foreground sm:text-3xl">
        {question.prompt}
      </h2>

      {question.type === "textarea" && (
        <Textarea
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={"Type your answer…"}
          rows={4}
          className="min-h-32 !text-xl leading-relaxed"
        />
      )}

      {question.type === "one-word" && (
        <Input
          value={(value as string) ?? ""}
          onChange={(e) =>
            onChange(e.target.value.replace(/\s+/g, "").slice(0, 40))
          }
          placeholder={question.placeholder ?? "One word"}
          className="!h-16 !text-xl"
        />
      )}

      {question.type === "choice" && (
        <ChoiceList
          options={question.options}
          value={value as string | undefined}
          onChange={onChange}
        />
      )}

      {question.type === "scale" && (
        <ScaleInput
          value={value as number | undefined}
          onChange={onChange}
          min={question.min}
          max={question.max}
          minLabel={question.minLabel}
          maxLabel={question.maxLabel}
        />
      )}
    </div>
  );
}

function ChoiceList({
  options,
  value,
  onChange,
}: {
  options: { value: string; label: string }[];
  value: string | undefined;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-3" role="radiogroup">
      {options.map((opt) => {
        const selected = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(opt.value)}
            className={cn(
              "group flex items-start gap-4 rounded-xl border-2 bg-card/40 p-5 text-left transition-colors min-h-[88px]",
              "active:scale-[0.995] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              selected
                ? "border-primary bg-primary/10"
                : "border-border hover:border-foreground/30",
            )}
          >
            <span
              className={cn(
                "mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2",
                selected ? "border-primary bg-primary" : "border-muted-foreground",
              )}
            >
              {selected && (
                <span className="h-2.5 w-2.5 rounded-full bg-primary-foreground" />
              )}
            </span>
            <span className="text-lg font-medium leading-tight text-foreground">
              {opt.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function ScaleInput({
  value,
  onChange,
  min,
  max,
  minLabel,
  maxLabel,
}: {
  value: number | undefined;
  onChange: (v: number) => void;
  min: number;
  max: number;
  minLabel: string;
  maxLabel: string;
}) {
  const count = max - min + 1;
  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-3">
        {Array.from({ length: count }).map((_, i) => {
          const v = min + i;
          const selected = value === v;
          return (
            <button
              key={v}
              type="button"
              onClick={() => onChange(v)}
              className={cn(
                "flex-1 rounded-2xl border-2 text-2xl font-semibold transition-colors min-h-[88px]",
                "active:scale-[0.995] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                selected
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card/40 hover:border-foreground/30",
              )}
            >
              {v}
            </button>
          );
        })}
      </div>
      <div className="flex justify-between gap-4 text-sm text-muted-foreground">
        <span>
          {min} — {minLabel}
        </span>
        <span className="text-right">
          {max} — {maxLabel}
        </span>
      </div>
    </div>
  );
}
