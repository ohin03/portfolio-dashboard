"use client";

import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  trend?: "up" | "down" | "neutral";
  description?: string;
  icon: LucideIcon;
}

export default function StatCard({
  title,
  value,
  change,
  trend = "neutral",
  description,
  icon: Icon,
}: StatCardProps) {
  const trendStyles = {
    up: "text-emerald-400 bg-emerald-400/10",
    down: "text-rose-400 bg-rose-400/10",
    neutral: "text-slate-400 bg-slate-400/10",
  };

  return (
    <article className="rounded-2xl border border-white/[0.08] bg-[#111827] p-5 transition-colors duration-200 hover:border-blue-400/30">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-400">{title}</p>

          <h3 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            {value}
          </h3>
        </div>

        <div className="rounded-xl border border-white/[0.08] bg-white/[0.04] p-3">
          <Icon
            className="h-5 w-5 text-blue-400"
            aria-hidden="true"
          />
        </div>
      </div>

      {(change || description) && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {change && (
            <span
              className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium ${trendStyles[trend]}`}
            >
              {trend === "up" && (
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              )}

              {trend === "down" && (
                <ArrowDownRight className="h-3.5 w-3.5" aria-hidden="true" />
              )}

              {change}
            </span>
          )}

          {description && (
            <span className="text-xs text-slate-500">{description}</span>
          )}
        </div>
      )}
    </article>
  );
}