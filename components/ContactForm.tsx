"use client";

import Link from "next/link";
import { useState } from "react";

export type Field = { name: string; type: string; placeholder: string | null; required: boolean; options?: string[] };

export default function ContactForm({ fields, submitLabel = "Submit", successMessage, source, light }: { fields: Field[]; submitLabel?: string; successMessage?: string; source: string; light?: boolean }) {
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState<string>("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setState("sending");
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...data, source }) });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Something went wrong");
      setState("done");
      form.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div className="py-10">
        <p className="display text-2xl font-bold">{successMessage || "Thank you! Your submission has been received."}</p>
        <Link href="/" className="btn mt-6">Go to the home page</Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className={light ? "text-ink" : "text-white"} noValidate={false}>
      {/* honeypot */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      {fields.map((f) => {
        const common = { name: f.name, id: `${source}-${f.name}`, required: f.required, className: "field", "aria-label": f.placeholder ?? f.name };
        if (f.type === "select") {
          return (
            <select key={f.name} {...common} defaultValue="">
              <option value="" disabled>{f.placeholder ?? f.options?.[0] ?? f.name.replace(/-/g, " ")}</option>
              {(f.options ?? []).filter((o) => !/^how did you hear/i.test(o)).map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          );
        }
        if (f.type === "textarea") return <textarea key={f.name} {...common} placeholder={f.placeholder ?? ""} rows={4} />;
        return <input key={f.name} {...common} type={f.type} placeholder={f.placeholder ?? ""} />;
      })}
      {state === "error" && <p className="mb-4 text-sm text-[#ff6868]">{error}. You can also email us at info@thespark.ai.</p>}
      <button type="submit" className="btn disabled:opacity-60" disabled={state === "sending"}>
        {state === "sending" ? "Sending…" : submitLabel}
      </button>
    </form>
  );
}
