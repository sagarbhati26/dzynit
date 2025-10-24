import "./globals.css";
import Navbar from "../components/Navbar";

export const metadata = {
  title: "DzynIt — Design & Marketplace",
  description: "Create custom tees & hoodies and publish to the marketplace.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>
        <footer className="py-8 text-center text-sm text-muted/80 border-t border-transparent/10">
          © {new Date().getFullYear()} DzynIt — Crafted with ❤️ for creators
        </footer>
      </body>
    </html>
  );
}