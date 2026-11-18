import Link from 'next/link';
import { Activity, ArrowUpRight, Blocks, Radar, ShieldCheck, Wallet, ChevronRight } from 'lucide-react';

const metrics = [
  { label: 'NETWORK', value: 'X Layer', note: 'Chain ID 196', icon: Blocks },
  { label: 'PROCESSORS', value: '427', note: 'Previously verified registry count', icon: Radar },
  { label: 'WALLET INTEL', value: 'Next module', note: 'Read-only wallet analysis', icon: Wallet },
];

const modules = [
  { title: 'Circuit & processor explorer', detail: 'Browse processor contracts, inspect metadata and open explorer records.', href: '/circuits', icon: Blocks, state: 'BUILDING NOW' },
  { title: 'Wallet intelligence', detail: 'Review incoming and outgoing activity for an X Layer address.', href: '/wallet', icon: Wallet, state: 'NEXT' },
  { title: 'Network activity', detail: 'Follow recent on-chain movement and network signals.', href: '/activity', icon: Activity, state: 'PLANNED' },
  { title: 'Contract inspection', detail: 'Inspect contract details and on-chain code status.', href: '/contracts', icon: ShieldCheck, state: 'PLANNED' },
];

export default function Home() {
  return (
    <main className="shell">
      <header className="topbar">
        <Link href="/" className="brand"><div className="brandmark">⌁</div><span>TapeWatch</span></Link>
        <div className="network"><i className="dot" /> X LAYER · WORKSPACE</div>
      </header>
      <section className="hero">
        <div className="eyebrow">ON-CHAIN INTELLIGENCE / 001</div>
        <h1>See the signal.<br /><span>Track the chain.</span></h1>
        <p>A focused workspace for exploring X Layer processors, understanding wallet activity, and following on-chain movement.</p>
      </section>
      <section className="grid" aria-label="Workspace overview">
        {metrics.map(({label,value,note,icon:Icon}) => <article className="card" key={label}>
          <div className="cardhead"><span className="eyebrow">{label}</span><Icon size={17} /></div>
          <strong>{value}</strong><small>{note}</small>
        </article>)}
      </section>
      <section className="section">
        <div className="sectionhead"><div><div className="eyebrow">MONITORING</div><h2>Workspace modules</h2></div><span className="status">● FOUNDATION ONLINE</span></div>
        <div className="modulegrid">
          {modules.map(({title,detail,href,icon:Icon,state}) => <Link href={href} className="modulecard" key={title}>
            <div className="moduleicon"><Icon size={18}/></div>
            <div className="modulecopy"><span className="eyebrow">{state}</span><h3>{title}</h3><p>{detail}</p></div>
            <ChevronRight size={17} className="modulearrow"/>
          </Link>)}
        </div>
        <div className="notice"><ArrowUpRight size={13} style={{display:'inline',verticalAlign:'-2px',marginRight:7}}/>Read-only by design. Existing Supabase data and private OKX credentials will be preserved and connected server-side.</div>
      </section>
      <footer className="footer"><span>TAPEWATCH / X LAYER INTELLIGENCE</span><span>READ-ONLY BY DESIGN</span></footer>
    </main>
  );
}
