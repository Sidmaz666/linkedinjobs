"use client";

import React from 'react';

type Props = {
  page: number;
  isPending: boolean;
  onPrev: () => void;
  onNext: () => void;
};

export default function Pagination({ page, isPending, onPrev, onNext }: Props){
  return (
    <div className="flex items-center gap-2">
      <button disabled={page<=1 || isPending} onClick={onPrev} className="h-9 px-3 rounded-md border border-gray-300 bg-white text-gray-800 disabled:opacity-50">Prev</button>
      <span className="text-sm text-gray-700">Page {page}</span>
      <button disabled={isPending} onClick={onNext} className="h-9 px-3 rounded-md border border-gray-300 bg-white text-gray-800">Next</button>
    </div>
  );
}


