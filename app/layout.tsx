import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SessionProvider } from "@/lib/session";
import { Shell } from "@/components/Shell";

export const metadata: Metadata = {
  title: "Omni Admin",
  description: "Einstellungen und Einladungen für alle Apps von Marco Schlude",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8f9ff" },
    { media: "(prefers-color-scheme: dark)", color: "#051424" },
  ],
};

// Setzt das Farbschema vor dem ersten Zeichnen, damit nichts aufblitzt.
const themeScript = `try{var t=localStorage.getItem("omni.theme")||"system";if(t==="dunkel"||(t==="system"&&matchMedia("(prefers-color-scheme: dark)").matches))document.documentElement.classList.add("dark")}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans text-[14px] antialiased">
        <SessionProvider>
          <Shell>{children}</Shell>
        </SessionProvider>
      </body>
    </html>
  );
}
