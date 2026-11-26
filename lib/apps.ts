// Alle Apps, die sich die gemeinsame Gästeliste teilen (siehe RetroMind api/_guests.js).
// Eine neue App kommt hierher und in APP_ORIGINS von RetroMind.

export type AppInfo = {
  id: string;
  name: string;
  description: string;
  icon: string; // Material-Symbols-Name
  url: string;
  repo: string;
  extraUrls?: { label: string; url: string }[];
  note?: string;
};

export const APPS: AppInfo[] = [
  {
    id: "retromind",
    name: "RetroMind",
    description: "Zeitreise & Retro-Gaming",
    icon: "sports_esports",
    url: "https://retromind.vercel.app",
    repo: "SchludeMarco/retromind",
    extraUrls: [{ label: "Gaming-Edition", url: "https://retromind-gaming.vercel.app" }],
    note: "Hier liegt die gemeinsame Gästeliste. Gäste melden sich an der RetroMind-Gästetür mit Google an.",
  },
  {
    id: "toolpulse",
    name: "ToolPulse",
    description: "Täglich die besten Tools entdecken",
    icon: "bolt",
    url: "https://toolpulse-phi.vercel.app",
    repo: "SchludeMarco/toolpulse",
  },
  {
    id: "smartcraft",
    name: "Sm@rtCraft 3.0",
    description: "KI-Installationsanalyse per Foto",
    icon: "construction",
    url: "https://smartcraft-v3.vercel.app",
    repo: "SchludeMarco/smartcraft-v3",
  },
  {
    id: "rumble",
    name: "Rumble",
    description: "Partyspiel für Familie & Freunde",
    icon: "celebration",
    url: "https://rumble-party.vercel.app",
    repo: "SchludeMarco/rumble-party",
  },
  {
    id: "ai-investment",
    name: "AI Investment Manager",
    description: "Persönliches Investment-Dashboard",
    icon: "monitoring",
    url: "https://ai-investment-manager-one.vercel.app",
    repo: "SchludeMarco/ai-investment-manager",
  },
  {
    id: "abocheck",
    name: "AboCheck",
    description: "Abos im Blick & Sparpotenzial",
    icon: "receipt_long",
    url: "https://abocheck-frontend.vercel.app",
    repo: "SchludeMarco/AboCheck",
  },
  {
    id: "ms-akku",
    name: "MS Akku",
    description: "In Planung",
    icon: "battery_charging_full",
    url: "https://ms-akku.vercel.app",
    repo: "SchludeMarco/ms-akku",
  },
];

export const findApp = (id: string) => APPS.find((a) => a.id === id);
