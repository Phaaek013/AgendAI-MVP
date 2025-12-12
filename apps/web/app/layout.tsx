import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AgendAI Dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans bg-slate-50 text-slate-900 min-h-screen">
        <main className="max-w-5xl mx-auto p-8 space-y-6">
          <header className="border-b pb-4">
            <h1 className="text-2xl font-semibold">AgendAI</h1>
            <p className="text-sm text-slate-600">Multi-channel scheduling assistant</p>
          </header>
          {children}
        </main>
      </body>
    </html>
  );
}
