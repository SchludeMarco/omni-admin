"use client";

import { APPS } from "@/lib/apps";
import { Icon } from "./ui";

/** Apps zum An- und Abhaken, mit „Alle Apps“ oben. */
export function AppPicker({ value, onChange }: { value: string[]; onChange: (ids: string[]) => void }) {
  const all = value.length === APPS.length;
  const toggle = (id: string) => onChange(value.includes(id) ? value.filter((v) => v !== id) : [...value, id]);

  return (
    <div className="flex flex-col gap-1.5">
      <button
        type="button"
        onClick={() => onChange(all ? [] : APPS.map((a) => a.id))}
        className={`flex items-center gap-3 rounded-xl p-3 text-left ${all ? "bg-accent text-on-accent" : "bg-s-mid"}`}
      >
        <Icon name={all ? "check_box" : "check_box_outline_blank"} size={22} />
        <span className="min-w-0 flex-1">
          <span className="block text-[14px] font-semibold">Alle Apps</span>
          <span className={`block text-[11px] ${all ? "text-on-accent/80" : "text-muted"}`}>Bekommt auch neue Apps automatisch</span>
        </span>
      </button>
      <div className="grid gap-1.5 md:grid-cols-2">
        {APPS.map((a) => {
          const on = value.includes(a.id);
          return (
            <button
              type="button"
              key={a.id}
              onClick={() => toggle(a.id)}
              className={`flex items-center gap-3 rounded-lg p-2 text-left ${on ? "bg-s-high" : "bg-s-low opacity-70"}`}
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-s-lowest text-primary">
                <Icon name={a.icon} size={18} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[13px] font-medium">{a.name}</span>
                <span className="block truncate text-[11px] text-muted">{a.description}</span>
              </span>
              <Icon name={on ? "check_circle" : "radio_button_unchecked"} size={20} className={on ? "text-ok" : "text-outline"} />
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** Kurze App-Liste als Chips. */
export function AppChips({ ids }: { ids: string[] }) {
  if (ids.length === APPS.length)
    return <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[11px] font-semibold text-primary">Alle Apps ({APPS.length})</span>;
  return (
    <>
      {APPS.filter((a) => ids.includes(a.id)).map((a) => (
        <span key={a.id} className="inline-flex items-center gap-1 rounded-full bg-s-mid px-2 py-0.5 text-[11px] font-medium">
          <Icon name={a.icon} size={12} className="text-primary" />
          {a.name}
        </span>
      ))}
    </>
  );
}
