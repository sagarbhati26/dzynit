import "./globals.css";
import Navbar from "../components/Navbar";
import SiteFooter from "../components/SiteFooter";

export const metadata = {
  title: "Dzyn — Design & Marketplace",
  description: "Create custom tees & hoodies and publish to the marketplace.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* suppressHydrationWarning only if a subtree is known to differ */}
      <body className="min-h-screen flex flex-col antialiased" suppressHydrationWarning>
        <Navbar />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}