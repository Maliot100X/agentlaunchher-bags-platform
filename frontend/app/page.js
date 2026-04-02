'use client';

import { useEffect, useMemo, useState } from 'react';

const tabs = [
  'Overview',
  'Launch Studio',
  'Registry',
  'Skills',
  'Signals',
  'Wallet Intel',
  'Analytics',
  'Marketplace',
  'Assistant',
];

function pretty(obj) {
  return JSON.stringify(obj, null, 2);
}

export default function HomePage() {
  const apiBase = process.env.NEXT_PUBLIC_API_BASE || '';

  const [active, setActive] = useState('Overview');
  const [health, setHealth] = useState(null);
  const [scan, setScan] = useState(null);
  const [agents, setAgents] = useState([]);
  const [skills, setSkills] = useState([]);
  const [busy, setBusy] = useState(false);

  const [launchForm, setLaunchForm] = useState({
    name: 'AgentLaunchHer',
    symbol: 'ALH',
    wallet: '',
    description: 'Bags-native launch preview from dashboard',
  });
  const [launchPreview, setLaunchPreview] = useState(null);

  async function load() {
    setBusy(true);
    try {
      const [h, s, a, sk] = await Promise.all([
        fetch(`${apiBase}/health`).then((r) => r.json()),
        fetch(`${apiBase}/scan`).then((r) => r.json()),
        fetch(`${apiBase}/agents`).then((r) => r.json()),
        fetch(`${apiBase}/skills`).then((r) => r.json()),
      ]);
      setHealth(h);
      setScan(s);
      setAgents(a.runtime_agents || []);
      setSkills(sk.skills || []);
    } catch {
      setHealth({ status: 'offline' });
      setScan({ coins: [] });
      setAgents([]);
      setSkills([]);
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    load();
    const id = setInterval(load, 9000);
    return () => clearInterval(id);
  }, []);

  const metrics = useMemo(() => {
    const c = scan?.coins || [];
    return {
      health: health?.status || 'unknown',
      coins: c.length,
      pools: scan?.pools_count || 0,
      agents: agents.length,
      skills: skills.length,
    };
  }, [health, scan, agents, skills]);

  async function runLaunchPreview(e) {
    e.preventDefault();
    const r = await fetch(`${apiBase}/launch/preview`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(launchForm),
    });
    setLaunchPreview(await r.json());
  }

  return (
    <main className="ui">
      <div className="bg-layer" aria-hidden="true">
        <span className="noise" />
        <span className="mesh" />
        <span className="orb a" />
        <span className="orb b" />
      </div>

      <aside className="side">
        <h1>AgentLaunchHer</h1>
        <p>Bags-native Autonomous Agent OS</p>
        <nav>
          {tabs.map((t) => (
            <button key={t} onClick={() => setActive(t)} className={active === t ? 'active' : ''}>
              {t}
            </button>
          ))}
        </nav>
      </aside>

      <section className="main">
        <header className="top">
          <div>
            <h2>{active}</h2>
            <p>Runtime panel synced with health, scan, agents, and skill endpoints.</p>
          </div>
          <button onClick={load}>{busy ? 'Refreshing...' : 'Refresh'}</button>
        </header>

        <section className="kpis">
          <article><span>Status</span><strong>{metrics.health}</strong></article>
          <article><span>Live Coins</span><strong>{metrics.coins}</strong></article>
          <article><span>Pools</span><strong>{metrics.pools}</strong></article>
          <article><span>Agents</span><strong>{metrics.agents}</strong></article>
          <article><span>Skills</span><strong>{metrics.skills}</strong></article>
        </section>

        <section className="grid">
          <article className="card wide">
            <h3>Launch Studio</h3>
            <form onSubmit={runLaunchPreview} className="form">
              <input value={launchForm.name} onChange={(e) => setLaunchForm({ ...launchForm, name: e.target.value })} placeholder="Token Name" />
              <input value={launchForm.symbol} onChange={(e) => setLaunchForm({ ...launchForm, symbol: e.target.value })} placeholder="Symbol" />
              <input value={launchForm.wallet} onChange={(e) => setLaunchForm({ ...launchForm, wallet: e.target.value })} placeholder="Wallet" />
              <input value={launchForm.description} onChange={(e) => setLaunchForm({ ...launchForm, description: e.target.value })} placeholder="Description" />
              <button type="submit">Preview Launch</button>
            </form>
            <pre>{pretty(launchPreview || { hint: 'Submit launch preview to generate next-step plan.' })}</pre>
          </article>

          <article className="card">
            <h3>Registry</h3>
            <div className="list">
              {(agents.length ? agents : [{ name: 'No agents yet', agent_id: '-', running: false }]).map((a, i) => (
                <div key={i} className="row">
                  <b>{a.name}</b>
                  <span>{a.agent_id}</span>
                  <em>{a.running ? 'RUNNING' : 'STOPPED'}</em>
                </div>
              ))}
            </div>
          </article>

          <article className="card">
            <h3>Skill Catalog</h3>
            <div className="list">
              {(skills.length ? skills : [{ id: 'No skills loaded yet' }]).slice(0, 20).map((s, i) => (
                <div key={i} className="row">
                  <b>{s.id}</b>
                  <span>{s.title || ''}</span>
                </div>
              ))}
            </div>
          </article>

          <article className="card wide">
            <h3>Signal Feed (Live Bags Coins)</h3>
            <table>
              <thead>
                <tr>
                  <th>Symbol</th>
                  <th>Name</th>
                  <th>Status</th>
                  <th>Market Cap</th>
                </tr>
              </thead>
              <tbody>
                {(scan?.coins || []).slice(0, 12).map((c, i) => (
                  <tr key={i}>
                    <td>{c.symbol}</td>
                    <td>{c.name}</td>
                    <td>{c.status}</td>
                    <td>{c.market_cap}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </article>

          <article className="card wide">
            <h3>System Console</h3>
            <pre>{pretty({ health, scanSummary: { coins: metrics.coins, pools: metrics.pools }, active })}</pre>
          </article>
        </section>
      </section>
    </main>
  );
}
