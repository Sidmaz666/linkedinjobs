import Link from 'next/link';

export const metadata = {
    title: 'API Documentation • LinkedIn Jobs Finder',
};

export default function DocsPage() {
    return (
        <main className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-semibold tracking-tight">API Documentation</h1>
            <p className="mt-2 text-sm text-gray-600">Base URL: <code>/api</code></p>

            <section className="mt-8 space-y-6">
                <div>
                    <h2 className="text-2xl font-semibold">Search Jobs</h2>
                    <p className="mt-2 text-gray-700">GET <code>/api/jobs</code></p>
                    <p className="mt-2 text-gray-700">Query params:</p>
                    <ul className="list-disc pl-5 text-gray-700">
                        <li><b>keywords</b>: string</li>
                        <li><b>location</b>: string</li>
                        <li><b>date</b>: <code>past-24</code> | <code>past-week</code> | <code>past-mon</code> | <code>anytime</code></li>
                        <li><b>f_WT</b>: <code>1</code>|<code>2</code>|<code>3</code> (on-site, hybrid, remote)</li>
                        <li><b>f_JT</b>: <code>F</code>|<code>P</code>|<code>I</code> (full-time, part-time, internship)</li>
                        <li><b>f_E</b>: <code>2..6</code> (experience levels)</li>
                        <li><b>page</b>: number (1-based)</li>
                    </ul>
                    <div className="mt-3">
                        <p className="font-medium">Example</p>
                        <pre className="mt-2 overflow-x-auto rounded bg-gray-900 text-gray-100 p-4 text-sm">
{`GET /api/jobs?keywords=frontend&location=Remote&date=past-week&page=1`}
                        </pre>
                        <p className="mt-3 font-medium">fetch example</p>
                        <pre className="mt-2 overflow-x-auto rounded bg-gray-900 text-gray-100 p-4 text-sm">
{`fetch('/api/jobs?keywords=frontend&location=Remote&date=past-week&page=1')
  .then(r => r.json())
  .then(data => console.log(data))`}
                        </pre>
                    </div>
                </div>

                <div>
                    <h2 className="text-2xl font-semibold">Job Details</h2>
                    <p className="mt-2 text-gray-700">GET <code>/api/jobs/[jobId]</code></p>
                    <div className="mt-3">
                        <p className="font-medium">Example</p>
                        <pre className="mt-2 overflow-x-auto rounded bg-gray-900 text-gray-100 p-4 text-sm">
{`GET /api/jobs/1234567890`}
                        </pre>
                        <p className="mt-3 font-medium">fetch example</p>
                        <pre className="mt-2 overflow-x-auto rounded bg-gray-900 text-gray-100 p-4 text-sm">
{`fetch('/api/jobs/1234567890')
  .then(r => r.json())
  .then(job => console.log(job))`}
                        </pre>
                    </div>
                </div>

                <div>
                    <h2 className="text-2xl font-semibold">Media Proxy</h2>
                    <p className="mt-2 text-gray-700">GET <code>/api/jobs/media?url=&lt;imageUrl&gt;</code></p>
                    <p className="mt-2 text-gray-700">Returns a base64 data URL for reliable image rendering.</p>
                    <div className="mt-3">
                        <p className="font-medium">Example</p>
                        <pre className="mt-2 overflow-x-auto rounded bg-gray-900 text-gray-100 p-4 text-sm">
{`GET /api/jobs/media?url=https%3A%2F%2Fexample.com%2Flogo.png`}
                        </pre>
                    </div>
                </div>

                <hr className="my-6" />

                <div>
                    <h3 className="text-xl font-semibold">Notes</h3>
                    <ul className="list-disc pl-5 text-gray-700 mt-2">
                        <li>All endpoints return JSON unless otherwise noted.</li>
                        <li>Unauthenticated, rate-limited by platform/network conditions.</li>
                        <li>For in-app usage, see components like <code>JobSearchApp</code> and <code>app/[jobId]/page.tsx</code>.</li>
                    </ul>
                    <p className="mt-3 text-gray-700">Back to <Link href="/" className="underline">Home</Link></p>
                </div>
            </section>
        </main>
    );
}


