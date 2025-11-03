import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import JobHeader from '@/components/job/JobHeader';
import JobDescription from '@/components/job/JobDescription';
import JobCriteria from '@/components/job/JobCriteria';

type JobDetails = {
    id: string;
    title?: string;
    company?: string;
    companyLink?: string;
    companyLogo?: string;
    location?: string;
    listedAtText?: string;
    applicantsText?: string;
    compensation?: string;
    applyUrl?: string;
    descriptionHtml?: string;
    descriptionText?: string;
    criteria?: Array<{ label?: string; value?: string }>;
};

export async function generateMetadata({ params }: { params: { jobId: string } }): Promise<Metadata> {
    const { jobId } = await params;
    const h = await headers();
    const host = h.get('x-forwarded-host') || h.get('host');
    const proto = h.get('x-forwarded-proto') || 'http';
    const base = `${proto}://${host}`;
    try {
        const res = await fetch(`${base}/api/jobs/${encodeURIComponent(jobId)}`, { cache: 'no-store' });
        if (!res.ok) return { title: 'Job Details' };
        const d = await res.json();
        const title = d?.title ? `${d.title} • ${d.company || 'Job'}` : 'Job Details';
        const description = d?.descriptionText || `${d?.company || ''} ${d?.location ? '• '+d.location : ''}`.trim();
        return { title, description, openGraph: { title, description }, twitter: { title, description } };
    } catch {
        return { title: 'Job Details' };
    }
}

async function getData(id: string): Promise<JobDetails> {
    const h = await headers();
    const host = h.get('x-forwarded-host') || h.get('host');
    const proto = h.get('x-forwarded-proto') || 'http';
    const base = `${proto}://${host}`;
    const res = await fetch(`${base}/api/jobs/${encodeURIComponent(id)}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to load job');
    return res.json();
}

export default async function JobPage({ params }: { params: { jobId: string } }) {
    const { jobId } = await params;
    if (!jobId || jobId === 'undefined') return notFound();
    const data = await getData(jobId);
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="w-full md:w-4/5 max-w-5xl mx-auto p-4">
                <section className="bg-white rounded-xl shadow-lg p-5 md:p-7">
                    <JobHeader
                        title={data.title}
                        company={data.company}
                        companyLink={data.companyLink}
                        companyLogo={data.companyLogo}
                        location={data.location}
                        listedAtText={data.listedAtText}
                        applicantsText={data.applicantsText}
                        compensation={data.compensation}
                        applyUrl={data.applyUrl}
                    />
                    <div className="mt-6">
                        <JobDescription html={data.descriptionHtml} text={data.descriptionText} />
                    </div>
                    <div className="mt-6">
                        <JobCriteria criteria={data.criteria} />
                    </div>
                </section>
            </div>
        </div>
    );
}
