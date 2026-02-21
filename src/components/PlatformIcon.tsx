type Platform = "youtube" | "instagram" | "tiktok";

export default function PlatformIcon({ platform }: { platform: Platform }) {
  switch (platform) {
    case "youtube":
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-red-600">
          <path d="M19.615 3.184C17.667 2.667 12 2.667 12 2.667s-5.667 0-7.615.517A2.965 2.965 0 0 0 2.267 5.3 30.19 30.19 0 0 0 2 12a30.19 30.19 0 0 0 .267 6.7 2.965 2.965 0 0 0 2.118 2.116C6.333 21.333 12 21.333 12 21.333s5.667 0 7.615-.517a2.965 2.965 0 0 0 2.118-2.116A30.19 30.19 0 0 0 22 12a30.19 30.19 0 0 0-.267-6.7 2.965 2.965 0 0 0-2.118-2.116zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" />
        </svg>
      );

    case "instagram":
      return <div className="w-5 h-5 bg-gradient-to-tr from-pink-500 to-yellow-500 rounded-md" />;

    case "tiktok":
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z" />
        </svg>
      );

    default:
      return null;
  }
}
