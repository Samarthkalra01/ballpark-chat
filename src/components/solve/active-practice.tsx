"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Placeholder } from "@tiptap/extension-placeholder";
import { TableKit } from "@tiptap/extension-table";
import {
  Bold,
  Italic,
  Heading2,
  List,
  ListOrdered,
  Table as TableIcon,
  Undo2,
  Redo2,
  Plus,
  Minus,
  Trash2,
  Pause,
  Play,
  Clock,
} from "lucide-react";
import { CategoryBadge, DifficultyPill } from "@/components/ui/badges";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/components/ui/toast";
import { skipAttempt } from "@/app/(app)/actions";
import {
  CATEGORY_LABEL,
  MIN_ANSWER_WORDS,
  type CategoryKey,
  type DifficultyKey,
} from "@/lib/constants";
import { countWords, formatDuration } from "@/lib/utils";
import { cn } from "@/lib/utils";

const PLACEHOLDER =
  "Start with how you'll break this problem down. State your assumptions, then calculate step by step…";

const EVAL_TIPS = [
  "Checking if your structure is MECE…",
  "Sanity-checking your maths…",
  "Weighing your assumptions…",
  "Comparing against a model approach…",
];

function ToolbarButton({
  onClick,
  active,
  disabled,
  label,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      aria-pressed={active}
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-slate-100 disabled:opacity-40",
        active && "bg-indigo-50 text-indigo-700",
      )}
    >
      {children}
    </button>
  );
}

export function ActivePractice({
  attemptId,
  question,
  clarifications,
  category,
  difficulty,
}: {
  attemptId: string;
  question: string;
  clarifications: string[];
  category: CategoryKey;
  difficulty: DifficultyKey;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const draftKey = `ballpark:draft:${attemptId}`;

  const [seconds, setSeconds] = useState(0);
  const [paused, setPaused] = useState(false);
  const [words, setWords] = useState(0);
  const [saved, setSaved] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [tipIndex, setTipIndex] = useState(0);
  const [isPending, startTransition] = useTransition();

  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: PLACEHOLDER }),
      TableKit.configure({ table: { resizable: false } }),
    ],
    editorProps: {
      attributes: { class: "tiptap", "aria-label": "Your answer" },
    },
    onCreate: ({ editor }) => {
      try {
        const draft = localStorage.getItem(draftKey);
        if (draft) editor.commands.setContent(draft);
      } catch {
        /* storage unavailable — ignore */
      }
      setWords(countWords(editor.getText()));
    },
    onUpdate: ({ editor }) => {
      setWords(countWords(editor.getText()));
      setSaved(false);
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => {
        try {
          localStorage.setItem(draftKey, editor.getHTML());
          setSaved(true);
        } catch {
          /* storage unavailable — ignore */
        }
      }, 800);
    },
  });

  // Timer.
  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [paused]);

  // Autosave every 5s as a backstop.
  useEffect(() => {
    const id = setInterval(() => {
      if (editor) {
        try {
          localStorage.setItem(draftKey, editor.getHTML());
          setSaved(true);
        } catch {
          /* ignore */
        }
      }
    }, 5000);
    return () => clearInterval(id);
  }, [editor, draftKey]);

  // Rotating tips while evaluating.
  useEffect(() => {
    if (!submitting) return;
    const id = setInterval(() => setTipIndex((i) => (i + 1) % EVAL_TIPS.length), 2200);
    return () => clearInterval(id);
  }, [submitting]);

  const submit = useCallback(async () => {
    if (!editor) return;
    setShowConfirm(false);
    setSubmitting(true);
    try {
      const res = await fetch(`/api/attempts/${attemptId}/evaluate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answerHtml: editor.getHTML(),
          answerText: editor.getText(),
          timeSpentSeconds: seconds,
        }),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        try {
          localStorage.removeItem(draftKey);
        } catch {
          /* ignore */
        }
        router.push(`/solve/${attemptId}/result`);
        return;
      }
      if (res.status === 429 || res.status === 400) {
        toast(data.message || "Please revise your answer and try again.", "error");
      } else {
        toast(
          data.message || "Evaluation failed — your answer is saved. Try again.",
          "error",
        );
      }
      setSubmitting(false);
    } catch {
      toast("Network error — your answer is saved locally. Try again.", "error");
      setSubmitting(false);
    }
  }, [editor, attemptId, seconds, draftKey, router, toast]);

  const inTable = editor?.isActive("table") ?? false;
  const canSubmit = words >= MIN_ANSWER_WORDS && !submitting;

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-16">
      {/* Question header */}
      <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <CategoryBadge label={CATEGORY_LABEL[category]} />
            <DifficultyPill difficulty={difficulty} />
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 font-mono text-sm font-bold text-slate-700">
              <Clock className="h-3.5 w-3.5" />
              {formatDuration(seconds)}
            </span>
            <button
              type="button"
              onClick={() => setPaused((p) => !p)}
              aria-label={paused ? "Resume timer" : "Pause timer"}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
            >
              {paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
            </button>
          </div>
        </div>
        <h2 className="text-xl font-bold leading-snug text-slate-900 md:text-2xl">{question}</h2>
        {clarifications.length > 0 && (
          <details className="rounded-xl bg-slate-50 p-3 text-sm">
            <summary className="cursor-pointer font-semibold text-slate-700">
              Clarifying info
            </summary>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-600">
              {clarifications.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </details>
        )}
      </div>

      {/* Editor */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-1 overflow-x-auto border-b border-slate-200 p-2">
          <ToolbarButton
            label="Bold"
            active={editor?.isActive("bold")}
            onClick={() => editor?.chain().focus().toggleBold().run()}
          >
            <Bold className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            label="Italic"
            active={editor?.isActive("italic")}
            onClick={() => editor?.chain().focus().toggleItalic().run()}
          >
            <Italic className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            label="Heading"
            active={editor?.isActive("heading", { level: 2 })}
            onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
          >
            <Heading2 className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            label="Bullet list"
            active={editor?.isActive("bulletList")}
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
          >
            <List className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            label="Numbered list"
            active={editor?.isActive("orderedList")}
            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          >
            <ListOrdered className="h-4 w-4" />
          </ToolbarButton>

          <span className="mx-1 h-5 w-px bg-slate-200" />

          <ToolbarButton
            label="Add table"
            onClick={() =>
              editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
            }
          >
            <TableIcon className="h-4 w-4" />
          </ToolbarButton>

          {inTable && (
            <>
              <ToolbarButton
                label="Add column"
                onClick={() => editor?.chain().focus().addColumnAfter().run()}
              >
                <span className="relative flex items-center">
                  <Plus className="h-3 w-3" />
                  <span className="text-[9px] font-bold">col</span>
                </span>
              </ToolbarButton>
              <ToolbarButton
                label="Delete column"
                onClick={() => editor?.chain().focus().deleteColumn().run()}
              >
                <span className="relative flex items-center">
                  <Minus className="h-3 w-3" />
                  <span className="text-[9px] font-bold">col</span>
                </span>
              </ToolbarButton>
              <ToolbarButton
                label="Add row"
                onClick={() => editor?.chain().focus().addRowAfter().run()}
              >
                <span className="relative flex items-center">
                  <Plus className="h-3 w-3" />
                  <span className="text-[9px] font-bold">row</span>
                </span>
              </ToolbarButton>
              <ToolbarButton
                label="Delete row"
                onClick={() => editor?.chain().focus().deleteRow().run()}
              >
                <span className="relative flex items-center">
                  <Minus className="h-3 w-3" />
                  <span className="text-[9px] font-bold">row</span>
                </span>
              </ToolbarButton>
              <ToolbarButton
                label="Delete table"
                onClick={() => editor?.chain().focus().deleteTable().run()}
              >
                <Trash2 className="h-4 w-4" />
              </ToolbarButton>
            </>
          )}

          <span className="mx-1 h-5 w-px bg-slate-200" />

          <ToolbarButton
            label="Undo"
            disabled={!editor?.can().undo()}
            onClick={() => editor?.chain().focus().undo().run()}
          >
            <Undo2 className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            label="Redo"
            disabled={!editor?.can().redo()}
            onClick={() => editor?.chain().focus().redo().run()}
          >
            <Redo2 className="h-4 w-4" />
          </ToolbarButton>

          <span className="ml-auto pr-2 text-xs font-medium text-slate-400">
            {saved ? "Saved" : "Saving…"}
          </span>
        </div>

        <div className="px-5 py-4">
          <EditorContent editor={editor} />
        </div>
      </div>

      {/* Footer actions */}
      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex items-center gap-4 text-xs">
          <span className="font-medium text-slate-500">
            {words} word{words === 1 ? "" : "s"}
          </span>
          {words < MIN_ANSWER_WORDS && (
            <span className="text-slate-400">Write at least {MIN_ANSWER_WORDS} words to submit.</span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            disabled={isPending}
            onClick={() => startTransition(() => void skipAttempt(attemptId))}
            className="text-xs font-semibold text-slate-400 hover:text-slate-700"
          >
            Skip question
          </button>
          <button
            type="button"
            disabled={!canSubmit}
            onClick={() => setShowConfirm(true)}
            className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition-all hover:bg-indigo-700 active:scale-[0.98] disabled:opacity-50"
          >
            Submit for Evaluation
          </button>
        </div>
      </div>

      {/* Confirm dialog */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900">Submit your answer?</h3>
            <p className="mt-2 text-sm text-slate-600">You can&apos;t edit it after submitting.</p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="rounded-xl bg-slate-100 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-200"
              >
                Keep editing
              </button>
              <button
                onClick={submit}
                className="rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-indigo-700"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Evaluation overlay */}
      {submitting && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-50/90 backdrop-blur-sm">
          <Spinner className="h-8 w-8 text-indigo-600" />
          <p className="mt-4 text-sm font-semibold text-slate-700">{EVAL_TIPS[tipIndex]}</p>
        </div>
      )}
    </div>
  );
}
