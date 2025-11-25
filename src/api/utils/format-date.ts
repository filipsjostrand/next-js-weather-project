const sweWeekdays = [
  "Söndag",
  "Måndag",
  "Tisdag",
  "Onsdag",
  "Torsdag",
  "Fredag",
  "Lördag",
];


export function formatDateWithWeekday(dateString: string): string {
  const date = new Date(dateString);
  const weekday = sweWeekdays[date.getDay()];

  // Format: YYYY-MM-DD
  const formattedDate = date.toISOString().split("T")[0];

  return `${formattedDate} ${weekday}`;
}