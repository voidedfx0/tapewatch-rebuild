'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Blocks, ExternalLink, Search, ShieldCheck, SlidersHorizontal, X, LoaderCircle, RefreshCw } from 'lucide-react';

type Processor = { number: number; address: `0x${string}`; name: string };
type Registry = { chainId: number; blockNumber: string; factory: string; total: number; offset: number; hasMore: boolean; processors: Processor[] };
type Inspector = { chainId: number; blockNumber: string; address: string; isProcessor: boolean; name: string; hasCode: boolean; bytecodeBytes: number; explorerUrl: string };

export default function CircuitsPage() {
  const [processors, setProcessors] = useState<Processor[]>([]);
  const [total, setTotal] = useState<number | null>(null);
  const [blockNumber, setBlockNumber] = useState('');
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Processor | null>(null);
  const [inspector, setInspector] = useState<Inspector | null>(null);
  const [inspecting, setInspecting] = useState(false);
  const [inspectError, setInspectError] = useState('');

  const loadPage = useCallback(async (offset: number) => {
    const response = await fetch(`/api/xlayer/processors?offset=${offset}&limit=25`, { cache: 'no-store' });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || data.error || 'Registry request failed');
    const registry = data as Registry;
    setTotal(registry.total);
    setBlockNumber(registry.blockNumber);
    setHasMore(registry.hasMore);
    setProcessors(previous => offset === 0 ? registry.processors : [...previous, ...registry.processors]);
  }, []);

  useEffect(() => {
    loadPage(0).catch(error => setError(error instanceof Error ? error.message : 'Unable to connect to X Layer RPC')).finally(() => setLoading(false));
  }, [loadPage]);

  const loadMore = async () => {
    setLoadingMore(true);
    setError('');
    try { await loadPage(processors.length); }
    catch (error) { setError(error instanceof Error ? error.message : 'Unable to load more processors'); }
    finally { setLoadingMore(false); }
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return processors;
    return processors.filter(item => item.name.toLowerCase().includes(q) || item.address.toLowerCase().includes(q) || String(item.number).includes(q));
  }, [processors, query]);

  const openInspector = async (item: Processor) => {
    setSelected(item);
    setInspector(null);
    setInspectError('');
    setInspecting(true);
    try {
      const response = await fetch(`/api/xlayer/processors/${item.address}`, { cache: 'no-store' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || data.error || 'Inspector request failed');
      setInspector(data as Inspector);
    } catch (error) {
      setInspectError(error instanceof Error ? error.message : 'Unable to inspect processor');
    } finally { setInspecting(false); }
  };

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
        <p>Live processor directory read from the official TapeOut factory contract on X Layer. Browse in batches and inspect each contract.</p>
      </section>
      <section className="circuitstats">
        <article className="card"><div className="eyebrow">REGISTERED PROCESSORS</div><strong>{total === null ? '—' : total.toLocaleString()}</strong><small>{loading ? 'Reading factory registry…' : 'Live factory cpuCount()'}</small></article>
        <article className="card"><div className="eyebrow">NETWORK</div><strong>X Layer</strong><small>Chain ID 196 · Read only</small></article>
        <article className="card"><div className="eyebrow">LATEST BLOCK</div><strong>{blockNumber ? Number(blockNumber).toLocaleString() : '—'}</strong><small>Block at registry request</small></article>
      </section>
      <section className="directory">
        <div className="directoryhead"><div><div className="eyebrow">PROCESSOR DIRECTORY</div><h2>All processors</h2></div><span className="directorycount">{processors.length} loaded{total !== null ? ` / ${total}` : ''}</span></div>
        <label className="searchbox"><Search size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search loaded processors by name, number or address" /><SlidersHorizontal size={16}/></label>
        {loading && <div className="connectionnotice"><LoaderCircle className="spin" size={17}/><div><b>Connecting to X Layer</b><p>Reading the TapeOut factory and loading the first 25 processors.</p></div></div>}
        {error && <div className="errornotice"><b>Registry connection issue</b><p>{error}</p><button onClick={()=>{setLoading(true);setError('');loadPage(0).catch(e=>setError(e.message)).finally(()=>setLoading(false));}}><RefreshCw size={13}/> Retry</button></div>}
        {!loading && !error && <div className="connectionnotice"><span className="pulse"></span><div><b>Live registry connected</b><p>Factory: <code>0x1f09DAeFA827f02CBb40967cc91b259763760761</code> · Search covers processors currently loaded. Load more to extend the search.</p></div></div>}
        <div className="processorlist">
          {filtered.map(item=><button className="processorpreview" key={item.address} onClick={()=>openInspector(item)}>
            <div className="processorbadge"><Blocks size={17}/></div><div className="processorinfo"><span className="eyebrow">PROCESSOR #{item.number}</span><h3>{item.name}</h3><code>{item.address}</code></div><span className="previewaction">Inspect <ExternalLink size={14}/></span>
          </button>)}
        </div>
        {!loading && !error && filtered.length===0 && <div className="emptysearch">No matches in the processors loaded so far.</div>}
        {hasMore && !loading && !error && <button className="loadmore" onClick={loadMore} disabled={loadingMore}>{loadingMore ? <><LoaderCircle size={15} className="spin"/> Loading…</> : <>Load next 25 <span>({processors.length} of {total ?? '—'})</span></>}</button>}
        {!hasMore && total !== null && <div className="endnote">All {total} registered processors have been loaded.</div>}
      </section>
      {selected && <div className="modalback" onClick={()=>setSelected(null)}><section className="inspectormodal" onClick={e=>e.stopPropagation()}>
        <div className="modalhead"><div><div className="eyebrow">PROCESSOR INSPECTOR</div><h2>Processor #{selected.number}</h2></div><button className="closemodal" onClick={()=>setSelected(null)} aria-label="Close inspector"><X size={18}/></button></div>
        <div className="inspectname">{selected.name}</div><code className="inspectaddress">{selected.address}</code>
        {inspecting && <div className="inspectloading"><LoaderCircle size={17} className="spin"/> Reading contract details…</div>}
        {inspectError && <div className="errornotice"><p>{inspectError}</p></div>}
        {inspector && <div className="inspectgrid">
          <div><span>NETWORK</span><b>X Layer ({inspector.chainId})</b></div>
          <div><span>FACTORY MEMBERSHIP</span><b className={inspector.isProcessor?'good':'bad'}>{inspector.isProcessor?'Confirmed':'Not confirmed'}</b></div>
          <div><span>ON-CHAIN CODE</span><b>{inspector.hasCode?'Present':'Not found'}</b></div>
          <div><span>BYTECODE SIZE</span><b>{inspector.bytecodeBytes.toLocaleString()} bytes</b></div>
          <div><span>CHECKED AT BLOCK</span><b>{Number(inspector.blockNumber).toLocaleString()}</b></div>
        </div>}
        <div className="inspectdisclaimer"><ShieldCheck size={15}/> Read-only inspection. Code presence and factory membership are not a security audit or verification of safety.</div>
        <a className="explorerlink" href={`https://www.oklink.com/xlayer/address/${selected.address}`} target="_blank" rel="noreferrer">Open on X Layer Explorer <ExternalLink size={14}/></a>
      </section></div>}
      <footer className="footer"><span>TAPEWATCH / CIRCUIT EXPLORER</span><span>CHAIN DATA · READ ONLY</span></footer>
    </main>
  );
}
