"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import { Search, ArrowLeft, Github } from 'lucide-react';
import Link from 'next/link';

export default function SiteHeader() {
    const pathname = usePathname();
    const showBack = pathname && pathname !== '/';
    return (
        <header className="bg-[#0A66C2] text-white">
            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-wrap">
                    {showBack ? (
                        <Link href="/" className="inline-flex items-center gap-1 text-white/90 hover:text-white underline">
                            <ArrowLeft className="w-5 h-5" />
                            Back
                        </Link>
                    ) : null}

                    <div className="flex items-center gap-3">
                        <Search className="w-7 h-7 inline-block" />
                        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">LinkedIn Jobs Finder</h1>
                    </div>
                    </div>

                    <nav className="mt-4 md:mt-0 flex items-center gap-4">
                        <Link href="/docs" className="text-white/90 hover:text-white underline text-sm md:text-base">API</Link>
                        <a
                            href="https://github.com/sidmaz666/linkedInjobs"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="GitHub repository"
                            className="inline-flex items-center text-white/90 hover:text-white"
                        >
                            <Github className="w-5 h-5" />
                        </a>
                    </nav>
                </div>
            </div>
        </header>
    );
}


