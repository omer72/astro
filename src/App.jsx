import { useState } from 'react'

const STOP = new Set("a an the and or for to of in on with your you my our app apps free pro plus lite best top new now get all your daily easy simple my me it is are be by from at as this that these into more most super ultimate official premium app's mobile online offline plus 2 3 4 hd go".split(' '))

const COUNTRIES = [
  { code: 'us', label: '🇺🇸 United States' },
  { code: 'il', label: '🇮🇱 Israel' },
  { code: 'gb', label: '🇬🇧 United Kingdom' },
  { code: 'ca', label: '🇨🇦 Canada' },
  { code: 'au', label: '🇦🇺 Australia' },
  { code: 'de', label: '🇩🇪 Germany' },
  { code: 'fr', label: '🇫🇷 France' },
  { code: 'es', label: '🇪🇸 Spain' },
]

const EXAMPLES = ['parenting', 'babysitter', 'toddler activities', 'loyalty card', 'grocery rewards']

const SANDBOXED = (() => {
  try { return window.self !== window.top } catch { return true }
})()

// JSONP bypasses CORS — Apple's search API supports &callback=.
// Kept because the only alternative is a backend, and "no backend" is a feature.
let jid = 0
function jsonp(url) {
  return new Promise((resolve, reject) => {
    const cb = `__scout_cb_${++jid}`
    const s = document.createElement('script')
    let to
    const cleanup = () => {
      clearTimeout(to); delete window[cb]
      if (s.parentNode) s.parentNode.removeChild(s)
    }
    to = setTimeout(() => { cleanup(); reject(new Error('timeout')) }, 12000)
    window[cb] = data => { cleanup(); resolve(data) }
    s.onerror = () => { cleanup(); reject(new Error('network')) }
    s.src = url + (url.indexOf('?') > -1 ? '&' : '?') + 'callback=' + cb
    document.body.appendChild(s)
  })
}

function fmt(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(n >= 10000000 ? 0 : 1) + 'M'
  if (n >= 1000) return (n / 1000).toFixed(n >= 10000 ? 0 : 1) + 'k'
  return String(n)
}

function parseAppId(s) {
  s = (s || '').trim()
  if (!s) return null
  const m = s.match(/id(\d{6,})/i) || s.match(/^\s*(\d{6,})\s*$/)
  return m ? m[1] : null
}

function mineKeywords(text, excludeSet) {
  const ex = excludeSet || new Set()
  const freq = {}
  ;(text || '').toLowerCase().replace(/[^a-zÀ-ɏ0-9\s]/g, ' ').split(/\s+/).forEach(w => {
    if (w.length < 3 || w.length > 18) return
    if (STOP.has(w)) return
    if (ex.has(w)) return
    if (/^\d+$/.test(w)) return
    freq[w] = (freq[w] || 0) + 1
  })
  return Object.keys(freq).map(w => [w, freq[w]]).sort((a, b) => b[1] - a[1])
}

function analyze(term, results) {
  const qTokens = term.toLowerCase().split(/\s+/).filter(Boolean)
  const qLower = term.toLowerCase()
  const top = results.slice(0, 10)
  const inTitle = app => {
    const t = (app.trackName || '').toLowerCase()
    if (t.indexOf(qLower) > -1) return true
    return qTokens.every(tok => t.indexOf(tok) > -1)
  }
  const titleHits = top.filter(inTitle)
  const titleUsage = top.length ? titleHits.length / top.length : 0
  const counts = top.map(a => a.userRatingCount || 0).sort((a, b) => a - b)
  const mid = Math.floor(counts.length / 2)
  const medianRatings = !counts.length ? 0 : (counts.length % 2 ? counts[mid] : Math.round((counts[mid - 1] + counts[mid]) / 2))
  const ratingStrength = Math.min(1, Math.log10((medianRatings || 0) + 1) / 6)
  const difficulty = Math.round(100 * (0.55 * ratingStrength + 0.45 * titleUsage))
  const dLabel = difficulty < 33 ? 'EASY' : difficulty < 66 ? 'MEDIUM' : 'HARD'
  const dColor = difficulty < 33 ? 'var(--easy)' : difficulty < 66 ? 'var(--mid)' : 'var(--hard)'
  const dBg = difficulty < 33 ? 'rgba(15,158,142,.12)' : difficulty < 66 ? 'rgba(242,163,60,.14)' : 'rgba(229,72,77,.12)'
  return { qTokens, top, inTitle, titleHits, titleUsage, medianRatings, difficulty, dLabel, dColor, dBg }
}

function Highlight({ text, terms }) {
  const valid = (terms || []).filter(t => t && t.length >= 2)
  if (!valid.length) return text
  const pattern = valid.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')
  const parts = (text || '').split(new RegExp(`(${pattern})`, 'ig'))
  return parts.map((p, i) => (i % 2 === 1 ? <mark key={i}>{p}</mark> : p))
}

function stars(avg) {
  const full = Math.round(avg || 0)
  return '★★★★★'.slice(0, full) + '☆☆☆☆☆'.slice(0, 5 - full)
}

export default function App() {
  const [term, setTerm] = useState('')
  const [country, setCountry] = useState('us')
  const [appQuery, setAppQuery] = useState('')
  const [view, setView] = useState(SANDBOXED ? { kind: 'sandboxed' } : { kind: 'idle' })

  function failMsg(err) {
    return SANDBOXED
      ? "This page can’t reach the App Store while it’s embedded. Open the deployed site directly."
      : `Couldn’t reach the App Store (${err?.message || 'error'}). Check your connection and try again.`
  }

  function search(t, cc = country) {
    t = (t || '').trim()
    if (!t) return
    setTerm(t)
    setView({ kind: 'loading', label: `Scouting “${t}”…`, sub: 'Reading the App Store' })
    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(t)}&country=${cc}&entity=software&limit=50`
    jsonp(url)
      .then(d => {
        const results = (d && d.results) || []
        if (!results.length) setView({ kind: 'empty', term: t })
        else setView({ kind: 'results', term: t, results, analysis: analyze(t, results) })
      })
      .catch(err => setView({ kind: 'error', message: failMsg(err) }))
  }

  function scoutApp(raw) {
    const id = parseAppId(raw)
    if (!id) {
      setView({ kind: 'error', message: 'Paste an App Store URL or numeric app ID (e.g. https://apps.apple.com/us/app/instagram/id389801252 or just 389801252).' })
      return
    }
    setView({ kind: 'loading', label: `Mining keywords from app ${id}…`, sub: 'Reading the App Store listing' })
    const url = `https://itunes.apple.com/lookup?id=${encodeURIComponent(id)}&country=${country}&entity=software`
    jsonp(url)
      .then(d => {
        const app = d && d.results && d.results[0]
        if (!app) { setView({ kind: 'error', message: `No app found for ID ${id} in this store. Check the URL or switch country.` }); return }
        const kws = mineKeywords(`${app.trackName || ''} ${app.description || ''}`).slice(0, 30)
        if (!kws.length) { setView({ kind: 'error', message: `Found “${app.trackName || ''}” but couldn’t extract any usable keywords.` }); return }
        setView({ kind: 'mined', app, kws })
      })
      .catch(err => setView({ kind: 'error', message: failMsg(err) }))
  }

  function changeCountry(c) {
    setCountry(c)
    if (term.trim()) search(term, c)
  }

  const busy = view.kind === 'loading'

  return (
    <div className="wrap">
      <header className="top">
        <div className="brand">
          <h1><span className="dot" />Keyword Scout</h1>
          <span className="tag">app store ASO · live from apple</span>
        </div>

        <div className="searchbar">
          <input
            type="text"
            placeholder="Type a keyword — e.g. parenting, babysitter, loyalty card"
            autoComplete="off"
            value={term}
            onChange={e => setTerm(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') search(term) }}
          />
          <select value={country} onChange={e => changeCountry(e.target.value)} title="App Store country">
            {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.label}</option>)}
          </select>
          <button className="go" onClick={() => search(term)} disabled={busy}>Scout</button>
        </div>

        <div className="examples">
          <span className="lbl">try:</span>
          {EXAMPLES.map(e => (
            <button key={e} className="chip" onClick={() => search(e)}>{e}</button>
          ))}
        </div>

        <div className="byapp">
          <span className="lbl">or mine a competitor:</span>
          <input
            type="text"
            placeholder="App Store URL or ID — e.g. https://apps.apple.com/us/app/instagram/id389801252"
            autoComplete="off"
            value={appQuery}
            onChange={e => setAppQuery(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') scoutApp(appQuery) }}
          />
          <button className="go alt" onClick={() => scoutApp(appQuery)} disabled={busy}>Mine keywords</button>
        </div>
      </header>

      <Body view={view} onScout={search} />

      <footer>
        <b style={{ color: 'var(--ink)' }}>How to read this.</b> Apps are listed in Apple’s own search-relevance order for the keyword — that’s your ranking proxy. The strongest break-in signals: rivals with huge rating counts and the keyword sitting in their <i>title</i> (Apple weights the title heaviest, then subtitle, then the keywords field).
        <br /><br />
        <b style={{ color: 'var(--ink)' }}>What this is not.</b> Real search <i>volume/popularity</i> and Apple’s official difficulty come from the Apple Search Ads API (needs your authenticated ASA account). The difficulty here is a heuristic: ~55% from competitors’ median rating count, ~45% from how many of the top 10 use the keyword in their title. Treat it as a directional read, not a verdict. Data: Apple iTunes Search API via <code>itunes.apple.com/search</code>.
      </footer>
    </div>
  )
}

function Body({ view, onScout }) {
  if (view.kind === 'idle') return (
    <div className="state">
      <div className="big">Search a keyword to begin.</div>
      <div>See which apps rank for it, how hard it is to break in, and what to target next.</div>
    </div>
  )
  if (view.kind === 'sandboxed') return (
    <div className="state">
      <div className="big">Open the deployed site directly to use this.</div>
      <div>Embedded previews block requests to the App Store. Visit the live URL in a real browser tab.</div>
    </div>
  )
  if (view.kind === 'loading') return (
    <div className="state">
      <div className="spinner" />
      <div className="big">{view.label}</div>
      <div>{view.sub}</div>
    </div>
  )
  if (view.kind === 'error') return (
    <div className="state"><div className="big">{view.message}</div></div>
  )
  if (view.kind === 'empty') return (
    <div className="state">
      <div className="big">No apps found for “{view.term}” in this store.</div>
      <div>Try a broader term, or switch country.</div>
    </div>
  )
  if (view.kind === 'mined') return <Mined app={view.app} kws={view.kws} onScout={onScout} />
  if (view.kind === 'results') return <Results term={view.term} results={view.results} analysis={view.analysis} onScout={onScout} />
  return null
}

function Mined({ app, kws, onScout }) {
  return (
    <div className="from-app">
      <div className="head">
        <img src={app.artworkUrl100 || app.artworkUrl60 || ''} alt="" />
        <div>
          <div className="name">{app.trackName || ''}</div>
          <div className="sub">{(app.sellerName || app.artistName || '')} · {app.primaryGenreName || ''}</div>
        </div>
      </div>
      <div className="hint">Top words from this app’s title + description. Click any to scout it.</div>
      <div className="chips">
        {kws.map(([w, n]) => (
          <button
            key={w}
            className="kw"
            onClick={() => { onScout(w); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
          >
            {w}<span className="n">{n}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

function Results({ term, results, analysis, onScout }) {
  const { qTokens, top, inTitle, titleHits, titleUsage, medianRatings, difficulty, dLabel, dColor, dBg } = analysis
  const combined = results.map(a => `${a.trackName || ''} ${a.description || ''}`).join(' ')
  const adj = mineKeywords(combined, new Set(qTokens)).slice(0, 18)
  const titleSummary = titleUsage >= 0.6
    ? 'Crowded — hard to outrank on the title alone.'
    : titleUsage <= 0.2
      ? 'Open lane — few rivals claim it in the title.'
      : 'Some competition for the title slot.'

  return (
    <section>
      <div className="summary">
        <div className="cell">
          <div className="k">Keyword</div>
          <div className="v" style={{ fontSize: 18 }}>{term}</div>
        </div>
        <div className="cell">
          <div className="k">Apps found</div>
          <div className="v">{results.length}{results.length >= 50 ? '+' : ''}</div>
        </div>
        <div className="cell">
          <div className="k">Median ratings (top 10)</div>
          <div className="v">{fmt(medianRatings)}</div>
        </div>
        <div className="cell">
          <div className="k">Difficulty <small>(heuristic)</small></div>
          <div className="v">{difficulty}<small>/100</small></div>
          <div className="meter"><div className="pin" style={{ left: `calc(${difficulty}% - 1.5px)` }} /></div>
          <span className="diff-label" style={{ color: dColor, background: dBg }}>{dLabel} to rank</span>
        </div>
      </div>

      <div className="grid">
        <div className="panel">
          <h2>Apps ranking for this keyword</h2>
          <div>
            {results.map((a, i) => {
              const icon = a.artworkUrl100 || a.artworkUrl60 || ''
              const price = a.formattedPrice || (a.price === 0 ? 'Free' : '')
              return (
                <a key={a.trackId || i} className="row" href={a.trackViewUrl || '#'} target="_blank" rel="noopener noreferrer">
                  <div className="rank">{i + 1}</div>
                  <img className="ico" loading="lazy" src={icon} alt="" />
                  <div className="meta">
                    <div className="name"><Highlight text={a.trackName || ''} terms={qTokens} /></div>
                    <div className="sub">
                      <span>{(a.sellerName || a.artistName || '')} · {a.primaryGenreName || ''}</span>
                      {inTitle(a) && <span className="badge-title">in title</span>}
                    </div>
                  </div>
                  <div className="stats">
                    <span className="stars">{stars(a.averageUserRating)}</span>{' '}
                    <span className="cnt">{fmt(a.userRatingCount || 0)}</span>
                    <span className="price">{price}</span>
                  </div>
                </a>
              )
            })}
          </div>
        </div>

        <div className="side">
          <div className="panel">
            <h2>Adjacent keywords</h2>
            <div className="kw-chips">
              {adj.length ? adj.map(([w, n]) => (
                <button
                  key={w}
                  className="kw"
                  onClick={() => { onScout(w); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                >
                  {w}<span className="n">{n}</span>
                </button>
              )) : <div style={{ color: 'var(--ink-soft)', fontSize: 13 }}>No clear adjacent terms.</div>}
            </div>
          </div>
          <div className="panel">
            <h2>Keyword in title</h2>
            <div className="body">
              <b>{titleHits.length} of {top.length}</b> top apps put “{term}” in their title. {titleSummary}
            </div>
            <ul className="titlelist">
              {titleHits.length ? titleHits.map((a, i) => (
                <li key={a.trackId || i}>{a.trackName || ''}<span>{fmt(a.userRatingCount || 0)} ratings</span></li>
              )) : <li style={{ color: 'var(--ink-soft)' }}>None of the top 10 use it in the title.</li>}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

// Self-checks (silent on pass, logs on regression). ponytail: no test framework, console.assert is the lazy version.
if (typeof console !== 'undefined') {
  console.assert(parseAppId('https://apps.apple.com/us/app/instagram/id389801252') === '389801252', 'parseAppId url')
  console.assert(parseAppId('389801252') === '389801252', 'parseAppId bare')
  console.assert(parseAppId('hello') === null, 'parseAppId garbage')
  console.assert(mineKeywords('hello hello world the and').length === 2, 'mineKeywords stop+dedup')
  console.assert(analyze('x', []).difficulty === 0, 'analyze empty')
  const hi = analyze('x', [{ trackName: 'x best', userRatingCount: 1000000 }]).difficulty
  console.assert(hi > 50, 'analyze high difficulty, got ' + hi)
}
