"use client";

import React from 'react';
import Link from 'next/link';
import LazyLogo from './LazyLogo';

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

export default function ResultsList({ jobs }: { jobs: Job[] }){
  return (
    <ul className="grid grid-cols-1 gap-3">
      {jobs.map(job => (
        <li key={job.id || job.link} className="p-4 border border-gray-200 rounded-lg hover:shadow-sm">
          {job.id ? (
            <Link href={`/${encodeURIComponent(job.id)}`} className="block">
              <div className="flex gap-3">
                <LazyLogo srcUrl={job.companyLogo || ''} />
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{job.title || 'Untitled'}</h3>
                  <p className="text-sm text-gray-800">{job.company || ''}</p>
                  <p className="text-sm text-gray-700">{job.location || ''}</p>
                  <div className="text-xs text-gray-600 mt-1 flex items-center gap-2">
                    {job.listedAtText ? <span>{job.listedAtText}</span> : null}
                    {job.activelyHiring ? <span className="px-2 py-0.5 rounded bg-green-50 text-green-700 border border-green-200">Actively Hiring</span> : null}
                    {job.promoted ? <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">Promoted</span> : null}
                  </div>
                </div>
              </div>
            </Link>
          ) : (
            <a href={job.link || '#'} target={job.link ? '_blank' : undefined} rel={job.link ? 'noreferrer' : undefined} className="block">
              <div className="flex gap-3">
                <LazyLogo srcUrl={job.companyLogo || ''} />
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{job.title || 'Untitled'}</h3>
                  <p className="text-sm text-gray-800">{job.company || ''}</p>
                  <p className="text-sm text-gray-700">{job.location || ''}</p>
                  <div className="text-xs text-gray-600 mt-1 flex items-center gap-2">
                    {job.listedAtText ? <span>{job.listedAtText}</span> : null}
                    {job.activelyHiring ? <span className="px-2 py-0.5 rounded bg-green-50 text-green-700 border border-green-200">Actively Hiring</span> : null}
                    {job.promoted ? <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">Promoted</span> : null}
                  </div>
                </div>
              </div>
            </a>
          )}
        </li>
      ))}
    </ul>
  );
}


