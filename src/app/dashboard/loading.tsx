export default function Loading() {
  return (
    <div className="space-y-8 animate-pulse">
      
      <div className="flex items-center justify-between">
        <div className="h-8 w-40 rounded bg-gray-300 dark:bg-gray-700" />
        <div className="h-10 w-32 rounded-xl bg-gray-300 dark:bg-gray-700" />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="h-40 rounded-2xl bg-gray-300 dark:bg-gray-700"
          />
        ))}
      </div>
    </div>
  )
}
