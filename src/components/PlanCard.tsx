interface PlanCardProps {
  title: string
  price: string
  description: string
  features: string[]
  buttonText: string
  onClick: () => void
  highlight?: boolean
}

export default function PlanCard({
  title,
  price,
  description,
  features,
  buttonText,
  onClick,
  highlight,
}: PlanCardProps) {
  return (
    <div
      className={`relative rounded-2xl p-8 border shadow-sm transition ${
        highlight
          ? "border-indigo-600 scale-105 shadow-lg"
          : "border-gray-200 dark:border-gray-800"
      }`}
    >
      {highlight && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-indigo-600 text-white text-xs px-3 py-1">
          Most Popular
        </span>
      )}

      <h3 className="text-xl font-semibold">{title}</h3>

      <p className="mt-4 text-4xl font-bold">
        {price}
        <span className="text-lg font-normal text-gray-500">/month</span>
      </p>

      <p className="mt-2 text-gray-500">{description}</p>

      <ul className="mt-6 space-y-2 text-gray-600">
        {features.map((feature, i) => (
          <li key={i}>✔ {feature}</li>
        ))}
      </ul>

      <button
        onClick={onClick}
        className="mt-8 w-full rounded-xl bg-indigo-600 py-3 text-white font-medium hover:bg-indigo-700 transition"
      >
        {buttonText}
      </button>
    </div>
  )
}
