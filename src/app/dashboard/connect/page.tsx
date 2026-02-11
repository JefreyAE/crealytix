export default function ConnectPage() {
  return (
    <div className="max-w-lg mx-auto py-20 text-center">
      <h1 className="text-2xl font-bold mb-4">
        Connect Your Account
      </h1>

      <p className="text-gray-500 dark:text-gray-400 mb-8">
        Soon you will be able to connect Instagram and YouTube.
      </p>

      <div className="space-y-4">
        <button className="w-full rounded-xl bg-pink-500 px-4 py-3 text-white hover:bg-pink-600 transition">
          Connect Instagram
        </button>

        <button className="w-full rounded-xl bg-red-500 px-4 py-3 text-white hover:bg-red-600 transition">
          Connect YouTube
        </button>
      </div>
    </div>
  )
}
