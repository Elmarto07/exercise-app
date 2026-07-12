import { copy } from "@/lib/copy/es";

type HistorySummaryProps = {
  count: number;
};

export function HistorySummary({ count }: HistorySummaryProps) {
  const { history } = copy;

  return (
    <section className="mb-4" aria-live="polite">
      <p className="text-xl font-bold">{history.summaryTemplate(count)}</p>
      <p className="text-sm text-muted-foreground">{history.summaryMeta}</p>
    </section>
  );
}
