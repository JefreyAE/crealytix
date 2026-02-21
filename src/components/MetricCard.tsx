"use client";

import Link from "next/link";
import Image from "next/image";
import PlatformIcon from "@/components/PlatformIcon";

type Platform = "youtube" | "instagram" | "tiktok";

type MetricCardProps = {
  title: string;
  value: string;
  description: string;
  platform: Platform;
  thumbnail_url?: string;
  selected?: boolean;
  href?: string;
  onSelect?: () => void;
};

const platformStyles: Record<Platform, { gradient: string; border: string; glow: string }> = {
  youtube: {
    gradient: "from-red-500/20 via-red-500/5 to-transparent",
    border: "border-red-500/50",
    glow: "bg-red-500/10",
  },
  instagram: {
    gradient: "from-pink-500/20 via-purple-500/10 to-orange-500/5",
    border: "border-pink-500/50",
    glow: "bg-pink-500/10",
  },
  tiktok: {
    gradient: "from-cyan-400/20 via-blue-500/10 to-transparent",
    border: "border-cyan-400/50",
    glow: "bg-cyan-400/10",
  },
};

export default function MetricCard({
  title,
  value,
  description,
  platform,
  thumbnail_url,
  selected = false,
  href,
  onSelect,
}: MetricCardProps) {
  const initial = title?.charAt(0)?.toUpperCase() || "?";
  const styles = platformStyles[platform];

  return (
    <div
      onClick={onSelect}
      className={`
        group relative overflow-hidden rounded-2xl
        glass p-4 transition-all duration-500
        cursor-pointer border-2
        ${selected
          ? `${styles.border} shadow-2xl scale-[1.01] z-10 bg-white/5`
          : "border-white/10 dark:border-slate-800/50 hover:border-white/20 dark:hover:border-slate-700/80"
        }
      `}
    >
      {/* SHIMMER/GLOW EFFECT */}
      <div className={`absolute -top-10 -right-10 w-32 h-32 ${styles.glow} blur-[60px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />

      <div className="relative z-10 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          {/* AVATAR SECTION */}
          <div className="relative flex-shrink-0">
            {thumbnail_url ? (
              <div className="relative w-12 h-12 ring-2 ring-white/10 dark:ring-slate-800 rounded-xl overflow-hidden shadow-lg">
                <Image
                  src={thumbnail_url}
                  alt={title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-white text-lg font-black shadow-lg">
                {initial}
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 p-1 bg-white dark:bg-slate-900 rounded-lg shadow-lg border border-slate-100 dark:border-slate-800 scale-75 group-hover:scale-90 transition-transform duration-300">
              <PlatformIcon platform={platform} />
            </div>
          </div>

          {/* INFO SECTION */}
          <div className="min-w-0">
            <h3 className="text-slate-500 dark:text-slate-400 font-bold text-[10px] uppercase tracking-wider mb-0.5 truncate max-w-[120px]">
              {title}
            </h3>
            <div className="flex items-baseline gap-1.5">
              <p className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors">
                {value}
              </p>
              <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">Followers</span>
            </div>
          </div>
        </div>

        {/* ACCESSORY SECTION */}
        <div className="flex flex-col items-end gap-2 shrink-0">
          {selected && (
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-[8px] font-black uppercase tracking-widest animate-reveal">
              <span className="w-1 h-1 rounded-full bg-indigo-500 animate-pulse" />
              Active
            </div>
          )}

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-slate-400 italic hidden sm:block">
              {description}
            </span>
            {href && (
              <Link
                href={href}
                onClick={(e) => e.stopPropagation()}
                className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shadow-sm"
              >
                <span className="text-sm font-bold group-hover:translate-x-0.5 transition-transform">→</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
