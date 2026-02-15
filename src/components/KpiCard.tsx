/* ------------------------------------------------ */
/* KPI CARD COMPONENT */
/* ------------------------------------------------ */

export default function KpiCard({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-800 bg-[#111827] p-6 shadow-sm transition hover:shadow-md">
      <p className="text-sm text-gray-400">
        {title}
      </p>

      <p className="text-3xl font-bold mt-2">
        {value}
      </p>
    </div>
  );
}