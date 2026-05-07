"use client";

import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  textClassName?: string;
  markClassName?: string;
  showText?: boolean;
};

export function Logo({
  className,
  textClassName,
  markClassName,
  showText = true,
}: LogoProps) {
  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      <motion.div
        aria-hidden
        className={cn(
          "size-3 rounded-full bg-linear-to-r from-primary via-indigo-400 to-violet-400 bg-size-[220%_220%] shadow-[0_0_0_1px_color-mix(in_oklab,var(--color-primary)_40%,transparent)] dark:via-indigo-300 dark:to-violet-300",
          markClassName
        )}
        animate={{
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        }}
        transition={{
          duration: 8,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      />
      {showText ? (
        <span
          className={cn(
            "text-xs font-semibold tracking-[0.18em] text-foreground uppercase",
            textClassName
          )}
        >
          HireMind AI
        </span>
      ) : null}
    </div>
  );
}
