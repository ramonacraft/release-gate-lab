import type { RiskBrief } from '../utils/gate'
import './RiskNote.css'

type RiskNoteProps = {
  brief: RiskBrief
}

export function RiskNote({ brief }: RiskNoteProps) {
  return (
    <section
      className={`panel risk-note risk-note--${brief.tone}`}
      aria-labelledby="risk-note-heading"
      data-testid="risk-note"
    >
      <div className="panel__head">
        <p className="risk-note__eyebrow">{brief.eyebrow}</p>
        <h2 id="risk-note-heading">{brief.title}</h2>
        <p>{brief.summary}</p>
      </div>

      <div className="risk-note__impacts">
        <p className="risk-note__label">KPI impact</p>
        <ul>
          {brief.impacts.map((item) => (
            <li key={`${item.kpi}-${item.detail}`} className={`risk-impact risk-impact--${item.level}`}>
              <span className="risk-impact__kpi">{item.kpi}</span>
              <span className="risk-impact__level">{item.level}</span>
              <p>{item.detail}</p>
            </li>
          ))}
        </ul>
      </div>

      <p className="risk-note__action">
        <strong>Next:</strong> {brief.action}
      </p>
    </section>
  )
}
