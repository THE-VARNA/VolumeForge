"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, Trophy, Ticket, Coins, Activity,
  Settings, Zap, FileText, ChevronRight, Flame,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/campaigns", label: "Campaigns", icon: Zap },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { href: "/raffle", label: "Raffle Center", icon: Ticket },
  { href: "/rebate", label: "Rebates", icon: Coins },
  { href: "/feed", label: "Activity Feed", icon: Activity },
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/friction-log", label: "Friction Log", icon: FileText },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 flex-shrink-0 h-screen sticky top-0 flex flex-col border-r border-white/[0.06] bg-background/80 backdrop-blur-xl">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/[0.06]">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
            <Flame className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-base tracking-tight gradient-text">
            VolumeForge
          </span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "nav-item",
                active && "active",
              )}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="flex-1">{label}</span>
              {active && (
                <ChevronRight className="w-3.5 h-3.5 opacity-50" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer — Torque status */}
      <div className="px-3 py-4 border-t border-white/[0.06]">
        <div className="glass rounded-lg px-3 py-2.5 flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-slate-300 truncate">Torque</p>
            <p className="text-[10px] text-muted-foreground">Connected</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
