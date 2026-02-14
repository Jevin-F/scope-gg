import { useState } from 'react'
import Head from 'next/head'
import { Fragment } from 'react'

const DEFAULT_CONDITION = `First identify what game is being played. Then provide game-specific analysis:

For FPS games (Valorant, CS, etc.): map, weapons, kills, HP, economy
For MOBA games (LoL, Dota 2, etc.): heroes, lanes, KDA, gold, objectives, cooldowns
For Battle Royale: players alive, zone position, inventory, rank tier
For other games: identify key stats relevant to that genre

Output: game name, current state analysis, tactical suggestions, win probability. Be a cheat-level analysis assistant (but legal).`

function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/live\/([^&\n?#]+)/,
  ]
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  return null
}

export default function Home() {
  const [streamUrl, setStreamUrl] = useState('')
  const [apiKey, setApiKey] = useState('')
  const [showApiKey, setShowApiKey] = useState(false)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')

  const videoId = streamUrl ? extractYouTubeId(streamUrl) : null

  const handleAnalyze = async () => {
    if (!streamUrl) {
      setError('ENTER STREAM URL')
      return
    }
    if (!apiKey) {
      setError('ENTER API KEY')
      return
    }

    setLoading(true)
    setError('')
    setResult(null)

    try {
      const response = await fetch('https://trio.machinefi.com/api/check-once', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          stream_url: streamUrl,
          condition: DEFAULT_CONDITION,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const message = errorData.error?.message || ''
        const remediation = errorData.error?.remediation || ''
        throw new Error(`API failed: ${response.status}${message ? ` - ${message}` : ''}${remediation ? `\n\nRemediation: ${remediation}` : ''}`)
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'REQUEST FAILED')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Fragment>
      <Head>
        <title>Scope.gg - Game Intelligence</title>
        <meta name="description" content="Real-time game analysis with tactical insights" />
        <style>{`
          @keyframes scanline {
            0% { transform: translateY(-100%); }
            100% { transform: translateY(100%); }
          }
          @keyframes pulse-glow {
            0%, 100% { box-shadow: 0 0 20px rgba(0, 255, 255, 0.3), 0 0 40px rgba(0, 255, 255, 0.1); }
            50% { box-shadow: 0 0 30px rgba(0, 255, 255, 0.5), 0 0 60px rgba(0, 255, 255, 0.2); }
          }
          @keyframes glitch {
            0%, 100% { transform: translate(0); }
            20% { transform: translate(-2px, 2px); }
            40% { transform: translate(-2px, -2px); }
            60% { transform: translate(2px, 2px); }
            80% { transform: translate(2px, -2px); }
          }
          @keyframes border-flow {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .scanline::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 2px;
            background: linear-gradient(transparent, rgba(0, 255, 255, 0.1), transparent);
            animation: scanline 3s linear infinite;
            pointer-events: none;
          }
          .cyber-border {
            position: relative;
            background: linear-gradient(90deg, #00f5ff, #8b5cf6, #ff006e, #00f5ff);
            background-size: 300% 300%;
            animation: border-flow 4s ease infinite;
          }
          .cyber-border::before {
            content: '';
            position: absolute;
            inset: 2px;
            background: #0a0a0f;
            z-index: 0;
          }
          .cyber-border > * {
            position: relative;
            z-index: 1;
          }
          .clip-diagonal {
            clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px));
          }
          .clip-diagonal-sm {
            clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px));
          }
        `}</style>
      </Head>

      <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col relative overflow-hidden">
        {/* Background Effects */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
          <div className="absolute top-1/4 -left-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />
        </div>

        {/* Header */}
        <header className="border-b border-cyan-500/20 bg-[#0a0a0f]/90 backdrop-blur-xl relative z-10">
          <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 bg-gradient-to-br from-cyan-500 to-violet-600 clip-diagonal-sm flex items-center justify-center group">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/50 to-violet-500/50 blur-sm group-hover:blur-md transition-all" />
                <svg className="w-5 h-5 text-white relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-black tracking-wider">SCOPE<span className="text-cyan-400">.GG</span></span>
                <span className="text-[8px] text-cyan-500/60 tracking-[0.3em] font-semibold">GAME INTELLIGENCE</span>
              </div>
            </div>
            <a
              href="https://github.com/Jevin-F/scope-gg"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-white/40 hover:text-cyan-400 transition-colors cursor-pointer tracking-wider flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
              GITHUB
            </a>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center p-6 relative z-10">
          <div className="w-full max-w-7xl grid lg:grid-cols-5 gap-6 items-start">
            {/* Left Panel - Controls */}
            <div className="lg:col-span-2 space-y-5">
              {/* Title Section */}
              <div className="space-y-1">
                <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-violet-400">
                  STREAM ANALYZER
                </h1>
                <div className="flex items-center gap-2">
                  <div className="h-[1px] flex-1 bg-gradient-to-r from-cyan-500/50 to-transparent" />
                  <span className="text-[10px] text-cyan-500/60 tracking-[0.2em] font-semibold">REAL-TIME ANALYSIS</span>
                </div>
              </div>

              {/* Input Panel */}
              <div className="cyber-border clip-diagonal">
                <div className="p-6 space-y-5 scanline relative overflow-hidden">
                  {/* Corner Decorations */}
                  <div className="absolute top-3 left-3 w-4 h-4 border-l-2 border-t-2 border-cyan-500/50" />
                  <div className="absolute top-3 right-3 w-4 h-4 border-r-2 border-t-2 border-violet-500/50" />
                  <div className="absolute bottom-3 left-3 w-4 h-4 border-l-2 border-b-2 border-violet-500/50" />
                  <div className="absolute bottom-3 right-3 w-4 h-4 border-r-2 border-b-2 border-cyan-500/50" />

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-cyan-400 uppercase tracking-[0.2em] flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-cyan-400" />
                      Stream URL
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={streamUrl}
                        onChange={(e) => setStreamUrl(e.target.value)}
                        placeholder="https://youtube.com/watch?v=..."
                        className="w-full px-4 py-3 bg-[#0a0a0f] border border-cyan-500/30 clip-diagonal-sm focus:outline-none focus:border-cyan-400 text-sm text-white placeholder-white/10 transition-all focus:shadow-[0_0_20px_rgba(0,255,255,0.2)]"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-violet-400 uppercase tracking-[0.2em] flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-violet-400" />
                      API Key
                    </label>
                    <div className="relative">
                      <input
                        type={showApiKey ? 'text' : 'password'}
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="Enter your API key"
                        className="w-full px-4 py-3 pr-24 bg-[#0a0a0f] border border-violet-500/30 clip-diagonal-sm focus:outline-none focus:border-violet-400 text-sm text-white placeholder-white/10 transition-all focus:shadow-[0_0_20px_rgba(139,92,246,0.2)]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowApiKey(!showApiKey)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 text-[10px] font-bold text-white/40 hover:text-white bg-white/5 hover:bg-cyan-500/20 clip-diagonal-sm transition-all border border-white/10 hover:border-cyan-500/50"
                      >
                        {showApiKey ? 'HIDE' : 'SHOW'}
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleAnalyze}
                    disabled={loading}
                    className={`group relative w-full py-4 clip-diagonal font-black text-sm tracking-wider transition-all ${
                      loading
                        ? 'bg-white/5 text-white/30 cursor-not-allowed'
                        : 'bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-white shadow-[0_0_30px_rgba(0,255,255,0.3)] hover:shadow-[0_0_50px_rgba(0,255,255,0.5)]'
                    }`}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {loading ? (
                        <>
                          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          ANALYZING...
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          EXECUTE ANALYSIS
                        </>
                      )}
                    </span>
                  </button>

                  {error && (
                    <div className="p-3 bg-red-500/10 clip-diagonal-sm border border-red-500/30">
                      <p className="text-red-400 text-xs font-semibold tracking-wider flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {error}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Game Type Indicators */}
              <div className="flex gap-2">
                {['FPS', 'MOBA', 'BR', 'OTHER'].map((type, i) => (
                  <div
                    key={type}
                    className="flex-1 bg-[#0a0a0f] border border-white/5 clip-diagonal-sm py-3 text-center hover:border-cyan-500/30 hover:bg-cyan-500/5 transition-all group cursor-pointer"
                  >
                    <span className="text-[10px] font-bold text-white/20 group-hover:text-cyan-400/80 tracking-wider">{type}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Panel - Video + Results */}
            <div className="lg:col-span-3 space-y-5">
              {/* Video Container */}
              <div className="cyber-border clip-diagonal">
                <div className="relative overflow-hidden bg-[#0a0a0f]">
                  <div className="aspect-video relative">
                    {videoId ? (
                      <iframe
                        src={`https://www.youtube.com/embed/${videoId}`}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center relative">
                        {/* Grid Background */}
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.03)_1px,transparent_1px)] bg-[size:30px_30px]" />
                        <svg className="w-20 h-20 text-cyan-500/20 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        <p className="text-sm text-white/20 font-semibold tracking-wider">ENTER STREAM URL TO BEGIN</p>
                      </div>
                    )}

                    {/* Status Badge */}
                    <div className="absolute top-4 left-4 px-3 py-1.5 bg-black/80 backdrop-blur clip-diagonal-sm border border-white/10 flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${loading ? 'bg-yellow-400 animate-pulse' : videoId ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-white/30'}`} />
                      <span className="text-[10px] font-bold text-white/60 tracking-wider">
                        {loading ? 'SCANNING' : videoId ? 'LIVE FEED' : 'STANDBY'}
                      </span>
                    </div>

                    {/* Corner HUD Elements */}
                    <div className="absolute top-4 right-4 flex gap-1">
                      <div className="w-1 h-3 bg-cyan-500/50" />
                      <div className="w-1 h-3 bg-cyan-500/30" />
                      <div className="w-1 h-3 bg-cyan-500/20" />
                    </div>
                    <div className="absolute bottom-4 left-4 flex gap-1">
                      <div className="w-3 h-1 bg-violet-500/20" />
                      <div className="w-3 h-1 bg-violet-500/30" />
                      <div className="w-3 h-1 bg-violet-500/50" />
                    </div>
                  </div>

                  {/* Video Footer */}
                  <div className="px-5 py-3 border-t border-cyan-500/10 bg-[#0a0a0f] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] text-white/20 font-semibold tracking-wider">SCOPE.GG v1.0</span>
                      <div className="w-[1px] h-3 bg-white/10" />
                      <span className="text-[10px] text-white/20 font-semibold tracking-wider">SYSTEM READY</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse shadow-[0_0_10px_#06b6d4]" />
                      <span className="text-[10px] text-cyan-500/60 font-bold tracking-wider">TRIO POWERED</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Result Panel - Below Video */}
              <div className="cyber-border clip-diagonal">
                <div className="relative overflow-hidden">
                  <div className="px-5 py-3 border-b border-cyan-500/20 flex items-center gap-3 bg-[#0a0a0f]">
                    <div className="flex gap-1">
                      <div className="w-1 h-1 bg-cyan-400" />
                      <div className="w-1 h-1 bg-cyan-400" />
                      <div className="w-1 h-1 bg-cyan-400" />
                    </div>
                    <span className="text-[10px] font-bold text-cyan-400 tracking-[0.2em]">ANALYSIS RESULT</span>
                    <div className="flex-1 h-[1px] bg-gradient-to-r from-cyan-500/30 to-transparent" />
                  </div>
                  <div className="p-5 bg-[#0a0a0f] scanline min-h-[120px]">
                    {loading ? (
                      <div className="flex items-center justify-center h-full min-h-[80px]">
                        <div className="flex flex-col items-center gap-3">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-cyan-400 animate-pulse" style={{ animationDelay: '0ms' }} />
                            <div className="w-2 h-2 bg-cyan-400 animate-pulse" style={{ animationDelay: '150ms' }} />
                            <div className="w-2 h-2 bg-cyan-400 animate-pulse" style={{ animationDelay: '300ms' }} />
                          </div>
                          <span className="text-xs text-cyan-400/60 font-semibold tracking-wider">ANALYZING STREAM...</span>
                        </div>
                      </div>
                    ) : result ? (
                      <div className="max-h-64 overflow-y-auto">
                        <p className="text-sm text-white/70 leading-relaxed whitespace-pre-wrap font-mono">
                          {result.explanation}
                        </p>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full min-h-[80px]">
                        <div className="flex flex-col items-center gap-2">
                          <svg className="w-8 h-8 text-white/10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <span className="text-xs text-white/20 font-semibold tracking-wider">WAITING FOR ANALYSIS</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-cyan-500/10 bg-[#0a0a0f]/90 relative z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <span className="text-[10px] text-white/20 font-semibold tracking-wider">© 2025 SCOPE.GG</span>
            <div className="flex items-center gap-4">
              <span className="text-[10px] text-white/20 font-semibold tracking-wider">BUILT FOR DOMINANCE</span>
              <div className="flex gap-0.5">
                <div className="w-2 h-2 bg-cyan-500/20" />
                <div className="w-2 h-2 bg-cyan-500/40" />
                <div className="w-2 h-2 bg-cyan-500/60" />
                <div className="w-2 h-2 bg-cyan-500/80" />
                <div className="w-2 h-2 bg-cyan-500" />
              </div>
            </div>
          </div>
        </footer>
      </div>
    </Fragment>
  )
}
