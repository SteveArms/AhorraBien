import { beforeEach, describe, expect, it } from 'vitest'
import { STORAGE_KEY, useAppStore } from './app-store'
import { selectIsDraftSaved, selectTotalSavings } from './selectors'

const initial = useAppStore.getState()

beforeEach(() => {
  localStorage.clear()
  useAppStore.setState(initial, true)
})

describe('app store', () => {
  it('guarda el borrador en el historial (sin duplicar) y lo marca limpio', () => {
    const { loadExample, setProduct, save } = useAppStore.getState()
    loadExample()
    setProduct('Mochila')
    expect(useAppStore.getState().dirty).toBe(true)

    save()
    save()
    const state = useAppStore.getState()
    expect(state.saved).toHaveLength(1)
    expect(state.saved[0].product).toBe('Mochila')
    expect(state.dirty).toBe(false)
    expect(state.toast).toEqual({ message: 'Comparación guardada', tone: 'success' })
    expect(selectIsDraftSaved(state)).toBe(true)
    expect(selectTotalSavings(state)).toBe(2)
  })

  it('abre una comparación guardada y la elimina', () => {
    const { loadExample, save, startNew } = useAppStore.getState()
    loadExample()
    save()
    const id = useAppStore.getState().draft.id
    startNew()
    expect(selectIsDraftSaved(useAppStore.getState())).toBe(false)

    useAppStore.getState().openSaved(id)
    expect(useAppStore.getState().draft.id).toBe(id)

    useAppStore.getState().removeCurrent()
    expect(useAppStore.getState().saved).toHaveLength(0)
  })

  it('alterna dificultades', () => {
    const { toggleDifficulty } = useAppStore.getState()
    toggleDifficulty('x')
    toggleDifficulty('y')
    toggleDifficulty('x')
    expect(useAppStore.getState().difficulties).toEqual(['y'])
  })

  it('persiste solo preferencias e historial', () => {
    useAppStore.getState().setGoal('Ahorrar')
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)!)
    expect(Object.keys(stored.state).sort()).toEqual(['difficulties', 'goal', 'saved'])
  })

  it('ignora datos corruptos al rehidratar', async () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ state: { goal: 42, saved: 'x' }, version: 0 }),
    )
    await useAppStore.persist.rehydrate()
    expect(useAppStore.getState().goal).toBe('')
    expect(useAppStore.getState().saved).toEqual([])
  })

  it('rehidrata datos válidos', async () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ state: { goal: 'Ahorrar', difficulties: ['a'], saved: [] }, version: 0 }),
    )
    await useAppStore.persist.rehydrate()
    expect(useAppStore.getState().goal).toBe('Ahorrar')
  })
})
