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
      return <div className="w-5 h-5 bg-black rounded-sm" />;

    default:
      return null;
  }
}
