import type { PipelineRun } from '../types/gate'
import type { RunsSource } from '../utils/fetchRecentRuns'
import { deployLabel, smokeLabel } from '../utils/gate'
import './RecentRuns.css'

type RecentRunsProps = {
  runs: PipelineRun[]
  source: RunsSource
  message: string
  loading: boolean
}

export function RecentRuns({ runs, source, message, loading }: RecentRunsProps) {
  return (
    <section className="recent-runs" aria-labelledby="recent-runs-heading">
      <div className="recent-runs__intro">
        <div>
          <h2 id="recent-runs-heading">Recent runs</h2>
          <p data-testid="runs-source-message">{loading ? 'Loading pipeline runs…' : message}</p>
        </div>
        <p className={`recent-runs__badge recent-runs__badge--${source}`} data-testid="runs-source">
          {loading ? 'Loading' : source === 'live' ? 'Live Azure' : 'Demo data'}
        </p>
      </div>

      <div className="recent-runs__table-wrap" role="region" aria-label="Recent pipeline runs">
        <table className="recent-runs__table">
          <thead>
            <tr>
              <th scope="col">Azure build</th>
              <th scope="col">Branch</th>
              <th scope="col">Smoke</th>
              <th scope="col">Deploy</th>
              <th scope="col">Duration</th>
            </tr>
          </thead>
          <tbody>
            {runs.map((run) => (
              <tr
                key={run.id}
                data-testid={run.id}
                className={
                  run.deploy === 'blocked' || run.smoke === 'failed'
                    ? 'row-risk-high'
                    : undefined
                }
              >
                <td className="mono">{run.buildNumber}</td>
                <td>{run.branch}</td>
                <td>
                  <span className={`run-result run-result--${run.smoke}`}>
                    {smokeLabel(run.smoke)}
                  </span>
                </td>
                <td>
                  <span className={`run-result run-result--${run.deploy}`}>
                    {deployLabel(run.deploy)}
                  </span>
                </td>
                <td className="mono">{run.duration}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
