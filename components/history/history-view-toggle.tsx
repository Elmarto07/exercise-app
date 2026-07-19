"use client";

import type { HistoryView } from "@/lib/domain/types";
import { copy } from "@/lib/copy/es";
import { cn } from "@/lib/utils";

type HistoryViewToggleProps = {
  value: HistoryView;
  onChange: (view: HistoryView) => void;
};

export function HistoryViewToggle({ value, onChange }: HistoryViewToggleProps) {
  const { history } = copy;

  const segments: { id: HistoryView; label: string }[] = [
    { id: "calendar", label: history.viewCalendar },
    { id: "list", label: history.viewList },
  ];

  return (
    <div
      role="tablist"
      aria-label={history.viewToggleLabel}
      className="mb-5 flex rounded-xl bg-[#E5E5E5] p-1"
    >
      {segments.map((segment) => {
        const isActive = value === segment.id;

        return (
          <button
            key={segment.id}
            type="button"
            role="tab"
            id={`history-tab-${segment.id}`}
            aria-selected={isActive}
            aria-controls={`history-panel-${segment.id}`}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onChange(segment.id)}
            className={cn(
              "min-h-11 flex-1 rounded-lg px-3 text-sm font-medium transition-colors",
              isActive
                ? "bg-white text-foreground shadow-sm"
                : "text-muted-foreground",
            )}
          >
            {segment.label}
          </button>
        );
      })}
    </div>
  );
}
