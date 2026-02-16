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

const platformGradients: Record<Platform, string> = {
  youtube: "from-red-500/10 via-transparent to-red-400/5",
  instagram:
    "from-pink-500/10 via-purple-500/5 to-orange-400/10",
  tiktok:
    "from-cyan-400/10 via-transparent to-blue-500/10",
};

const platformBorders: Record<Platform, string> = {
  youtube: "border-red-500/40",
  instagram: "border-pink-500/40",
  tiktok: "border-cyan-400/40",
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

  return (
    <div
      onClick={onSelect}
      className={`
        group relative overflow-hidden rounded-2xl
        border bg-[#0f172a]
        p-6 shadow-sm
        transition-all duration-300
        hover:-translate-y-1 hover:shadow-xl
        cursor-pointer
        ${
          selected
            ? `${platformBorders[platform]} shadow-lg scale-[1.01]`
            : "border-gray-800"
        }
      `}
    >
      {/* PLATFORM GRADIENT OVERLAY */}
      <div
        className={`
          absolute inset-0 opacity-0 group-hover:opacity-100
          transition duration-500
          bg-gradient-to-br ${platformGradients[platform]}
        `}
      />

      <div className="relative z-10">

        {/* TOP ROW */}
        <div className="flex items-start justify-between">

          {/* LEFT SIDE */}
          <div className="space-y-5">

            {/* PLATFORM BADGE */}
            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-gray-400">
              <PlatformIcon platform={platform} />
              <span>{platform}</span>
            </div>

            {/* TITLE */}
            <h3 className="text-sm font-medium text-gray-400 truncate max-w-[200px]">
              {title}
            </h3>

            {/* VALUE */}
            <p className="text-3xl font-bold tracking-tight text-white">
              {value}
            </p>

            {/* DESCRIPTION */}
            <p className="text-sm text-gray-400">
              {description}
            </p>
          </div>

          {/* RIGHT SIDE - AVATAR */}
          <div className="relative flex-shrink-0">

            {thumbnail_url ? (
              <div className="relative w-16 h-16">
                <Image
                  src={thumbnail_url}
                  alt={title}
                  fill
                  className="rounded-xl object-cover border border-gray-700"
                />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-xl bg-gray-700 flex items-center justify-center text-white text-xl font-bold border border-gray-700">
                {initial}
              </div>
            )}

            {selected && (
              <div className="absolute -top-2 -right-2 text-xs bg-indigo-600 text-white px-2 py-1 rounded-full">
                ✓
              </div>
            )}
          </div>
        </div>

        {/* CTA */}
        {href && (
          <div className="pt-6">
            <Link
              href={href}
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1 text-sm font-medium text-indigo-400 hover:text-indigo-300 transition"
            >
              View Details
              <span className="group-hover:translate-x-1 transition-transform">
                →
              </span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
