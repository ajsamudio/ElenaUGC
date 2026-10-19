"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { budgetOptions, inquirySchema, serviceOptions, type InquiryInput } from "@/lib/inquiry-schema";
import { siteConfig } from "@/lib/site.config";
import { ArrowIcon, Cherry, MailIcon, Sparkle } from "@/components/Icons";
import Dropdown from "@/components/Dropdown";

export default function Contact() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<InquiryInput>({
    resolver: zodResolver(inquirySchema),
    defaultValues: { services: [], budget: "" },
  });

  const { contact } = siteConfig;

  async function onSubmit(values: InquiryInput) {
    setStatus("sending");
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("sent");
      reset();
    } catch {
      setStatus("error");
    }
  }

  const field =
    "w-full rounded-2xl border border-cocoa-900/15 bg-white px-4 py-3.5 text-[15px] text-cocoa-900 outline-none transition placeholder:text-cocoa-500/70 focus:border-cherry focus:ring-4 focus:ring-cherry/10";
  const errText = "mt-1.5 text-xs font-medium text-cherry";

  return (
    <section id="contact" className="scroll-mt-20 px-3 pb-6 sm:px-5">
      <div className="relative mx-auto max-w-[88rem] overflow-hidden rounded-[2.5rem] bg-blush-200 py-20 sm:rounded-[3.5rem] sm:py-28">
        <div aria-hidden className="pointer-events-none absolute -left-24 top-10 h-96 w-96 rounded-full bg-baby-200 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-24 right-0 h-96 w-96 rounded-full bg-butter-light blur-3xl" />

        <div className="container-x relative grid grid-cols-1 gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <p className="eyebrow">★ Let&rsquo;s collab</p>
            <h2 className="mt-5 font-display text-[3rem] leading-[0.92] tracking-tight text-cocoa-900 sm:text-7xl">
              Let&rsquo;s make something that <em className="italic text-cherry">sells.</em>
            </h2>
            <p className="mt-6 max-w-md text-lg text-cocoa-700">
              Tell me about your brand and what you need. I&rsquo;ll come back with ideas, deliverables and a quote.
            </p>

            <div className="mt-10 space-y-3">
              <a
                href={`mailto:${contact.email}`}
                className="group flex items-center gap-4 rounded-3xl border border-cocoa-900/10 bg-cream/80 p-4 transition hover:bg-cream"
              >
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-cherry text-cream">
                  <MailIcon className="h-5 w-5" />
                </span>
                <span className="min-w-0">
                  <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-cocoa-500">
                    Brand partnerships
                  </span>
                  <span className="block truncate font-semibold text-cocoa-900 group-hover:text-cherry">{contact.email}</span>
                </span>
              </a>
            </div>
            <Cherry className="float-a mt-10 hidden h-20 w-20 lg:block" style={{ ["--r" as string]: "-8deg" }} />
          </div>

          {status === "sent" ? (
            <div className="modal-in flex items-center rounded-[2rem] border border-cocoa-900/10 bg-cream p-8 shadow-soft sm:p-10">
              <div>
                <Sparkle className="h-8 w-8" />
                <h3 className="mt-4 font-display text-5xl italic text-cocoa-900">Sent! ★</h3>
                <p className="mt-3 text-cocoa-700">
                  Your inquiry is in my inbox. I&rsquo;ll get back to you soon with ideas and a quote.
                </p>
                <button type="button" onClick={() => setStatus("idle")} className="btn-ghost mt-6">
                  Send another
                </button>
              </div>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              className="space-y-5 rounded-[2rem] border border-cocoa-900/10 bg-cream p-6 shadow-soft sm:p-9"
            >
              <div className="hidden" aria-hidden="true">
                <label>
                  Company website
                  <input type="text" tabIndex={-1} autoComplete="off" {...register("company_website")} />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <input placeholder="Your name" autoComplete="name" className={field} {...register("name")} />
                  {errors.name && <p className={errText}>{errors.name.message}</p>}
                </div>
                <div>
                  <input type="email" placeholder="Work email" autoComplete="email" className={field} {...register("email")} />
                  {errors.email && <p className={errText}>{errors.email.message}</p>}
                </div>
                <div>
                  <input placeholder="Brand name" autoComplete="organization" className={field} {...register("brand")} />
                  {errors.brand && <p className={errText}>{errors.brand.message}</p>}
                </div>
                <div>
                  <input placeholder="Website or @handle (optional)" className={field} {...register("website")} />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Controller
                    name="services"
                    control={control}
                    render={({ field: f }) => (
                      <Dropdown
                        label="What are you looking for?"
                        placeholder="Pick all that apply"
                        options={serviceOptions}
                        value={f.value ?? []}
                        onChange={f.onChange}
                        invalid={!!errors.services}
                      />
                    )}
                  />
                  {errors.services && <p className={errText}>{errors.services.message}</p>}
                </div>
                <div>
                  <Controller
                    name="budget"
                    control={control}
                    render={({ field: f }) => (
                      <Dropdown
                        label="Budget"
                        placeholder="Choose a range"
                        options={budgetOptions}
                        value={f.value ?? ""}
                        onChange={f.onChange}
                        invalid={!!errors.budget}
                      />
                    )}
                  />
                  {errors.budget && <p className={errText}>{errors.budget.message}</p>}
                </div>
              </div>

              <div>
                <input placeholder="Timeline / launch date (optional)" className={field} {...register("timeline")} />
              </div>
              <div>
                <textarea
                  rows={4}
                  placeholder="Tell me about the product and what you'd love to see"
                  className={field}
                  {...register("message")}
                />
                {errors.message && <p className={errText}>{errors.message.message}</p>}
              </div>

              {status === "error" && (
                <p className="rounded-2xl bg-cherry/10 px-4 py-3 text-sm text-cherry">
                  Something went wrong sending that. Please try again, or email{" "}
                  <a className="font-semibold underline" href={`mailto:${contact.email}`}>
                    {contact.email}
                  </a>
                  .
                </p>
              )}

              <button type="submit" disabled={status === "sending"} className="btn-cherry w-full py-4 text-base disabled:opacity-60">
                {status === "sending" ? "Sending…" : "Send inquiry"} <ArrowIcon />
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
