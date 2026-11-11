export type DemoTitle = {
  id: string
  name: string
  synopsis: string
  runtime: string
}

/** Tiny catalog for JD harness practice — not a real catalog product. */
export const DEMO_TITLES: DemoTitle[] = [
  {
    id: 'aurora',
    name: 'Aurora Night',
    synopsis: 'A late-shift producer races a live cut before air.',
    runtime: '42 min',
  },
  {
    id: 'harbor',
    name: 'Harbor Line',
    synopsis: 'A city desk follows a breaking story across platforms.',
    runtime: '38 min',
  },
]

export function getTitle(id: string | undefined): DemoTitle | undefined {
  if (!id) return undefined
  return DEMO_TITLES.find((t) => t.id === id)
}
