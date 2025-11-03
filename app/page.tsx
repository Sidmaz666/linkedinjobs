import type { Metadata } from 'next';
import JobSearchApp from '@/components/JobSearchApp';

export const metadata: Metadata = { title: 'Home' };

export default function Home(){
    return (
        <div className="min-h-screen">
            <div className="max-w-7xl mx-auto p-4 ">
                <JobSearchApp />
            </div>
        </div>
    );
}


