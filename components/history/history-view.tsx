"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { HistoryCalendar } from "@/components/history/history-calendar";
import { HistoryList } from "@/components/history/history-list";
import { HistorySummary } from "@/components/history/history-summary";
import { HistoryViewToggle } from "@/components/history/history-view-toggle";
import { copy } from "@/lib/copy/es";
import { useHistory } from "@/lib/hooks/use-history";

export function HistoryView() {
  const {
    summaryCount,
    calendarCells,
    listRows,
    workoutByDate,
    stretchDates,
    historyView,
    setHistoryView,
  } = useHistory();
  const { history: historyCopy } = copy;

  return (
    <>
      <nav className="flex items-center gap-3 py-2">
        <Link
          href="/"
          aria-label={historyCopy.backToHome}
          className="flex size-11 items-center justify-center text-foreground"
        >
          <ArrowLeft className="size-6" aria-hidden />
        </Link>
        <h1 className="text-xl font-semibold">{historyCopy.title}</h1>
      </nav>

      <HistorySummary count={summaryCount} />
      <HistoryViewToggle value={historyView} onChange={setHistoryView} />
      <div
        role="tabpanel"
        id="history-panel-calendar"
        aria-labelledby="history-tab-calendar"
        hidden={historyView !== "calendar"}
      >
        <HistoryCalendar
          cells={calendarCells}
          workoutByDate={workoutByDate}
          stretchDates={stretchDates}
        />
      </div>
      <div
        role="tabpanel"
        id="history-panel-list"
        aria-labelledby="history-tab-list"
        hidden={historyView !== "list"}
      >
        <HistoryList rows={listRows} />
      </div>
    </>
  );
}
