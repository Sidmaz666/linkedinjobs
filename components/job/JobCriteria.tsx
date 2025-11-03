"use client";

import React from 'react';

export default function JobCriteria({ criteria }: { criteria?: Array<{ label?: string; value?: string }> }){
  if (!Array.isArray(criteria) || criteria.length === 0) return null;
  return (
    <div>
      <h4 className="text-lg font-semibold text-gray-900 mb-2">Role details</h4>
      <ul className="grid sm:grid-cols-2 gap-3">
        {criteria.map((c, i) => (
          <li key={i} className="p-3 border rounded-md bg-white">
            <div className="text-sm text-gray-500">{c.label || ''}</div>
            <div className="text-sm text-gray-800">{c.value || ''}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}


