// The browser reading of a source that refuses the script (decision 140): its passages, from the
// figures and claims that quote it, and their dates in scripts/passages-checked-in-browser.json.
// A passage is due when it has no date or its date is more than `days` old. A source that quotes
// no passage has nothing to date, so it is never due: the page is read by hand.
export function readingOf(sourceId, figures, claims, readings, today, days) {
  const ids = [...Object.entries(figures), ...Object.entries(claims)].filter(([, r]) => r.source_id === sourceId && r.passage).map(([id]) => id);
  const age = (id) => Math.round((Date.parse(today) - Date.parse(readings[id].date)) / 86400000);
  const unread = ids.filter((id) => !readings[id]);
  const old = ids.filter((id) => readings[id] && age(id) > days);
  const oldest = ids.map((id) => readings[id]).filter(Boolean).sort((a, b) => a.date.localeCompare(b.date))[0];
  return { passages: ids.length, unread, old, oldest, due: unread.length + old.length > 0 };
}
