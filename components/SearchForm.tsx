"use client";

import React from 'react';
import { Search, MapPin, Calendar } from 'lucide-react';

type Props = {
  keywords: string;
  location: string;
  date: string;
  workplace: string;
  jobType: string;
  experience: string;
  setKeywords: (v: string) => void;
  setLocation: (v: string) => void;
  setDate: (v: string) => void;
  setWorkplace: (v: string) => void;
  setJobType: (v: string) => void;
  setExperience: (v: string) => void;
  onSearch: () => void;
  setPage: (updater: number | ((n: number)=>number)) => void;
};

export default function SearchForm(props: Props){
  const { keywords, location, date, workplace, jobType, experience,
    setKeywords, setLocation, setDate, setWorkplace, setJobType, setExperience,
    onSearch, setPage } = props;

  return (
    <section className="bg-white rounded-xl shadow-lg p-4 md:p-6 mb-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        <div className="lg:col-span-4">
          <label className="block text-sm font-medium text-gray-900 mb-1">Keywords</label>
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            <input value={keywords} onChange={e=>setKeywords(e.target.value)} placeholder="Full Stack Developer" className="pl-9 w-full border border-gray-300 rounded-md h-11 px-3 outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-400 bg-white" />
          </div>
        </div>
        <div className="lg:col-span-4">
          <label className="block text-sm font-medium text-gray-900 mb-1">Location</label>
          <div className="relative">
            <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            <input value={location} onChange={e=>setLocation(e.target.value)} placeholder="United States" className="pl-9 w-full border border-gray-300 rounded-md h-11 px-3 outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-400 bg-white" />
          </div>
        </div>
        <div className="lg:col-span-4">
          <label className="block text-sm font-medium text-gray-900 mb-1">Date</label>
          <div className="relative">
            <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            <select value={date} onChange={e=>{ setPage(1); setDate(e.target.value); }} className="pl-9 w-full border border-gray-300 rounded-md h-11 px-3 outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white">
              <option value="past-24">Past 24 hours</option>
              <option value="past-week">Past week</option>
              <option value="past-mon">Past month</option>
              <option value="anytime">Any time</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 mt-3">
        <div className="lg:col-span-4">
          <label className="block text-sm font-medium text-gray-900 mb-1">Workplace (f_WT)</label>
          <select value={workplace} onChange={e=>setWorkplace(e.target.value)} className="w-full border border-gray-300 rounded-md h-11 px-3 outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white">
            <option value="">Any</option>
            <option value="1">On-site</option>
            <option value="2">Remote</option>
            <option value="3">Hybrid</option>
          </select>
        </div>
        <div className="lg:col-span-4">
          <label className="block text-sm font-medium text-gray-900 mb-1">Job Type (f_JT)</label>
          <select value={jobType} onChange={e=>setJobType(e.target.value)} className="w-full border border-gray-300 rounded-md h-11 px-3 outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white">
            <option value="">Any</option>
            <option value="F">Full-time</option>
            <option value="P">Part-time</option>
            <option value="I">Internship</option>
          </select>
        </div>
        <div className="lg:col-span-4">
          <label className="block text-sm font-medium text-gray-900 mb-1">Experience (f_E)</label>
          <select value={experience} onChange={e=>setExperience(e.target.value)} className="w-full border border-gray-300 rounded-md h-11 px-3 outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white">
            <option value="">Any</option>
            <option value="2">Entry level</option>
            <option value="3">Associate</option>
            <option value="4">Mid-Senior</option>
            <option value="5">Director</option>
            <option value="6">Executive</option>
          </select>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-center">
        <button onClick={()=>{ setPage(1); onSearch(); }} className="bg-[#0A66C2] text-white h-11 px-6 rounded-md hover:bg-[#094c91] shadow-sm">Search</button>
      </div>
    </section>
  );
}


