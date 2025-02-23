import { Header } from "./Header";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <>
      <Header />
      <div className="min-h-screen flex flex-col items-center pt-24 px-4 bg-gradient-to-br from-primary via-primary-soft to-secondary-soft">
        <div className="w-full max-w-2xl space-y-8">
          {children}
        </div>

        <footer className="mt-12 text-sm text-text-soft">
          © 2025 Minhas Histórias Infantis
        </footer>
      </div>
    </>
  );
} 