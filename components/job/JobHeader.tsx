"use client";

import React from 'react';
import LazyLogo from '@/components/LazyLogo';

export type JobHeaderProps = {
  title?: string;
  company?: string;
  companyLink?: string;
  companyLogo?: string;
  location?: string;
  listedAtText?: string;
  applicantsText?: string;
  compensation?: string;
  applyUrl?: string;
};

export default function JobHeader({ title, company, companyLink, companyLogo, location, listedAtText, applicantsText, compensation, applyUrl }: JobHeaderProps){
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        {companyLogo ? <LazyLogo srcUrl={companyLogo} /> : null}
        <div className="flex-1 min-w-0">
          <h3 className="text-2xl font-semibold text-gray-900 wrap-break-word">{title || ''}</h3>
          <p className="text-base text-gray-800 wrap-break-word">
            {companyLink ? (
              <a href={companyLink} target="_blank" rel="noreferrer" className="underline text-blue-600">{company || ''}</a>
            ) : (company || '')}
            {location ? ' • '+location : ''}
          </p>
          <div className="text-sm text-gray-600 flex items-center gap-3 flex-wrap">
            {listedAtText ? <span>{listedAtText}</span> : null}
            {applicantsText ? <span>{applicantsText}</span> : null}
            {compensation ? <span>{compensation}</span> : null}
          </div>
        </div>
        {applyUrl ? <a href={applyUrl} target="_blank" rel="noreferrer" className="shrink-0 h-10 px-4 rounded-md bg-[#0A66C2] text-white inline-flex items-center justify-center hover:bg-[#094c91]">Apply</a> : null}
      </div>
    </div>
  );
}


