"use client";

export function TodayDate() {
  const formatted = new Intl.DateTimeFormat("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date());

  return <p className="mt-2 text-sm text-muted-foreground">{formatted}</p>;
}
