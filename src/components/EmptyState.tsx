export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <h2 className="text-xl font-semibold mb-2">
        No accounts connected yet
      </h2>

      <p className="text-gray-500 mb-6">
        Connect your YouTube account to start tracking real metrics.
      </p>

      <a
        href="/dashboard/connect"
        className="rounded-xl bg-black px-5 py-2.5 text-white hover:bg-gray-800 transition"
      >
        + Add Account
      </a>
    </div>
  );
}
