import { formatNumber, formatTimeAgo } from "@/lib/utils/format";
// import DeleteTikTokAccountButton from "./DeleteTikTokAccountButton"; // TODO: Implement if needed
import Image from "next/image";

type Props = {
    account: {
        id: string;
        username: string;
        display_name: string;
        follower_count: number;
        like_count: number;
        tiktok_user_id: string;
        last_synced_at: string | null;
        avatar_url: string;
    };
    now: number;
};

export default function TikTokHero({ account, now }: Props) {
    return (
        <section className="rounded-2xl border border-gray-800 bg-[#111827] p-8 shadow-lg">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

                <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-xl bg-indigo-600 flex items-center justify-center text-white text-2xl font-bold">
                        {account.avatar_url ? (
                            <div className="relative w-20 h-20">
                                <Image
                                    src={account.avatar_url}
                                    alt={account.display_name}
                                    fill
                                    className="rounded-xl object-cover border border-gray-700"
                                />
                            </div>
                        ) : (
                            <div className="w-16 h-16 rounded-xl bg-gray-700 flex items-center justify-center text-white text-xl font-bold border border-gray-700">
                                {account.display_name.charAt(0)}
                            </div>
                        )}
                    </div>

                    <div>
                        <h1 className="text-3xl font-bold">
                            {account.display_name}
                        </h1>
                        <p className="text-sm text-gray-400">@{account.username}</p>

                        <p className="text-xl mt-2 text-indigo-400 font-semibold">
                            {formatNumber(account.follower_count)} Followers
                        </p>

                        <p className="text-gray-400 mt-1">
                            {formatNumber(account.like_count)} total likes
                        </p>

                        <p className="text-sm text-gray-500 mt-2">
                            Synced {formatTimeAgo(account.last_synced_at, now)}
                        </p>
                    </div>
                </div>

                <div>
                    <a
                        href={`https://www.tiktok.com/@${account.username}`}
                        target="_blank"
                        className="px-4 py-2 rounded-lg border border-gray-700 hover:bg-gray-800 transition text-sm"
                    >
                        Open in TikTok
                    </a>
                    {/* <DeleteTikTokAccountButton accountId={account.id} accountName={account.display_name} /> */}
                </div>
            </div>
        </section>
    );
}
