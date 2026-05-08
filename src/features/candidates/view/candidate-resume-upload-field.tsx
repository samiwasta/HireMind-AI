"use client";

import { FileText, FileUp, Loader2, X } from "lucide-react";
import type { ClientUploadedFileData } from "uploadthing/types";

import { ResumeUploadButton } from "@/lib/uploadthing-components";
import { cn } from "@/lib/utils";

export type ResumeUploadValue = {
  url: string;
  name: string;
};

type CandidateResumeUploadFieldProps = {
  id?: string;
  value: ResumeUploadValue | null;
  onChange: (next: ResumeUploadValue | null) => void;
  errorText?: string;
};

function pickUploadedFileUrl(file: ClientUploadedFileData<unknown> | undefined) {
  if (!file) return "";
  const f = file as { ufsUrl?: string; url?: string; appUrl?: string };
  return (f.ufsUrl || f.url || f.appUrl || "").trim();
}

function metaFromClientFile(file: ClientUploadedFileData<unknown> | undefined): ResumeUploadValue | null {
  if (!file) return null;
  const url = pickUploadedFileUrl(file);
  if (!url) return null;
  const name = typeof file.name === "string" && file.name.length > 0 ? file.name : "Resume.pdf";
  return { url, name };
}

const overlayAction =
  "inline-flex min-h-10 shrink-0 items-center justify-center rounded-lg bg-background px-4 py-2.5 text-center text-sm font-semibold leading-none text-foreground shadow-md ring-1 ring-black/10 transition-colors hover:bg-muted dark:ring-white/15";

export function CandidateResumeUploadField({ id, value, onChange, errorText }: CandidateResumeUploadFieldProps) {
  return (
    <div id={id} className="space-y-3">
      <div
        className={cn(
          "relative overflow-hidden rounded-2xl border transition-[box-shadow,border-color]",
          value
            ? "border-border/90 bg-card"
            : "border-dashed border-border/90 bg-linear-to-b from-secondary/40 to-card/80 shadow-[inset_0_1px_0_0_color-mix(in_oklab,var(--color-border)_50%,transparent)]",
          errorText && !value && "border-destructive/40 ring-1 ring-destructive/15"
        )}
      >
        {!value ? (
          <div className="flex flex-col items-center gap-4 px-5 py-8 text-center sm:px-8 sm:py-10">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/12 ring-1 ring-primary/20">
              <FileUp className="size-7 text-primary" strokeWidth={1.75} />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-foreground">Upload your resume</p>
              <p className="max-w-xs text-xs leading-relaxed text-muted-foreground">
                PDF only, up to 16&nbsp;MB. Your file is stored securely and linked to your profile.
              </p>
            </div>
            <ResumeUploadButton
              endpoint="resume"
              onClientUploadComplete={(res) => {
                const next = metaFromClientFile(res[0]);
                if (next) onChange(next);
              }}
              onUploadError={() => onChange(null)}
              content={{
                button: ({ ready, isUploading }) =>
                  isUploading ? (
                    <span className="inline-flex items-center gap-2">
                      <Loader2 className="size-4 animate-spin" />
                      Uploading…
                    </span>
                  ) : ready ? (
                    "Choose PDF"
                  ) : (
                    <span className="inline-flex items-center gap-2">
                      <Loader2 className="size-4 animate-spin" />
                      Preparing…
                    </span>
                  ),
                allowedContent: "application/pdf · max 16 MB",
              }}
              appearance={{
                button: ({ ready, isUploading }) =>
                  cn(
                    "h-10 w-full rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:opacity-95 sm:w-auto",
                    (isUploading || !ready) && "cursor-wait opacity-80"
                  ),
                allowedContent: "text-[11px] text-muted-foreground",
              }}
            />
          </div>
        ) : (
          <div className="p-4 pb-5 sm:p-5">
            <div className="mx-auto max-w-[min(100%,320px)]">
              <div
                className="group relative isolate mx-auto rounded-2xl border border-border/80 bg-muted/25 shadow-sm ring-1 ring-black/5 outline-none transition-shadow dark:ring-white/10 group-focus-visible:ring-2 group-focus-visible:ring-ring"
                tabIndex={0}
                role="region"
                aria-label="Resume preview; hover or focus for remove, replace, or open PDF"
              >
                <div className="relative aspect-3/4 w-full overflow-hidden rounded-[inherit]">
                  <object
                    data={`${value.url}#toolbar=0&navpanes=0&view=FitH`}
                    type="application/pdf"
                    title="Resume PDF preview"
                    className="pointer-events-none absolute inset-0 h-full w-full bg-background"
                  >
                    <div className="flex h-full min-h-[240px] flex-col items-center justify-center gap-3 bg-muted/40 p-6 text-center">
                      <FileText className="size-12 text-primary/75" strokeWidth={1.35} />
                      <p className="text-xs leading-snug text-muted-foreground">
                        Preview unavailable inline. Hover for actions or{" "}
                        <a
                          href={value.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-primary underline underline-offset-2"
                        >
                          open PDF
                        </a>
                        .
                      </p>
                    </div>
                  </object>
                </div>

                <div className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-200 group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100">
                  <div className="absolute inset-0 rounded-[inherit] bg-black/55" aria-hidden />

                  <button
                    type="button"
                    onClick={() => onChange(null)}
                    aria-label="Remove resume"
                    className="pointer-events-auto absolute top-3 right-3 z-10 flex size-10 items-center justify-center rounded-full bg-background text-foreground shadow-md ring-1 ring-black/15 transition-colors hover:bg-destructive/15 hover:text-destructive hover:ring-destructive/25 dark:ring-white/20"
                  >
                    <X className="size-5" strokeWidth={2} />
                  </button>

                  <div className="relative z-10 flex h-full flex-col pt-14">
                    <div className="flex flex-1 flex-wrap items-center justify-center gap-3 px-4 pb-12">
                      <a
                        href={value.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(overlayAction, "pointer-events-auto")}
                      >
                        Open PDF
                      </a>
                      <div className="pointer-events-auto **:data-[ut-element=allowed-content]:hidden">
                        <ResumeUploadButton
                          endpoint="resume"
                          onClientUploadComplete={(res) => {
                            const next = metaFromClientFile(res[0]);
                            if (next) onChange(next);
                          }}
                          onUploadError={() => {}}
                          content={{
                            button: ({ isUploading }) =>
                              isUploading ? (
                                <span className="inline-flex items-center gap-2">
                                  <Loader2 className="size-4 shrink-0 animate-spin" />
                                  Replacing…
                                </span>
                              ) : (
                                "Replace"
                              ),
                          }}
                          appearance={{
                            container:
                              "!inline-flex !h-auto !w-auto !min-w-0 flex-row flex-nowrap items-center gap-0 p-0",
                            button: ({ isUploading }) =>
                              cn(
                                overlayAction,
                                "min-w-[6.5rem] px-6 after:!hidden",
                                "data-[state=ready]:!bg-background data-[state=ready]:!text-foreground",
                                "data-[state=readying]:!bg-muted data-[state=uploading]:!bg-muted",
                                "data-[state=ready]:justify-center",
                                "focus-within:ring-2 focus-within:ring-background",
                                isUploading && "cursor-wait opacity-90"
                              ),
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <p
                className="mt-3 truncate px-1 text-center text-xs text-muted-foreground"
                title={value.name}
              >
                {value.name}
              </p>
            </div>
          </div>
        )}
      </div>

      {value ? (
        <p className="text-xs text-muted-foreground">You can submit the form when the rest of the fields are complete.</p>
      ) : null}
      {errorText ? <p className="text-xs text-destructive">{errorText}</p> : null}
    </div>
  );
}
