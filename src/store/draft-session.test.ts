import { beforeEach, describe, expect, it } from 'vitest'
import { blankAlt, exampleComparison } from '@/features/comparison/lib/factories'
import { DRAFT_KEY, readDraftSession, writeDraftSession } from './draft-session'

describe('draft-session', () => {
  beforeEach(() => sessionStorage.clear())

  it('recupera el borrador, si tenía cambios sin guardar y si viene del onboarding', () => {
    const draft = { ...exampleComparison(), product: 'Silla de escritorio' }
    writeDraftSession({ draft, dirty: true, trial: true })
    expect(readDraftSession()).toEqual({ draft, dirty: true, trial: true })
  })

  it('acepta borradores guardados antes de existir `trial`', () => {
    const draft = exampleComparison()
    sessionStorage.setItem(
      DRAFT_KEY,
      JSON.stringify({ state: { draft, dirty: false }, version: 0 }),
    )
    expect(readDraftSession()).toEqual({ draft, dirty: false, trial: false })
  })

  it('conserva los campos vacíos como vacíos (NaN)', () => {
    const draft = { ...exampleComparison(), a: { ...blankAlt(100), price: NaN } }
    writeDraftSession({ draft, dirty: true, trial: false })
    expect(readDraftSession().draft?.a.price).toBeNaN()
  })

  it('ignora un borrador con forma inválida o JSON dañado', () => {
    sessionStorage.setItem(DRAFT_KEY, JSON.stringify({ state: { draft: { id: 1 } }, version: 0 }))
    expect(readDraftSession()).toEqual({})
    sessionStorage.setItem(DRAFT_KEY, '{roto')
    expect(readDraftSession()).toEqual({})
  })
})
