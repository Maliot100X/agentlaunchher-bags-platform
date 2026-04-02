'use client';

import { useEffect, useState } from 'react';
import Panel from '../components/Panel';

const tabs = [
  'Overview',
  'Registry',
  'Skills',
  'Launch',
  'Signals',
  'Portfolio',
  'Analytics',
  'Marketplace',
  'Assistant',
];

export default function HomePage() {
  const [active, setActive] = useState('Overview');
  const [health, setHealth] = useState(null);
  const [agents, setAgents] = useState([]);

  async function load() {
    try {
      const [h, a] = await Promise.all([
        fetch('http://127.0.0.1:3001/health').then((r) => r.json()),
        fetch('http://127.0.0.1:3001/agents').then((r) => r.json()),
      ]);
      setHealth(h);
      setAgents(a.runtime_agents || []);
    } catch {
      setHealth({ status: 'offline' });
      setAgents([]);
    }
  }

  useEffect(() => {
    load();
    const id = setInterval(load, 7000);
    return () => clearInterval(id);
  }, []);

  return (
    <main className="shell">
      <div className="bg3d" aria-hidden="true">
        <span className="orb orbA" />
        <span className="orb orbB" />
        <span className="grid" />
      </div>

      <header className="topbar">
        <div>
          <h1>AgentLaunchHer</h1>
          <p>Bags-native autonomous agent command center</p>
        </div>
        <button onClick={load}>Refresh</button>
      </header>

      <nav className="tabs">
        {tabs.map((tab) => (
          <button key={tab} className={active === tab ? 'active' : ''} onClick={() => setActive(tab)}>
            {tab}
          </button>
        ))}
      </nav>

      <section className="gridLayout">
        <Panel title="System Health">
          <pre>{JSON.stringify(health, null, 2)}</pre>
        </Panel>

        <Panel title="Runtime Agents">
          {agents.length === 0 ? <p>No agents registered</p> : null}
          {agents.map((a) => (
            <article key={a.agent_id} className="agentRow">
              <strong>{a.name}</strong>
              <span>{a.agent_id}</span>
              <span>{a.running ? 'RUNNING' : 'STOPPED'}</span>
            </article>
          ))}
        </Panel>

        <Panel title={`Active Tab: ${active}`}>
          <p>This tab shell is live and clickable. Module content for {active} is wired for progressive expansion.</p>
        </Panel>
      </section>
    </main>
  );
}
