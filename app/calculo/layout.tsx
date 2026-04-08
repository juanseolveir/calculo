import Link from "next/link";
import { BookOpen, LayoutDashboard, Library, FileText, ChevronLeft } from "lucide-react";

export default function CalculoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top nav */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-6 py-0 flex items-center">
          {/* Back + brand */}
          <div className="flex items-center gap-3 py-3 pr-6 border-r border-slate-200 mr-4">
            <Link
              href="/"
              className="text-slate-400 hover:text-slate-700 transition-colors"
              title="Volver al inicio"
            >
              <ChevronLeft className="w-4 h-4" />
            </Link>
            <div className="w-7 h-7 rounded-md bg-blue-500 flex items-center justify-center">
              <BookOpen className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-semibold text-slate-800 text-sm">
              Cálculo I
            </span>
          </div>

          {/* Nav links */}
          <nav className="flex items-center gap-1">
            <NavLink href="/calculo" exact icon={<LayoutDashboard className="w-4 h-4" />}>
              Dashboard
            </NavLink>
            <NavLink href="/calculo/teoremas" icon={<Library className="w-4 h-4" />}>
              Teoremas
            </NavLink>
            <NavLink href="/calculo/guias" icon={<FileText className="w-4 h-4" />}>
              Guías
            </NavLink>
          </nav>
        </div>
      </header>

      {/* Page content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  );
}

// ── NavLink ───────────────────────────────────────────────────────────────────

import NavLinkClient from "@/components/NavLinkClient";

function NavLink({
  href,
  exact,
  icon,
  children,
}: {
  href: string;
  exact?: boolean;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <NavLinkClient href={href} exact={exact}>
      {icon}
      {children}
    </NavLinkClient>
  );
}
