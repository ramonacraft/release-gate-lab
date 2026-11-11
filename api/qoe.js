/**
 * Fake QoE sample — interview stand-in for Conviva/Mux dashboards.
 * Not a real player SDK. Safe public demo data only.
 */
export default function handler(req, res) {
  const titleId =
    typeof req.query?.titleId === 'string' && req.query.titleId.trim()
      ? req.query.titleId.trim()
      : 'aurora'

  res.setHeader('Cache-Control', 'no-store')
  res.status(200).json({
    source: 'demo-qoe',
    titleId,
    startupMs: 1280,
    rebufferCount: 0,
    bitrateKbps: 4500,
    note: 'Stand-in metrics for interview talk. Real Conviva/Mux come from the player SDK, not this UI assert.',
  })
}
