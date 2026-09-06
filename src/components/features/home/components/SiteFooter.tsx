import Link from "next/link";
import { footerLinks } from "../data/home.data";

export function SiteFooter() {
  return (
    <footer className="bg-white rounded-[32px] border border-slate-200/80 p-8 sm:p-10 space-y-6 shadow-2xs">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold text-sm shadow-xs">
              D
            </div>
            <span className="font-bold text-lg text-slate-900 tracking-tight">DaurNusa</span>
          </div>
          <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
            Platform marketplace jual-beli sampah dan limbah berbasis AI &amp; proksimitas lokasi untuk ekosistem sirkular Indonesia.
          </p>
        </div>

        <div className="flex flex-wrap gap-6 text-xs font-semibold text-slate-600">
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-emerald-600 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
        <span>© 2026 DaurNusa — Tim Londo Ireng. All rights reserved.</span>
        <span className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 text-slate-600 font-bold text-[11px]">
          Semarang, Jawa Tengah
        </span>
      </div>
    </footer>
  );
}
