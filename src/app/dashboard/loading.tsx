export default function Loading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* HEADER SKELETON */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-slate-200/60 dark:border-slate-800/60">
        <div className="space-y-3">
          <div className="h-10 w-48 rounded-xl bg-slate-200 dark:bg-slate-800" />
          <div className="flex items-center gap-3">
            <div className="h-6 w-24 rounded-full bg-slate-200 dark:bg-slate-800" />
            <div className="h-4 w-40 rounded-lg bg-slate-200/50 dark:bg-slate-800/50" />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-12 w-40 rounded-2xl bg-slate-200 dark:bg-slate-800" />
          <div className="h-12 w-32 rounded-2xl bg-slate-200/50 dark:bg-slate-800/50" />
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700" />
          <div className="h-3 w-40 rounded-full bg-slate-200 dark:bg-slate-800" />
        </div>

        {/* HORIZONTAL CHANNEL CARD GRID */}
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="glass p-4 rounded-2xl border-2 border-slate-200/50 dark:border-slate-800/50 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-200 dark:bg-slate-800" />
                <div className="space-y-2">
                  <div className="h-3 w-16 rounded-full bg-slate-200 dark:bg-slate-800" />
                  <div className="h-6 w-24 rounded-lg bg-slate-200 dark:bg-slate-800" />
                </div>
              </div>
              <div className="w-8 h-8 rounded-lg bg-slate-200/50 dark:bg-slate-800/50" />
            </div>
          ))}
        </div>
      </div>

      {/* CHART SECTION SKELETON */}
      <div className="space-y-6 pt-2">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700" />
          <div className="h-3 w-48 rounded-full bg-slate-200 dark:bg-slate-800" />
        </div>

        <div className="glass p-6 md:p-8 rounded-[2rem] border-2 border-slate-200/50 dark:border-slate-800/50 space-y-8 shadow-2xl shadow-indigo-500/5">
          {/* COMPACT CHART HEADER SKELETON */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="h-3 w-32 rounded-full bg-slate-200 dark:bg-slate-800" />
              <div className="h-10 w-48 rounded-xl bg-slate-200 dark:bg-slate-800" />
              <div className="h-3 w-40 rounded-full bg-slate-200/50 dark:bg-slate-800/50" />
            </div>
            <div className="h-12 w-72 rounded-2xl bg-slate-100 dark:bg-slate-800/50" />
          </div>

          {/* LARGE CHART AREA SKELETON */}
          <div className="h-[400px] w-full rounded-3xl bg-slate-50/50 dark:bg-slate-800/20 shadow-inner" />
        </div>
      </div>
    </div>
  );
}
