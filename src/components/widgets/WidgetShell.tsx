import type { ReactNode } from "react";

interface WidgetShellProps {
  title: string;
  description?: string;
  children: ReactNode;
  action?: ReactNode;
  className?: string;
}

export default function WidgetShell({
  title,
  description,
  children,
  action,
  className = "",
}: WidgetShellProps) {
  return (
    <section
      className={`h-full min-w-0 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#101522] p-5 sm:p-6 ${className}`}
    >
      <header className="mb-5 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-semibold text-white">{title}</h3>

          {description && (
            <p className="mt-1 text-sm text-slate-500">
              {description}
            </p>
          )}
        </div>

        {action && <div className="shrink-0">{action}</div>}
      </header>

      <div className="min-w-0">{children}</div>
    </section>
  );
}

