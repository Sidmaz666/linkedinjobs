import { NextResponse } from 'next/server';
import { requestJobs, scrapeJobs } from '@/lib/services/linkedin';

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const searchParams = url.searchParams;

        // Pass-through all query params
        const params: Record<string, string> = {};
        for (const [key, value] of searchParams.entries()) {
            params[key] = value;
        }

        // Friendly date filter mapping with default 'past-24'
        // - past-24  -> r86400
        // - past-week -> r604800
        // - past-mon  -> r2592000
        // - anytime   -> no f_TPR
        const date = (params.date || 'past-24').toString().toLowerCase();
        delete params.date;
        if (!params.f_TPR) {
            if (date === 'past-24') params.f_TPR = 'r86400';
            else if (date === 'past-week') params.f_TPR = 'r604800';
            else if (date === 'past-mon') params.f_TPR = 'r2592000';
            else if (date === 'anytime') { /* leave undefined to get all */ }
            else params.f_TPR = 'r86400';
        }

        const html = await requestJobs(params);
        const jobs = scrapeJobs(html);
        return NextResponse.json(jobs);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
    }
}


