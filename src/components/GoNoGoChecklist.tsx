import type { ChecklistItem } from '../types/gate'
import './GoNoGoChecklist.css'

type GoNoGoChecklistProps = {
  items: ChecklistItem[]
  verdict: 'ready' | 'not-ready'
  onToggle: (id: string) => void
}

export function GoNoGoChecklist({ items, verdict, onToggle }: GoNoGoChecklistProps) {
  return (
    <section className="panel checklist" aria-labelledby="checklist-heading">
      <div className="panel__head">
        <h2 id="checklist-heading">✅ Go / no-go checklist</h2>
        <p>
          Human judgment sits next to the automated smoke gate. Required items must be checked
          before the board reads Ready.
        </p>
        <p
          className={`checklist__rollup checklist__rollup--${verdict}`}
          data-testid="checklist-rollup"
          aria-live="polite"
        >
          {verdict === 'ready' ? 'Ready' : 'Not ready'}
        </p>
      </div>

      <ul className="checklist__list">
        {items.map((item) => (
          <li key={item.id}>
            <label className="checklist__item">
              <input
                type="checkbox"
                checked={item.checked}
                onChange={() => onToggle(item.id)}
                data-testid={`check-${item.id}`}
              />
              <span className="checklist__copy">
                <span className="checklist__label">
                  {item.label}
                  {item.required ? (
                    <span className="checklist__required">Required</span>
                  ) : (
                    <span className="checklist__optional">Optional</span>
                  )}
                </span>
                <span className="checklist__hint">{item.hint}</span>
              </span>
            </label>
          </li>
        ))}
      </ul>
    </section>
  )
}
