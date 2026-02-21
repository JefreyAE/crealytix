"use client";

import Link from "next/link";
import Image from "next/image";

export default function TermsPage() {
    return (
        <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 overflow-x-hidden relative selection:bg-indigo-500/30">
            {/* BACKGROUND EFFECTS */}
            <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[10%] right-[-5%] w-[35%] h-[35%] bg-purple-500/10 blur-[100px] rounded-full" />
            </div>

            {/* HEADER */}
            <header className="sticky top-0 z-50 w-full border-b border-slate-200/50 bg-white/70 backdrop-blur-xl dark:bg-slate-950/70 dark:border-slate-800/50">
                <div className="max-w-7xl mx-auto flex items-center justify-between px-6 h-16">
                    <Link href="/" className="flex items-center gap-2 group">
                        <Image
                            src="/Brand logo.png"
                            alt="Crealytix Logo"
                            width={32}
                            height={32}
                            className="rounded-lg shadow-lg group-hover:scale-110 transition-transform"
                        />
                        <span className="text-xl font-bold tracking-tight">Crealytix</span>
                    </Link>
                    <Link href="/" className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors">
                        Back to Home
                    </Link>
                </div>
            </header>

            {/* CONTENT */}
            <section className="max-w-4xl mx-auto px-6 py-20 relative z-10">
                <div className="animate-fadeUp">
                    <h1 className="text-4xl md:text-5xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-b from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">
                        Terms of Service
                    </h1>
                    <p className="text-slate-500 mb-12">Last updated: February 21, 2026</p>

                    <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
                        <section>
                            <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                By accessing and using Crealytix ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4">2. Description of Service</h2>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                Crealytix provides social media analytics and growth tracking tools for YouTube, Instagram, and TikTok. These services are provided "as is" and depend on the availability of technical interfaces (APIs) provided by the respective social media platforms.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4">3. User Accounts & Registration</h2>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                To access full features, you may be required to create an account via Google Authentication or email. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4">4. Data from Third-Party Services</h2>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                By connecting your YouTube, Instagram, or TikTok accounts to Crealytix, you authorize us to access and process your publicly available metrics and profile information as permitted by your privacy settings on those platforms.
                            </p>
                            <ul className="list-disc pl-6 mt-4 text-slate-600 dark:text-slate-400 space-y-2">
                                <li><strong>YouTube:</strong> Use of YouTube analytics is subject to the <a href="https://www.youtube.com/t/terms" target="_blank" className="text-indigo-600 hover:underline">YouTube Terms of Service</a> and <a href="https://policies.google.com/privacy" target="_blank" className="text-indigo-600 hover:underline">Google Privacy Policy</a>.</li>
                                <li><strong>TikTok:</strong> Use of TikTok data is subject to <a href="https://www.tiktok.com/legal/terms-of-service" target="_blank" className="text-indigo-600 hover:underline">TikTok Terms of Service</a>.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4">5. Prohibited Conduct</h2>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                You agree not to use the Service to:
                            </p>
                            <ul className="list-disc pl-6 mt-4 text-slate-600 dark:text-slate-400 space-y-2">
                                <li>Violate any local, state, or international laws.</li>
                                <li>Attempt to reverse engineer, scrape, or interfere with the Service's infrastructure.</li>
                                <li>Circumvent platform limits or automate account creation.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4">6. Limitation of Liability</h2>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                Crealytix shall not be liable for any indirect, incidental, special, or consequential damages resulting from the use or inability to use the Service, including but not limited to loss of profits or data.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4">7. Termination</h2>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                We reserve the right to terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4">8. Contact Us</h2>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                If you have any questions about these Terms, please contact us at <span className="font-semibold text-indigo-600">support@crealytix.com</span>.
                            </p>
                        </section>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="py-12 px-6 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                <div className="max-w-7xl mx-auto text-center text-sm text-slate-400">
                    © {new Date().getFullYear()} Crealytix. All rights reserved.
                </div>
            </footer>
        </main>
    );
}
