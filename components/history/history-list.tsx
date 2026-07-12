import type { HistoryListRow } from "@/lib/domain/history-window";
import { getCategoryDisplayLabel } from "@/lib/domain/history-window";
import { formatHistoryListDate } from "@/lib/domain/dates";
import { copy } from "@/lib/copy/es";
import { cn } from "@/lib/utils";

type HistoryListProps = {
  rows: HistoryListRow[];
};

export function HistoryList({ rows }: HistoryListProps) {
  const { history } = copy;

  return (
    <section aria-label={history.listLabel}>
      <ul className="flex flex-col gap-2">
        {rows.map((row) => {
          const isRegistered = row.workoutDay !== undefined;

          return (
            <li
              key={row.date}
              className={cn(
                "flex items-center justify-between gap-3 rounded-xl border border-border bg-white px-4 py-3",
                row.isToday && "ring-2 ring-primary ring-offset-1",
              )}
            >
              <span
                className={cn(
                  "text-sm",
                  row.isToday ? "font-semibold" : "font-medium",
                )}
              >
                {formatHistoryListDate(row.date)}
              </span>
              <span
                className={cn(
                  "text-sm",
                  isRegistered
                    ? "font-medium text-foreground"
                    : "text-muted-foreground",
                )}
              >
                {isRegistered && row.workoutDay
                  ? getCategoryDisplayLabel(row.workoutDay.category)
                  : history.noWorkout}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
