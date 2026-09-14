import { nativeFestival } from "../i18n";
import { september2026 } from "../data/festivalCatalogue";
export function indiaToday(date = new Date()) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
      .formatToParts(date)
      .map((p) => [p.type, p.value]),
  );
  return `${parts.year}-${parts.month}-${parts.day}`;
}
export function eventRelevance(event, p) {
  return (
    (event.priorityStates?.includes(p.state) ? 35 : 0) +
    (event.supportedStates.includes(p.state) ? 8 : 0) +
    (event.regionalClusters.includes(p.cluster) ? 25 : 0) +
    (event.priorityLanguages?.includes(p.language) ? 8 : 0) +
    (event.categories.includes(p.businessCategory) ? 3 : 0) +
    (event.featured ? 5 : 0)
  );
}
export function filterCalendar({
  state = "",
  cluster = "",
  language = "en",
  businessCategory = "",
  regionOnly = false,
  featuredOnly = false,
  day = null,
  query = "",
} = {}) {
  return september2026
    .filter(
      (e) =>
        (!regionOnly || !state || e.supportedStates.includes(state)) &&
        (!featuredOnly || e.featured) &&
        (!day || e.day === Number(day)) &&
        `${e.name} ${nativeFestival(e.name, language)} ${(e.aliases || []).join(" ")} ${e.description}`
          .toLowerCase()
          .includes(query.toLowerCase()),
    )
    .sort(
      (a, b) =>
        a.date.localeCompare(b.date) ||
        eventRelevance(b, { state, cluster, language, businessCategory }) -
          eventRelevance(a, { state, cluster, language, businessCategory }),
    );
}
export function eventStatus(event, today = indiaToday()) {
  return event.date === today
    ? "Today"
    : event.date < today
      ? "Past observance"
      : "Upcoming";
}
export function downloadCalendar(events) {
  const esc = (s) =>
    s
      .replaceAll("\\", "\\\\")
      .replaceAll("\n", "\\n")
      .replaceAll(",", "\\,")
      .replaceAll(";", "\\;");
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Festivo3D//India Calendar 2026//EN",
    "CALSCALE:GREGORIAN",
  ];
  for (const e of events) {
    const end = new Date(e.date + "T12:00:00Z");
    end.setUTCDate(end.getUTCDate() + 1);
    lines.push(
      "BEGIN:VEVENT",
      `UID:${e.id}-202609@festivo3d.local`,
      "DTSTAMP:20260914T000000Z",
      `DTSTART;VALUE=DATE:${e.date.replaceAll("-", "")}`,
      `DTEND;VALUE=DATE:${end.toISOString().slice(0, 10).replaceAll("-", "")}`,
      `SUMMARY:${esc(e.name)}`,
      `DESCRIPTION:${esc(e.description + " Reference India civil date; check ritual timings locally.")}`,
      "END:VEVENT",
    );
  }
  lines.push("END:VCALENDAR");
  const url = URL.createObjectURL(
    new Blob([lines.map(foldLine).join("\r\n") + "\r\n"], {
      type: "text/calendar;charset=utf-8",
    }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = "festivo3d-september-2026.ics";
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function foldLine(line) {
  const encoder = new TextEncoder();
  let result = "",
    current = "",
    bytes = 0;
  for (const ch of line) {
    const n = encoder.encode(ch).length;
    if (bytes + n > 73) {
      result += current + "\r\n ";
      current = "";
      bytes = 1;
    }
    current += ch;
    bytes += n;
  }
  return result + current;
}
