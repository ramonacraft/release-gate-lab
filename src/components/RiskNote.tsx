import './RiskNote.css'

type RiskNoteProps = {
  value: string
  onChange: (value: string) => void
}

export function RiskNote({ value, onChange }: RiskNoteProps) {
  return (
    <section className="risk-note" aria-labelledby="risk-note-heading">
      <div className="risk-note__intro">
        <h2 id="risk-note-heading">Risk note</h2>
        <p>Why this release is risky — or why it is not. Short judgment call for the go / no-go.</p>
      </div>

      <label className="risk-note__field">
        <span className="risk-note__label">Release risk call</span>
        <textarea
          data-testid="risk-note"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          rows={4}
          maxLength={400}
          placeholder="Example: Low risk — smoke green, small UI polish only, rollback is redeploy previous Vercel build."
        />
        <span className="risk-note__count">{value.length}/400</span>
      </label>
    </section>
  )
}
