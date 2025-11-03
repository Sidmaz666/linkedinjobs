"use client";

import React, { useEffect, useRef, useState } from 'react';

export default function LazyLogo({ srcUrl }: { srcUrl: string }){
  const ref = useRef<HTMLDivElement | null>(null);
  const [src, setSrc] = useState('');
  useEffect(()=>{
    if (!srcUrl) return;
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver((entries)=>{
      entries.forEach(entry => {
        if (entry.isIntersecting){
          fetch('/api/jobs/media?url='+encodeURIComponent(srcUrl))
            .then(r=>r.json())
            .then(d=>setSrc(d.dataUrl || ''))
            .catch(()=>{});
          obs.disconnect();
        }
      });
    }, { rootMargin: '100px' });
    obs.observe(el);
    return ()=>obs.disconnect();
  }, [srcUrl]);
  return (
    <div ref={ref} className="h-14 w-14 rounded-md border border-gray-200 bg-white overflow-hidden">
      {src ? <img src={src} alt="" className="h-full w-full object-cover" loading="lazy" /> : <div className="h-full w-full bg-gray-200 animate-pulse" />}
    </div>
  );
}


