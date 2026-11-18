import { Activity, ArrowUpRight, Blocks, Radar, ShieldCheck, Wallet } from 'lucide-react';

const metrics = [
  { label: 'NETWORK', value: 'X Layer', note: 'Chain workspace', icon: Blocks },
  { label: 'PROCESSORS', value: '—', note: 'Live index to be connected', icon: Radar },
  { label: 'WALLET INTEL', value: 'Ready', note: 'Read-only analysis module', icon: Wallet },
];

export default function Home() {
  return (
    <main className="shell">
      <header className="topbar">
        <div className="brand"><div className="brandmark">⌁</div><span>TapeWatch</span></div>
        <div className="network"><i className="dot" /> X LAYER · WORKSPACE</div>
      </header>
      <section className="hero">
        <div className="eyebrow">ON-CHAIN INTELLIGENCE / 001</div>
        <h1>See the signal.<br /><span>Track the chain.</span></h1>
        <p>A focused workspace for exploring X Layer processors, understanding wallet activity, and following on-chain movement. The foundation is live; data connections will be added and verified in the next stages.</p>
      </section>
      <section className="grid" aria-label="Workspace overview">
        {metrics.map(({label,value,note,icon:Icon}) => <article className="card" key={label}>
          <div className="cardhead"><span className="eyebrow">{label}</span><Icon size={17} /></div>
          <strong>{value}</strong><small>{note}</small>
        </article>)}
      </section>
      <section className="section">
        <div className="sectionhead"><div><div className="eyebrow">MONITORING</div><h2>Workspace modules</h2></div><span className="status">● FOUNDATION ONLINE</span></div>
        <div className="feed">
          <div className="feedrow"><span><Activity size={14} style={{display:'inline',verticalAlign:'-2px',marginRight:9}}/> Network activity monitor</span><span>CONNECTING NEXT</span></div>
          <div className="feedrow"><span><Blocks size={14} style={{display:'inline',verticalAlign:'-2px',marginRight:9}}/> Circuit & processor explorer</span><span>MODULE PLANNED</span></div>
          <div className="feedrow"><span><Wallet size={14} style={{display:'inline',verticalAlign:'-2px',marginRight:9}}/> Wallet intelligence</span><span>MODULE PLANNED</span></div>
          <div className="feedrow"><span><ShieldCheck size={14} style={{display:'inline',verticalAlign:'-2px',marginRight:9}}/> Contract inspection</span><span>MODULE PLANNED</span></div>
        </div>
        <div className="notice"><ArrowUpRight size={13} style={{display:'inline',verticalAlign:'-2px',marginRight:7}}/>This is the clean project foundation. Live chain data, Supabase, and OKX credentials are deliberately not connected yet; each will be configured and tested separately.</div>
      </section>
      <footer className="footer"><span>TAPEWATCH / X LAYER INTELLIGENCE</span><span>READ-ONLY BY DESIGN · EARLY BUILD</span></footer>
    </main>
  );
}
