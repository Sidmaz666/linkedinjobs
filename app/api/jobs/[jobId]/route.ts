import { NextResponse } from 'next/server';
import { requestJobDetails, scrapeJobDetails } from '@/lib/services/linkedin';

export async function GET(_request: Request, context: { params: Promise<{ jobId: string }> }) {
    const { jobId } = await context.params;
    try {
        const html = await requestJobDetails(jobId);
        const job = scrapeJobDetails(html, jobId);
        return NextResponse.json(job);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch job details' }, { status: 500 });
    }
}


