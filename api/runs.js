/**
 * Vercel serverless function — proxies recent Azure Pipeline builds.
 * Secrets stay on the server (never ship a PAT to the browser).
 *
 * Required Vercel env vars:
 * - AZURE_DEVOPS_ORG
 * - AZURE_DEVOPS_PROJECT
 * - AZURE_DEVOPS_PAT
 * Optional:
 * - AZURE_PIPELINE_DEFINITION_ID (narrows to this pipeline)
 */

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const org = process.env.AZURE_DEVOPS_ORG
  const project = process.env.AZURE_DEVOPS_PROJECT
  const pat = process.env.AZURE_DEVOPS_PAT
  const definitionId = process.env.AZURE_PIPELINE_DEFINITION_ID

  if (!org || !project || !pat) {
    return res.status(503).json({
      error: 'Azure DevOps is not configured',
      missing: [
        !org && 'AZURE_DEVOPS_ORG',
        !project && 'AZURE_DEVOPS_PROJECT',
        !pat && 'AZURE_DEVOPS_PAT',
      ].filter(Boolean),
    })
  }

  const params = new URLSearchParams({
    $top: '8',
    queryOrder: 'queueTimeDescending',
    'api-version': '7.1',
  })
  if (definitionId) {
    params.set('definitions', definitionId)
  }

  const url = `https://dev.azure.com/${encodeURIComponent(org)}/${encodeURIComponent(project)}/_apis/build/builds?${params}`
  const auth = Buffer.from(`:${pat}`).toString('base64')

  try {
    const azureResponse = await fetch(url, {
      headers: {
        Authorization: `Basic ${auth}`,
        Accept: 'application/json',
      },
    })

    const body = await azureResponse.text()
    if (!azureResponse.ok) {
      return res.status(azureResponse.status).json({
        error: 'Azure DevOps request failed',
        detail: body.slice(0, 500),
      })
    }

    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=120')
    return res.status(200).send(body)
  } catch (error) {
    return res.status(502).json({
      error: 'Failed to reach Azure DevOps',
      detail: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}
