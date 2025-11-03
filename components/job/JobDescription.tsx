"use client";

import React from 'react';

export default function JobDescription({ html, text }: { html?: string; text?: string }){
  if (html) {
    return (
      <div
        className="leading-7 text-gray-800 [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_li]:mb-1 [&_strong]:font-semibold [&_a]:text-blue-600 [&_a]:underline"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }
  return <p className="text-base text-gray-800 leading-7">{text || ''}</p>;
}


