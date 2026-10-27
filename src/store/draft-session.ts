import { draftSessionSchema } from '@/schemas/draft.schema'
import type { Comparison } from '@/types'
import { createSafeStorage, webStorage } from './safe-storage'

export const DRAFT_KEY = 'ahorrabien:borrador'

type DraftSession = { draft: Comparison; dirty: boolean; trial: boolean }

const { storage } = createSafeStorage<DraftSession>(() => webStorage(() => window.sessionStorage))

/** Borrador de esta pestaña, o un objeto vacío si no hay uno válido. */
export function readDraftSession(): Partial<DraftSession> {
  const parsed = draftSessionSchema.safeParse(storage.getItem(DRAFT_KEY)?.state)
  return parsed.success ? parsed.data : {}
}

export function writeDraftSession(session: DraftSession) {
  storage.setItem(DRAFT_KEY, { state: session, version: 0 })
}
