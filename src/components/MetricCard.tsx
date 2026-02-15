"use client";

import Link from "next/link";

type MetricCardProps = {
  title: string;
  value: string;
  description: string;
  selected?: boolean;
  href?: string;
  onSelect?: () => void;
};

export default function MetricCard({
  title,
  value,
  description,
  selected = false,
  href,
  onSelect,
}: MetricCardProps) {
  return (
    <div
      onClick={onSelect}
      className={`
        group relative overflow-hidden rounded-2xl
        border bg-white dark:bg-zinc-900 p-6 shadow-sm
        transition-all duration-300
        hover:-translate-y-1 hover:shadow-xl
        cursor-pointer
        ${
          selected
            ? "border-indigo-600 shadow-lg"
            : "border-gray-200 dark:border-gray-800"
        }
      `}
    >
      {/* Glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-br from-indigo-500/10 via-transparent to-pink-500/10" />

      <div className="relative z-10 space-y-4">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {title}
        </h3>

        <p className="text-3xl font-bold tracking-tight">
          {value}
        </p>

        <p className="text-sm text-gray-500">
          {description}
        </p>

        {/* CTA real */}
        {href && (
          <div className="pt-4">
            <Link
              href={href}
              onClick={(e) => e.stopPropagation()}
              className="text-sm font-medium text-indigo-600 hover:underline"
            >
              View Details →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
