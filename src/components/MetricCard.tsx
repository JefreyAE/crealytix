type MetricCardProps = {
  title: string;
  value: string;
  description: string;
};

export default function MetricCard({
  title,
  value,
  description,
}: MetricCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-zinc-900 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* Glow effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-br from-indigo-500/10 via-transparent to-pink-500/10" />

      <div className="relative z-10 space-y-4">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {title}
        </h3>

        <p className="text-3xl font-bold tracking-tight">{value}</p>

        <p className="text-sm text-green-500 font-medium">{description}</p>
        <div className="mt-4 h-10 flex items-end gap-1">
          {[4, 6, 3, 8, 5, 9, 7].map((height, i) => (
            <div
              key={i}
              className="w-2 rounded bg-gradient-to-t from-indigo-500 to-purple-500 opacity-80"
              style={{ height: `${height * 4}px` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
