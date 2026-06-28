// Shared form primitives for CRUD screens. Plain Tailwind; shadcn migration later.

export function Field({
  name,
  label,
  type = "text",
  required = false,
  defaultValue,
  step,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  defaultValue?: string | number;
  step?: string;
}) {
  return (
    <div>
      <label className="block text-[13px] font-medium text-muted">{label}</label>
      <input
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        step={step}
        className="mt-1 w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink transition placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/15"
      />
    </div>
  );
}

export function TextArea({
  name,
  label,
  rows = 2,
  defaultValue,
}: {
  name: string;
  label: string;
  rows?: number;
  defaultValue?: string;
}) {
  return (
    <div className="sm:col-span-2">
      <label className="block text-[13px] font-medium text-muted">{label}</label>
      <textarea
        name={name}
        rows={rows}
        defaultValue={defaultValue}
        className="mt-1 w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink transition placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/15"
      />
    </div>
  );
}

export function Select({
  name,
  label,
  options,
  required = false,
}: {
  name: string;
  label: string;
  options: { value: string; label: string }[];
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-[13px] font-medium text-muted">{label}</label>
      <select
        name={name}
        required={required}
        className="mt-1 w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink transition focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/15"
      >
        <option value="">-</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function SubmitButton({ children }: { children: React.ReactNode }) {
  return (
    <div className="sm:col-span-2">
      <button className="rounded-lg bg-ink px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 active:translate-y-px">
        {children}
      </button>
    </div>
  );
}

export function enumOptions<T extends string>(map: Record<T, string>) {
  return (Object.entries(map) as [T, string][]).map(([value, label]) => ({
    value,
    label,
  }));
}
