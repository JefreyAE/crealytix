"use client";

import Link from "next/link";
import Image from "next/image";

export default function PrivacyPage() {
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
                        Privacy Policy
                    </h1>
                    <p className="text-slate-500 mb-12">Last updated: February 21, 2026</p>

                    <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
                        <section>
                            <h2 className="text-2xl font-bold mb-4">1. Information We Collect</h2>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                                Crealytix collects certain information to provide and improve our social analytics services:
                            </p>
                            <ul className="list-disc pl-6 text-slate-600 dark:text-slate-400 space-y-2">
                                <li><strong>Account Information:</strong> Email address and profile name when you sign up.</li>
                                <li><strong>OAuth Data:</strong> When you connect your social accounts, we receive access tokens and public metrics (follower counts, subscriber counts, engagement data) from YouTube, Instagram, and TikTok.</li>
                                <li><strong>Usage Data:</strong> Information on how you interact with our website to improve user experience.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4">2. How We Use Information</h2>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                We use the collected data to:
                            </p>
                            <ul className="list-disc pl-6 mt-4 text-slate-600 dark:text-slate-400 space-y-2">
                                <li>Provide unified growth dashboards.</li>
                                <li>Analyze trends and provide actionable insights.</li>
                                <li>Communicate service updates and support.</li>
                                <li>Ensure the security and integrity of our Service.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4">3. Data Sharing & Third Parties</h2>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                Crealytix **does not sell** your personal data to third parties. We only share information when:
                            </p>
                            <ul className="list-disc pl-6 mt-4 text-slate-600 dark:text-slate-400 space-y-2">
                                <li>Explicitly authorized by you (e.g., connecting a social account).</li>
                                <li>Required by law or to protect our legal rights.</li>
                                <li>Working with trusted service providers who help us operate our Service (e.g., hosting, authentication).</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4">4. Compliance with Platform Policies</h2>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                Our Service complies with the developer policies of the platforms we integrate with:
                            </p>
                            <ul className="list-disc pl-6 mt-4 text-slate-600 dark:text-slate-400 space-y-2">
                                <li><strong>YouTube/Google:</strong> We follow the <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" className="text-indigo-600 hover:underline">Google API Services User Data Policy</a>. You can revoke Crealytix's access to your YouTube data via the <a href="https://myaccount.google.com/permissions" target="_blank" className="text-indigo-600 hover:underline">Google security settings page</a>.</li>
                                <li><strong>Instagram/Meta:</strong> We comply with Meta's developer policies.</li>
                                <li><strong>TikTok:</strong> We follow TikTok's API usage guidelines.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4">5. Data Security</h2>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                We implement industry-standard security measures to protect your information from unauthorized access, alteration, or destruction. However, no method of transmission over the internet is 100% secure.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4">6. Your Rights</h2>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                You have the right to access, update, or delete your personal information at any time. You can disconnect your social accounts from your dashboard or contact us for account deletion.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4">7. Cookies</h2>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                We use cookies to maintain your session and remember your preferences. You can manage cookie settings through your browser.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4">8. Changes to This Policy</h2>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting the new policy on this page.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4">9. Contact Us</h2>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                If you have questions about our privacy practices, please reach out to <span className="font-semibold text-indigo-600">privacy@crealytix.com</span>.
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
