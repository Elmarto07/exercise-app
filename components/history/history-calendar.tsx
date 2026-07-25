import type { HistoryDayCell } from "@/lib/domain/history-window";
import {
  dayHasStretchSession,
  getWorkoutDayShortLabel,
} from "@/lib/domain/history-window";
import type { WorkoutDay } from "@/lib/domain/types";
import { copy } from "@/lib/copy/es";
import { cn } from "@/lib/utils";

type HistoryCalendarProps = {
  cells: HistoryDayCell[];
  workoutByDate: Map<string, WorkoutDay>;
  stretchDates: Set<string>;
};

export function HistoryCalendar({
  cells,
  workoutByDate,
  stretchDates,
}: HistoryCalendarProps) {
  const { history } = copy;

  return (
    <section aria-label={history.calendarLabel}>
      <div className="mb-2 grid grid-cols-7 gap-1">
        {history.weekdays.map((label) => (
          <span
            key={label}
            className="text-center text-[11px] font-medium text-muted-foreground"
          >
            {label}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((cell) => {
          const workoutDay = workoutByDate.get(cell.date);
          const isRegistered = cell.inWindow && workoutDay !== undefined;
          const hasStretch =
            cell.inWindow && dayHasStretchSession(cell.date, stretchDates);

          return (
            <div
              key={cell.date}
              className={cn(
                "flex aspect-square flex-col items-center justify-center gap-0.5 rounded-lg border text-[13px]",
                !cell.inWindow && "opacity-30",
                isRegistered
                  ? "border-2 border-primary bg-[#DCFCE7] font-semibold text-[#16A34A]"
                  : "border-border bg-muted text-muted-foreground",
                cell.isToday && cell.inWindow && "ring-2 ring-primary ring-offset-1",
              )}
            >
              <span>{cell.dayOfMonth}</span>
              {isRegistered ? (
                <span className="text-[8px] font-medium leading-none opacity-80">
                  {getWorkoutDayShortLabel(workoutDay)}
                </span>
              ) : null}
              {hasStretch ? (
                <span
                  role="img"
                  aria-label={history.stretchCompletedAria}
                  className="size-1.5 shrink-0 rounded-full bg-[#737373]"
                />
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
