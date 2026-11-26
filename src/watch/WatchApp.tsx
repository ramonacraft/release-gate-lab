import { useCallback, useEffect, useMemo, useState } from 'react'
import { DEMO_TITLES, getTitle } from './titles'
import './WatchApp.css'

type Route =
  | { kind: 'home' }
  | { kind: 'title'; id: string }
  | { kind: 'play'; id: string }
  | { kind: 'missing' }

function parseRoute(pathname: string): Route {
  const path = pathname.replace(/\/+$/, '') || '/'
  if (path === '/watch') return { kind: 'home' }

  const titleMatch = path.match(/^\/watch\/title\/([^/]+)$/)
  if (titleMatch) return { kind: 'title', id: decodeURIComponent(titleMatch[1]) }

  const playMatch = path.match(/^\/watch\/title\/([^/]+)\/play$/)
  if (playMatch) return { kind: 'play', id: decodeURIComponent(playMatch[1]) }

  return { kind: 'missing' }
}

function navigate(to: string) {
  window.history.pushState({}, '', to)
  window.dispatchEvent(new PopStateEvent('popstate'))
}

type QoeSample = {
  source: string
  titleId: string
  startupMs: number
  rebufferCount: number
  bitrateKbps: number
  note: string
}

export function WatchApp() {
  const [route, setRoute] = useState<Route>(() => parseRoute(window.location.pathname))
  const [qoe, setQoe] = useState<QoeSample | null>(null)

  useEffect(() => {
    const onPop = () => setRoute(parseRoute(window.location.pathname))
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const title = useMemo(() => {
    if (route.kind === 'title' || route.kind === 'play') return getTitle(route.id)
    return undefined
  }, [route])

  const loadQoe = useCallback(async (titleId: string) => {
    setQoe(null)
    const fallback: QoeSample = {
      source: 'demo-qoe-local-fallback',
      titleId,
      startupMs: 1280,
      rebufferCount: 0,
      bitrateKbps: 4500,
      note: 'Local preview has no Vercel /api/qoe — using in-page sample. On Vercel the API route returns the same shape.',
    }
    try {
      const res = await fetch(`/api/qoe?titleId=${encodeURIComponent(titleId)}`)
      if (!res.ok) {
        setQoe(fallback)
        return
      }
      const data = (await res.json()) as QoeSample
      setQoe(data)
    } catch {
      setQoe(fallback)
    }
  }, [])

  useEffect(() => {
    if (route.kind === 'play' && title) {
      void loadQoe(title.id)
    }
  }, [route, title, loadQoe])

  return (
    <div className="watch" data-testid="watch-app">
      <nav className="watch__nav" aria-label="Watch demo">
        <p className="watch__brand">
          <a href="/watch" data-testid="watch-brand" onClick={(e) => { e.preventDefault(); navigate('/watch') }}>
            Stream Practice
          </a>
        </p>
        <div className="watch__nav-links">
          <a href="/watch" data-testid="nav-home" onClick={(e) => { e.preventDefault(); navigate('/watch') }}>
            Home
          </a>
          <a href="/">Release Gate</a>
        </div>
      </nav>

      <main className="watch__main">
        {route.kind === 'home' && (
          <section data-testid="watch-home">
            <p className="watch__eyebrow">App under test</p>
            <h1 className="watch__heading">Home</h1>
            <p className="watch__lede">
              Tiny catalog for a Maven + TestNG + Selenium smoke path. Pick a title, open detail, then Play.
            </p>
            <ul className="watch__rail" data-testid="title-rail">
              {DEMO_TITLES.map((item) => (
                <li key={item.id}>
                  <a
                    className="watch__title-link"
                    href={`/watch/title/${item.id}`}
                    data-testid={`title-card-${item.id}`}
                    onClick={(e) => {
                      e.preventDefault()
                      navigate(`/watch/title/${item.id}`)
                    }}
                  >
                    <span className="watch__title-name">{item.name}</span>
                    <span className="watch__title-meta">{item.runtime}</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        {(route.kind === 'title' || route.kind === 'play') && !title && (
          <section data-testid="watch-missing">
            <h1 className="watch__heading watch__missing">Title not found</h1>
            <a className="watch__btn watch__btn--ghost" href="/watch" onClick={(e) => { e.preventDefault(); navigate('/watch') }}>
              Back to Home
            </a>
          </section>
        )}

        {route.kind === 'title' && title && (
          <section data-testid="watch-title">
            <p className="watch__eyebrow">Content</p>
            <h1 className="watch__heading" data-testid="title-name">
              {title.name}
            </h1>
            <p className="watch__lede" data-testid="title-synopsis">
              {title.synopsis}
            </p>
            <p className="watch__title-meta" data-testid="title-runtime">
              Runtime {title.runtime}
            </p>
            <div className="watch__actions">
              <button
                type="button"
                className="watch__btn watch__btn--primary"
                data-testid="play-button"
                onClick={() => navigate(`/watch/title/${title.id}/play`)}
              >
                Play
              </button>
              <a
                className="watch__btn watch__btn--ghost"
                href="/watch"
                onClick={(e) => {
                  e.preventDefault()
                  navigate('/watch')
                }}
              >
                Back to Home
              </a>
            </div>
          </section>
        )}

        {route.kind === 'play' && title && (
          <section data-testid="watch-player">
            <p className="watch__eyebrow">Playback</p>
            <h1 className="watch__heading" data-testid="player-title">
              {title.name}
            </h1>
            <div className="watch__player" data-testid="playback-panel">
              <p className="watch__player-status" data-testid="playback-status">
                Playing
              </p>
              <p className="watch__player-note">
                Demo playback state only — no real video stream. Enough for a UI smoke assert.
              </p>
            </div>
            <div className="watch__qoe" data-testid="qoe-panel">
              <h2>Sample stream-health metrics</h2>
              {!qoe && <p data-testid="qoe-loading">Loading sample metrics…</p>}
              {qoe && (
                <pre data-testid="qoe-json">{JSON.stringify(qoe, null, 2)}</pre>
              )}
            </div>
            <div className="watch__actions">
              <a
                className="watch__btn watch__btn--ghost"
                href={`/watch/title/${title.id}`}
                onClick={(e) => {
                  e.preventDefault()
                  navigate(`/watch/title/${title.id}`)
                }}
              >
                Back to title
              </a>
            </div>
          </section>
        )}

        {route.kind === 'missing' && (
          <section data-testid="watch-missing">
            <h1 className="watch__heading watch__missing">Page not found</h1>
            <a className="watch__btn watch__btn--ghost" href="/watch" onClick={(e) => { e.preventDefault(); navigate('/watch') }}>
              Back to Home
            </a>
          </section>
        )}
      </main>
    </div>
  )
}
