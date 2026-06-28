// Case-insensitive substring filter across the given fields of each row.
export function filterByQuery<T>(
  rows: T[],
  q: string | undefined,
  fields: (r: T) => (string | null | undefined)[],
): T[] {
  const needle = (q ?? "").toLowerCase().trim();
  if (!needle) return rows;
  return rows.filter((r) =>
    fields(r)
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(needle),
  );
}
