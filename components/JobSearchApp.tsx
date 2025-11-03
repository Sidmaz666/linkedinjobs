"use client";

import { useEffect, useMemo, useState, useTransition } from 'react';
import SearchForm from './SearchForm';
import ResultsList from './ResultsList';
import Pagination from './Pagination';

type Job = {
    id?: string;
    title?: string;
    company?: string;
    companyLink?: string;
    companyLogo?: string;
    location?: string;
    link?: string;
    listedAtText?: string;
    activelyHiring?: boolean;
    promoted?: boolean;
};

function SearchIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className={(props.className || "") + " inline-block"}>
            <circle cx={11} cy={11} r={7} strokeWidth={1.5} />
            <path d="M20 20l-3.5-3.5" strokeWidth={1.5} strokeLinecap="round" />
        </svg>
    );
}
function CalendarIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className={(props.className || "") + " inline-block"}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 2v2M8 2v2M3 8h18M4 6h16a1 1 0 0 1 1 1v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a1 1 0 0 1 1-1z" />
        </svg>
    );
}
function MapPinIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className={(props.className || "") + " inline-block"}>
            <path d="M12 21s-6-4.35-6-9a6 6 0 1112 0c0 4.65-6 9-6 9z" strokeWidth={1.5} />
            <circle cx={12} cy={12} r={2} strokeWidth={1.5} />
        </svg>
    );
}

function fetchJSON<T>(url: string): Promise<T> {
    return fetch(url).then(r => {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
    });
}
function paramsToQuery(params: Record<string, string | number | undefined>) {
    const sp = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
        if (v === undefined || v === null || v === '') return;
        sp.set(k, String(v));
    });
    return sp.toString();
}

export default function JobSearchApp() {
    const [keywords, setKeywords] = useState('Full Stack Developer');
    const [location, setLocation] = useState('United States');
    const [date, setDate] = useState('past-24');
    const [workplace, setWorkplace] = useState('');
    const [jobType, setJobType] = useState('');
    const [experience, setExperience] = useState('');
    const [page, setPage] = useState(1);

    const [jobs, setJobs] = useState<Job[] | null>(null);
    const [error, setError] = useState('');
    const [isPending, startTransition] = useTransition();

    const queryParams = useMemo(() => {
        const params: Record<string, string | number | undefined> = { keywords, location, date, page };
        if (workplace) params.f_WT = workplace;
        if (jobType) params.f_JT = jobType;
        if (experience) params.f_E = experience;
        return params;
    }, [keywords, location, date, workplace, jobType, experience, page]);

    function runSearch() {
        setError('');
        startTransition(() => {
            fetchJSON<Job[]>('/api/jobs?' + paramsToQuery(queryParams))
                .then(data => { setJobs(Array.isArray(data) ? data : []); })
                .catch(e => setError(String(e.message || e)));
        });
    }

    useEffect(() => { runSearch(); }, []);

    return (
        <>
            <SearchForm
                keywords={keywords}
                location={location}
                date={date}
                workplace={workplace}
                jobType={jobType}
                experience={experience}
                setKeywords={setKeywords}
                setLocation={setLocation}
                setDate={setDate}
                setWorkplace={setWorkplace}
                setJobType={setJobType}
                setExperience={setExperience}
                onSearch={runSearch}
                setPage={setPage}
            />

            <section className="bg-white rounded-xl shadow-lg p-4 md:p-6 mt-6">
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-semibold text-gray-900">Results</h2>
                    <Pagination
                        page={page}
                        isPending={isPending}
                        onPrev={() => { setPage(p => Math.max(1, p - 1)); runSearch(); }}
                        onNext={() => { setPage(p => p + 1); runSearch(); }}
                    />
                </div>

                {(isPending || jobs === null) && (
                    <div className="grid grid-cols-1 gap-3">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="p-3 border border-gray-200 rounded-md">
                                <div className="flex gap-3">
                                    <div className="h-14 w-14 bg-gray-200 animate-pulse rounded-md"></div>
                                    <div className="flex-1">
                                        <div className="h-5 w-2/3 bg-gray-200 animate-pulse mb-2 rounded"></div>
                                        <div className="h-4 w-1/3 bg-gray-200 animate-pulse mb-1 rounded"></div>
                                        <div className="h-4 w-1/2 bg-gray-200 animate-pulse rounded"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!isPending && jobs && jobs.length === 0 && <p className="text-sm text-gray-600">No results</p>}

                {!isPending && jobs && jobs.length > 0 && (
                    <ResultsList jobs={jobs} />
                )}
                <div className="flex items-center justify-end my-4">
                <Pagination
                    page={page}
                    isPending={isPending}
                    onPrev={() => { setPage(p => Math.max(1, p - 1)); runSearch(); }}
                    onNext={() => { setPage(p => p + 1); runSearch(); }}
                />
                </div>

            </section>
        </>
    );
}


