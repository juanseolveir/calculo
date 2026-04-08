"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface Props {
  href: string;
  exact?: boolean;
  children: React.ReactNode;
}

export default function NavLinkClient({ href, exact = false, children }: Props) {
  const pathname = usePathname();
  const isActive = exact ? pathname === href : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={`flex items-center gap-1.5 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
        isActive
          ? "text-blue-600 bg-blue-50"
          : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
      }`}
    >
      {children}
    </Link>
  );
}
