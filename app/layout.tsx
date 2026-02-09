import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import { DataProvider } from "@/contexts/DataContext";
import { fleetSummary, processedRecords, meterIds } from "@/lib/data";

export const metadata: Metadata = {
  title: "ION Energy Solutions - Fleet Overview",
  description: "Meter readings and consumption dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Header />
        <DataProvider value={{ fleet: fleetSummary, processed: processedRecords, meterIds }}>
          {children}
        </DataProvider>
      </body>
    </html>
  );
}
