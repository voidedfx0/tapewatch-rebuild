'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { ArrowLeft, Blocks, ExternalLink, Search, ShieldCheck, SlidersHorizontal } from 'lucide-react';

const knownExample = {
  number: 8,
  name: 'Behemoth',
  address: '0xfd32fbaeef90726f00aafdf2d2cf3d9c6fbd6b8d',
};

export default function CircuitsPage() {
  const [query, setQuery] = useState('');
  const [showExample, setShowExample] = useState(false);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return String(knownExample.number).includes(q) || knownExample.name.toLowerCase().includes(q) || knownExample.address.includes(q);
  }, [query]);

  return (
    <main className="shell">
      <header className="topbar">
        <Link href="/" className="brand"><div className="brandmark">⌁</div><span>TapeWatch</span></Link>
        <div className="network"><i className="dot" /> X LAYER · CIRCUITS</div>
      </header>
      <div className="crumb"><Link href="/"><ArrowLeft size={14}/> Workspace</Link><span>/</span><span>Circuits</span></div>
      <section className="pageintro">
        <div className="eyebrow">X LAYER / CONTRACT DIRECTORY</div>
        <h1>Circuits <span>& processors</span></h1>
        <p>Explore detected processor contracts, inspect their on-chain details, and open verified explorer records.</p>
      </section>
      <section className="circuitstats">
        <article className="card"><div className="eyebrow">LAST VERIFIED REGISTRY</div><strong>427</strong><small>Processors detected in the previous live registry scan</small></article>
        <article className="card"><div className="eyebrow">NETWORK</div><strong>X Layer</strong><small>Chain ID 196</small></article>
        <article className="card"><div className="eyebrow">ACCESS MODE</div><strong>Read only</strong><small>No wallet connection required</small></article>
      </section>
      <section className="directory">
        <div className="directoryhead"><div><div className="eyebrow">PROCESSOR DIRECTORY</div><h2>All processors</h2></div><span className="directorycount">427 previously detected</span></div>
        <label className="searchbox"><Search size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search by processor name, number or address" /><SlidersHorizontal size={16}/></label>
        <div className="connectionnotice"><span className="pulse"></span><div><b>Registry reconnection in progress</b><p>The previous build verified 427 processors and 25-item pagination. I’m restoring that live data connection next; this rebuild will not display fabricated registry results.</p></div></div>
        {filtered && <button className="processorpreview" onClick={()=>setShowExample(!showExample)}>
          <div className="processorbadge"><Blocks size={17}/></div><div className="processorinfo"><span className="eyebrow">KNOWN PREVIOUS INSPECTION · PROCESSOR #8</span><h3>Behemoth</h3><code>{knownExample.address}</code></div><span className="previewaction">{showExample ? 'Hide details' : 'Reference record'} <ExternalLink size={14}/></span>
        </button>}
        {showExample && <div className="detailnote"><ShieldCheck size={16}/> This is a previously inspected reference record, not a freshly fetched live result. Live registry verification will be restored with the data connector.</div>}
        {!filtered && <div className="emptysearch">No matching reference record. Full-directory search returns when the live registry is reconnected.</div>}
      </section>
      <footer className="footer"><span>TAPEWATCH / CIRCUIT EXPLORER</span><span>CHAIN DATA · READ ONLY</span></footer>
    </main>
  );
}
