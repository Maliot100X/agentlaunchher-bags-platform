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

function Card({ title, wide = false, children }) {
  return (
    <article className={`card${wide ? ' wide' : ''}`}>
      <h3>{title}</h3>
      {children}
    </article>
  );
}

export default function HomePage() {
  const apiBase = (process.env.NEXT_PUBLIC_API_BASE || '').replace(/\/$/, '');

  const [active, setActive] = useState('Overview');
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');

  const [health, setHealth] = useState(null);
  const [scan, setScan] = useState(null);
  const [agents, setAgents] = useState([]);
  const [skills, setSkills] = useState([]);

  const [verifyForm, setVerifyForm] = useState({ requester: '', code: '', twitter_url: '' });
  const [registerForm, setRegisterForm] = useState({
    owner_handle: '',
    name: '',
    description: '',
    image_url: '',
    skills_csv: 'market_scanner',
  });
  const [agentActionId, setAgentActionId] = useState('');

  const [launchForm, setLaunchForm] = useState({
    name: 'AgentLaunchHer',
    symbol: 'ALH',
    wallet: '',
    description: 'Bags-native launch preview from dashboard',
  });
  const [launchPreview, setLaunchPreview] = useState(null);

  const [wallet, setWallet] = useState('');
  const [walletScan, setWalletScan] = useState(null);
  const [portfolio, setPortfolio] = useState(null);
  const [positions, setPositions] = useState(null);

  const [askInput, setAskInput] = useState('Give me a Bags launch readiness check.');
  const [askOutput, setAskOutput] = useState(null);

  async function api(path, options) {
    const url = `${apiBase}${path}`;
    const response = await fetch(url, options);
    const body = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(body?.detail || `Request failed (${response.status})`);
    }
    return body;
  }

  async function load() {
    setBusy(true);
    try {
      const [h, s, a, sk] = await Promise.all([
        api('/health'),
        api('/scan'),
        api('/agents'),
        api('/skills'),
      ]);
      setHealth(h);
      setScan(s);
      setAgents(a.runtime_agents || []);
      setSkills(sk.skills || []);
      setNotice('Connected and synced.');
    } catch (err) {
      setHealth({ status: 'offline' });
      setScan({ coins: [] });
      setAgents([]);
      setSkills([]);
      setNotice(`API offline: ${err.message}`);
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    load();
    const id = setInterval(load, 12000);
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
    try {
      const data = await api('/launch/preview', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(launchForm),
      });
      setLaunchPreview(data);
      setNotice('Launch preview generated.');
    } catch (err) {
      setNotice(err.message);
    }
  }

  async function requestCode(e) {
    e.preventDefault();
    try {
      const out = await api('/registry/request-code', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ requester: verifyForm.requester }),
      });
      setVerifyForm((v) => ({ ...v, code: out.code }));
      setNotice('Verification code generated. Post it publicly, then verify.');
    } catch (err) {
      setNotice(err.message);
    }
  }

  async function verifyCode(e) {
    e.preventDefault();
    try {
      await api('/registry/verify', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ code: verifyForm.code, twitter_url: verifyForm.twitter_url }),
      });
      setNotice('Verification successful. You can register the agent now.');
    } catch (err) {
      setNotice(err.message);
    }
  }

  async function registerAgent(e) {
    e.preventDefault();
    try {
      const out = await api('/agents/register', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          owner_handle: registerForm.owner_handle,
          name: registerForm.name,
          description: registerForm.description,
          image_url: registerForm.image_url || null,
          skills: registerForm.skills_csv.split(',').map((s) => s.trim()).filter(Boolean),
        }),
      });
      setNotice(`Agent registered: ${out.agent_id}`);
      setAgentActionId(out.agent_id);
      load();
    } catch (err) {
      setNotice(err.message);
    }
  }

  async function startStop(action) {
    if (!agentActionId) {
      setNotice('Enter an agent id first.');
      return;
    }
    try {
      await api(`/agents/${agentActionId}/${action}`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{}' });
      setNotice(`Agent ${action} executed.`);
      load();
    } catch (err) {
      setNotice(err.message);
    }
  }

  async function runWalletScan() {
    try {
      const out = await api('/wallet/scan', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ wallet }),
      });
      setWalletScan(out);
      setNotice('Wallet balance fetched.');
    } catch (err) {
      setNotice(err.message);
    }
  }

  async function runPortfolio() {
    try {
      const out = await api('/portfolio', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ wallet }),
      });
      setPortfolio(out);
      setNotice('Portfolio loaded.');
    } catch (err) {
      setNotice(err.message);
    }
  }

  async function runPositions() {
    try {
      const out = await api('/positions', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ wallet }),
      });
      setPositions(out);
      setNotice('Positions loaded.');
    } catch (err) {
      setNotice(err.message);
    }
  }

  async function askAssistant(e) {
    e.preventDefault();
    try {
      const out = await api('/ask', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ message: askInput }),
      });
      setAskOutput(out);
      setNotice('Assistant response received.');
    } catch (err) {
      setNotice(err.message);
    }
  }

  const signalRows = (scan?.coins || []).slice(0, 24);

  function renderTab() {
    if (active === 'Overview') {
      return (
        <section className="grid">
          <Card title="System Console" wide>
            <pre>{pretty({ health, scanSummary: { coins: metrics.coins, pools: metrics.pools }, active })}</pre>
          </Card>
          <Card title="Runtime Agents">
            <div className="list">
              {(agents.length ? agents : [{ name: 'No agents yet', agent_id: '-', running: false }]).map((a, i) => (
                <div key={i} className="row">
                  <b>{a.name}</b>
                  <span>{a.agent_id}</span>
                  <em>{a.running ? 'RUNNING' : 'STOPPED'}</em>
                </div>
              ))}
            </div>
          </Card>
          <Card title="Top Skills">
            <div className="list">
              {(skills.length ? skills : [{ id: 'No skills loaded yet' }]).slice(0, 12).map((s, i) => (
                <div key={i} className="row">
                  <b>{s.id}</b>
                  <span>{s.title || ''}</span>
                </div>
              ))}
            </div>
          </Card>
        </section>
      );
    }

    if (active === 'Launch Studio') {
      return (
        <section className="grid">
          <Card title="Launch Builder" wide>
            <form onSubmit={runLaunchPreview} className="form">
              <input value={launchForm.name} onChange={(e) => setLaunchForm({ ...launchForm, name: e.target.value })} placeholder="Token Name" />
              <input value={launchForm.symbol} onChange={(e) => setLaunchForm({ ...launchForm, symbol: e.target.value })} placeholder="Symbol" />
              <input value={launchForm.wallet} onChange={(e) => setLaunchForm({ ...launchForm, wallet: e.target.value })} placeholder="Wallet" />
              <input value={launchForm.description} onChange={(e) => setLaunchForm({ ...launchForm, description: e.target.value })} placeholder="Description" />
              <button type="submit">Preview Launch</button>
            </form>
            <pre>{pretty(launchPreview || { hint: 'Submit launch preview to generate next-step plan.' })}</pre>
          </Card>
          <Card title="Launch Checklist">
            <div className="list">
              {[
                'Wallet provided',
                'Name and symbol validated',
                'Risk confirmation required',
                'Partner fee acknowledged',
              ].map((x) => (
                <div key={x} className="row"><b>{x}</b></div>
              ))}
            </div>
          </Card>
        </section>
      );
    }

    if (active === 'Registry') {
      return (
        <section className="grid">
          <Card title="Identity Verification" wide>
            <form onSubmit={requestCode} className="form">
              <input value={verifyForm.requester} onChange={(e) => setVerifyForm({ ...verifyForm, requester: e.target.value })} placeholder="Twitter handle or username" />
              <input value={verifyForm.code} onChange={(e) => setVerifyForm({ ...verifyForm, code: e.target.value })} placeholder="Verification code" />
              <input value={verifyForm.twitter_url} onChange={(e) => setVerifyForm({ ...verifyForm, twitter_url: e.target.value })} placeholder="Public post URL with code" />
              <button type="submit">Request Code</button>
            </form>
            <button onClick={verifyCode} className="action">Verify Code</button>
          </Card>

          <Card title="Register Agent" wide>
            <form onSubmit={registerAgent} className="form">
              <input value={registerForm.owner_handle} onChange={(e) => setRegisterForm({ ...registerForm, owner_handle: e.target.value })} placeholder="Owner handle" />
              <input value={registerForm.name} onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })} placeholder="Agent name" />
              <input value={registerForm.description} onChange={(e) => setRegisterForm({ ...registerForm, description: e.target.value })} placeholder="Description" />
              <input value={registerForm.image_url} onChange={(e) => setRegisterForm({ ...registerForm, image_url: e.target.value })} placeholder="Image URL (optional)" />
              <input value={registerForm.skills_csv} onChange={(e) => setRegisterForm({ ...registerForm, skills_csv: e.target.value })} placeholder="skills csv" />
              <button type="submit">Register</button>
            </form>
          </Card>

          <Card title="Agent Runtime Controls">
            <input value={agentActionId} onChange={(e) => setAgentActionId(e.target.value)} placeholder="agent id" className="single" />
            <div className="inlineButtons">
              <button onClick={() => startStop('start')}>Start</button>
              <button onClick={() => startStop('stop')}>Stop</button>
            </div>
          </Card>
        </section>
      );
    }

    if (active === 'Skills') {
      return (
        <section className="grid">
          <Card title="Skill Catalog" wide>
            <div className="list tall">
              {(skills.length ? skills : [{ id: 'No skills found' }]).map((s, i) => (
                <div key={i} className="row">
                  <b>{s.id}</b>
                  <span>{s.title || 'No title'}</span>
                  <span>{s.description || ''}</span>
                </div>
              ))}
            </div>
          </Card>
          <Card title="Skill Pipeline">
            <pre>{pretty({
              sources: ['local catalog', 'skills.sh import (planned)', 'cryptoskill import (planned)'],
              loaded: skills.length,
            })}</pre>
          </Card>
        </section>
      );
    }

    if (active === 'Signals' || active === 'Analytics' || active === 'Marketplace') {
      return (
        <section className="grid">
          <Card title="Signal Feed" wide>
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
                {signalRows.map((c, i) => (
                  <tr key={i}>
                    <td>{c.symbol}</td>
                    <td>{c.name}</td>
                    <td>{c.status}</td>
                    <td>{c.market_cap}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
          <Card title="Feed Stats">
            <pre>{pretty({ tokens_count: scan?.tokens_count || 0, pools_count: scan?.pools_count || 0 })}</pre>
          </Card>
        </section>
      );
    }

    if (active === 'Wallet Intel') {
      return (
        <section className="grid">
          <Card title="Wallet Controls" wide>
            <div className="walletRow">
              <input value={wallet} onChange={(e) => setWallet(e.target.value)} placeholder="Solana wallet address" className="single" />
              <div className="inlineButtons">
                <button onClick={runWalletScan}>Scan Wallet</button>
                <button onClick={runPortfolio}>Portfolio</button>
                <button onClick={runPositions}>Positions</button>
              </div>
            </div>
          </Card>
          <Card title="Balance">
            <pre>{pretty(walletScan || {})}</pre>
          </Card>
          <Card title="Portfolio">
            <pre>{pretty(portfolio || {})}</pre>
          </Card>
          <Card title="Positions">
            <pre>{pretty(positions || {})}</pre>
          </Card>
        </section>
      );
    }

    return (
      <section className="grid">
        <Card title="Assistant" wide>
          <form onSubmit={askAssistant} className="form one">
            <input value={askInput} onChange={(e) => setAskInput(e.target.value)} placeholder="Ask the model" />
            <button type="submit">Send</button>
          </form>
          <pre>{pretty(askOutput || { answer: 'No response yet' })}</pre>
        </Card>
      </section>
    );
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
            <p>{notice || 'Live control panel for launch, registry, wallet intelligence, and agent operations.'}</p>
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

        {renderTab()}
      </section>
    </main>
  );
}
