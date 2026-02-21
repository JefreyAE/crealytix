import { formatNumber, formatTimeAgo } from "@/lib/utils/format";
import Image from "next/image";
import PlatformIcon from "@/components/PlatformIcon";

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
        <section className="relative overflow-hidden group">
            <div className="glass p-8 md:p-12 rounded-[3rem] border-2 border-slate-200/50 dark:border-slate-800/50 flex flex-col md:flex-row md:items-center justify-between gap-10">
                {/* DECORATIVE BACKGROUND */}
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-cyan-400/5 to-transparent pointer-events-none" />

                <div className="relative flex flex-col md:flex-row items-center gap-10 text-center md:text-left">
                    <div className="relative">
                        <div className="absolute inset-0 bg-cyan-400/20 blur-3xl rounded-full scale-150 animate-pulse" />
                        {account.avatar_url ? (
                            <div className="relative w-32 h-32 md:w-40 md:h-40">
                                <Image
                                    src={account.avatar_url}
                                    alt={account.display_name}
                                    fill
                                    className="rounded-[2.5rem] object-cover border-4 border-white dark:border-slate-800 shadow-2xl"
                                />
                            </div>
                        ) : (
                            <div className="w-32 h-32 md:w-40 md:h-40 rounded-[2.5rem] bg-slate-800 flex items-center justify-center text-white text-5xl font-black border-4 border-white dark:border-slate-800 shadow-2xl">
                                {account.display_name.charAt(0)}
                            </div>
                        )}
                        <div className="absolute -bottom-4 -right-4 p-4 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 group-hover:scale-110 transition-transform duration-300">
                            <PlatformIcon platform="tiktok" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-1">
                            <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 dark:text-white">
                                {account.display_name}
                            </h1>
                            <p className="text-lg font-bold text-slate-500 tracking-tight">@{account.username}</p>
                        </div>

                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Followers</span>
                                <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{formatNumber(account.follower_count)}</span>
                            </div>
                            <div className="w-px h-8 bg-slate-200 dark:bg-slate-800 hidden sm:block" />
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Likes</span>
                                <span className="text-2xl font-black text-slate-900 dark:text-white">{formatNumber(account.like_count)}</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-center md:justify-start gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
                                Last synced {formatTimeAgo(account.last_synced_at, now)}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="relative flex flex-col gap-4 w-full md:w-auto">
                    <a
                        href={`https://www.tiktok.com/@${account.username}`}
                        target="_blank"
                        className="w-full md:w-auto px-8 py-4 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-center transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-400/20 active:scale-95 flex items-center justify-center gap-3"
                    >
                        <PlatformIcon platform="tiktok" />
                        Open Profile
                    </a>
                    <button className="w-full md:w-auto px-8 py-4 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-black hover:bg-slate-50 dark:hover:bg-slate-700 transition" >
                        Refresh Sync
                    </button>
                </div>
            </div>
        </section>
    );
}
