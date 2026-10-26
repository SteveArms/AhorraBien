import { useEffect, useMemo, useState } from 'react'

type Alt = {
  price: number
  discount: number
  benefit: number
  transport: number
  extras: number
  cashback: number
}
type Comparison = {
  id: string
  date: string
  product: string
  a: Alt
  b: Alt
}
type Screen =
  | 'welcome'
  | 'goal'
  | 'difficulty'
  | 'demo'
  | 'home'
  | 'form'
  | 'details'
  | 'result'
  | 'learn'
  | 'history'
  | 'profile'
type Modal = 'delete-one' | 'delete-all' | 'discard' | null

const blankAlt = (price: number): Alt => ({
  price,
  discount: 0,
  benefit: 0,
  transport: 0,
  extras: 0,
  cashback: 0,
})

const example = (): Comparison => ({
  id: crypto.randomUUID(),
  date: new Date().toISOString(),
  product: 'Auriculares inalámbricos',
  a: { ...blankAlt(100), discount: 10, transport: 4 },
  b: { ...blankAlt(95), benefit: 5, transport: 2 },
})

const initialComparison = (): Comparison => ({
  id: crypto.randomUUID(),
  date: new Date().toISOString(),
  product: 'Auriculares inalámbricos',
  a: blankAlt(100),
  b: blankAlt(95),
})

export function calculateCost(alt: Alt) {
  const values = Object.values(alt)
  if (values.some((value) => !Number.isFinite(value)) || alt.price <= 0) return null
  if ([alt.discount, alt.benefit, alt.transport, alt.extras, alt.cashback].some((v) => v < 0))
    return null
  if (alt.discount + alt.benefit > alt.price) return null
  return Math.max(0, Math.round((alt.price - alt.discount - alt.benefit + alt.transport + alt.extras) * 100) / 100)
}

const money = (value: number) =>
  new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(value)

function Icon({ name, size = 20 }: { name: string; size?: number }) {
  const paths: Record<string, React.ReactNode> = {
    home: <><path d="m3 10 9-7 9 7" /><path d="M5 9v11h14V9M9 20v-6h6v6" /></>,
    compare: <><path d="M7 3v15m0 0-4-4m4 4 4-4M17 21V6m0 0-4 4m4-4 4 4" /></>,
    history: <><path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5M12 7v5l3 2" /></>,
    user: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
    arrow: <path d="m9 18 6-6-6-6" />,
    back: <><path d="m15 18-6-6 6-6" /><path d="M9 12h10" /></>,
    plus: <path d="M12 5v14M5 12h14" />,
    check: <path d="m5 12 4 4L19 6" />,
    trash: <><path d="M4 7h16M9 7V4h6v3M7 7l1 14h8l1-14M10 11v6M14 11v6" /></>,
    info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v6M12 7h.01" /></>,
    close: <path d="m6 6 12 12M18 6 6 18" />,
  }
  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>
}

function Mark({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`mark ${compact ? 'mark--small' : ''}`} aria-label="Símbolo AhorraBien">
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <path d="M10 48 28 14h8L21 48h-11Z" />
        <path d="M38 14 54 48H25l6-12h8l-5-12 4-10Z" opacity=".58" />
        <path d="M22 48h32" fill="none" stroke="currentColor" strokeWidth="5" />
      </svg>
    </div>
  )
}

function Button({ children, variant = 'primary', icon, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'text' | 'danger'; icon?: string }) {
  return <button className={`button button--${variant}`} {...props}>{icon && <Icon name={icon} />}{children}</button>
}

function Header({ title, onBack, action }: { title: string; onBack?: () => void; action?: React.ReactNode }) {
  return <header className="screen-header">{onBack ? <button className="icon-button" onClick={onBack} aria-label="Volver"><Icon name="back" /></button> : <span /> }<strong>{title}</strong>{action || <span />}</header>
}

function Progress({ step }: { step: number }) {
  return <div className="progress" aria-label={`Paso ${step} de 3`}><span style={{ width: `${step * 33.33}%` }} /></div>
}

function Choice({ selected, children, onClick }: { selected: boolean; children: React.ReactNode; onClick: () => void }) {
  return <button className={`choice ${selected ? 'choice--selected' : ''}`} onClick={onClick}><span>{children}</span><i>{selected && <Icon name="check" size={16} />}</i></button>
}

function Field({ label, value, onChange, error, prefix = 'S/' }: { label: string; value: number; onChange: (v: number) => void; error?: string; prefix?: string }) {
  return <label className={`field ${error ? 'field--error' : ''}`}><span>{label}</span><div><b>{prefix}</b><input type="number" inputMode="decimal" min="0" step="0.01" value={Number.isNaN(value) ? '' : value} onChange={(e) => onChange(e.target.value === '' ? NaN : Number(e.target.value))} /></div>{error && <small>{error}</small>}</label>
}

function CostBlock({ label, cost, winner }: { label: string; cost: number; winner?: boolean }) {
  return <div className={`cost-block ${winner ? 'cost-block--winner' : ''}`}><span>{label}</span><strong>{money(cost)}</strong>{winner && <small><Icon name="check" size={14} /> Mejor costo</small>}</div>
}

function BottomNav({ screen, go }: { screen: Screen; go: (s: Screen) => void }) {
  const items: [Screen, string, string][] = [['home', 'home', 'Inicio'], ['form', 'compare', 'Comparar'], ['history', 'history', 'Historial'], ['profile', 'user', 'Perfil']]
  return <nav className="bottom-nav">{items.map(([target, icon, label]) => <button key={target} className={screen === target ? 'active' : ''} onClick={() => go(target)}><Icon name={icon} /><span>{label}</span></button>)}</nav>
}

function ModalView({ type, close, confirm }: { type: Modal; close: () => void; confirm: () => void }) {
  if (!type) return null
  const content = {
    'delete-one': ['¿Eliminar esta comparación?', 'Se quitará de tu historial y no podrás recuperarla', 'Cancelar', 'Eliminar comparación'],
    'delete-all': ['¿Borrar todo el historial?', 'Se eliminarán todas las comparaciones guardadas. Esta acción no se puede deshacer', 'Conservar historial', 'Borrar historial'],
    discard: ['¿Descartar los cambios?', 'Los ajustes que hiciste no se guardarán.', 'Seguir editando', 'Descartar cambios'],
  }[type]
  return <div className="modal-backdrop" role="presentation" onMouseDown={close}><div className="modal" role="dialog" aria-modal="true" onMouseDown={(e) => e.stopPropagation()}><button className="modal-close" onClick={close} aria-label="Cerrar"><Icon name="close" /></button><div className="modal-symbol"><Icon name={type === 'discard' ? 'info' : 'trash'} /></div><h2>{content[0]}</h2><p>{content[1]}</p><div className="modal-actions"><Button variant="secondary" onClick={close}>{content[2]}</Button><Button variant="danger" onClick={confirm}>{content[3]}</Button></div></div></div>
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('welcome')
  const [goal, setGoal] = useState('')
  const [difficulties, setDifficulties] = useState<string[]>([])
  const [comparison, setComparison] = useState<Comparison>(initialComparison)
  const [saved, setSaved] = useState<Comparison[]>([])
  const [editingAlt, setEditingAlt] = useState<'a' | 'b'>('a')
  const [modal, setModal] = useState<Modal>(null)
  const [toast, setToast] = useState('')
  const [dirty, setDirty] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    try {
      const data = JSON.parse(localStorage.getItem('ahorrabien') || '{}')
      if (data.goal) setGoal(data.goal)
      if (data.difficulties) setDifficulties(data.difficulties)
      if (data.saved) setSaved(data.saved)
    } catch { /* Persistence should never block the app. */ }
    setLoaded(true)
  }, [])
  useEffect(() => {
    if (!loaded) return
    try { localStorage.setItem('ahorrabien', JSON.stringify({ goal, difficulties, saved })) } catch { /* Ignore unavailable storage. */ }
  }, [goal, difficulties, saved, loaded])

  const aCost = calculateCost(comparison.a)
  const bCost = calculateCost(comparison.b)
  const valid = comparison.product.trim() && aCost !== null && bCost !== null
  const winner = aCost === bCost ? 'tie' : (aCost ?? 0) < (bCost ?? 0) ? 'a' : 'b'
  const difference = aCost !== null && bCost !== null ? Math.abs(aCost - bCost) : 0
  const isExample = comparison.product === 'Auriculares inalámbricos'

  const update = (patch: Partial<Comparison>) => {
    setComparison((current) => ({ ...current, ...patch }))
    setDirty(true)
  }
  const updateAlt = (key: 'a' | 'b', field: keyof Alt, value: number) => {
    setComparison((current) => ({ ...current, [key]: { ...current[key], [field]: value } }))
    setDirty(true)
  }
  const flash = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 2200)
  }
  const saveComparison = () => {
    const next = { ...comparison, date: new Date().toISOString() }
    setComparison(next)
    setSaved((items) => [next, ...items.filter((item) => item.id !== next.id)])
    setDirty(false)
    flash('Comparación guardada')
  }
  const newComparison = () => {
    setComparison(initialComparison())
    setDirty(false)
    setScreen('form')
  }
  const leaveEditor = (target: Screen) => {
    if (dirty) {
      setModal('discard')
      ;(window as Window & { discardTarget?: Screen }).discardTarget = target
    } else setScreen(target)
  }
  const go = (target: Screen) => {
    if ((screen === 'form' || screen === 'details') && dirty) leaveEditor(target)
    else if (target === 'form') newComparison()
    else setScreen(target)
  }
  const openSaved = (item: Comparison) => {
    setComparison(item)
    setDirty(false)
    setScreen('result')
  }
  const totalSavings = useMemo(() => saved.reduce((sum, item) => {
    const x = calculateCost(item.a), y = calculateCost(item.b)
    return x === null || y === null ? sum : sum + Math.abs(x - y)
  }, 0), [saved])

  const goals = ['Gastar menos en mis compras', 'Aprovechar mejor los descuentos', 'Aprender a comparar precios']
  const difficultyOptions = ['Comparar precios entre tiendas', 'Saber si un descuento realmente conviene', 'Calcular transporte y gastos extra', 'Entender los beneficios de pago']

  const welcome = <main className="welcome page-enter"><div className="welcome-top"><div className="brand"><Mark /><span>AhorraBien</span></div><span className="edition">EDICIÓN PERSONAL · S/</span></div><div className="hero-art" aria-hidden="true"><span>A</span><span>B</span><div><i /><i /></div></div><div className="welcome-copy"><p className="eyebrow">Decide con el costo real</p><h1>Tu dinero puede<br /><em>rendir más.</em></h1><p>Compara precios, descuentos y gastos extra antes de decidir.</p></div><div className="welcome-actions"><Button onClick={() => setScreen('goal')}>Empezar <Icon name="arrow" /></Button><Button variant="text" onClick={() => { setComparison(example()); setDirty(false); setScreen('demo') }}>Explorar una demostración</Button></div></main>

  const onboarding = screen === 'goal' ? <main className="onboarding page-enter"><Header title="Tu punto de partida" onBack={() => setScreen('welcome')} /><Progress step={1} /><section><p className="eyebrow">Una sola elección</p><h1>¿Qué te gustaría mejorar al comprar?</h1><div className="choices">{goals.map((item) => <Choice key={item} selected={goal === item} onClick={() => setGoal(item)}>{item}.</Choice>)}</div></section><div className="sticky-actions"><Button disabled={!goal} onClick={() => setScreen('difficulty')}>Continuar <Icon name="arrow" /></Button></div></main> :
  screen === 'difficulty' ? <main className="onboarding page-enter"><Header title="Tu punto de partida" onBack={() => setScreen('goal')} /><Progress step={2} /><section><p className="eyebrow">Puedes elegir varias</p><h1>¿Qué suele hacer más difícil elegir?</h1><div className="choices">{difficultyOptions.map((item) => <Choice key={item} selected={difficulties.includes(item)} onClick={() => setDifficulties((all) => all.includes(item) ? all.filter((x) => x !== item) : [...all, item])}>{item}.</Choice>)}</div></section><div className="sticky-actions"><Button onClick={() => setScreen('demo')}>Continuar <Icon name="arrow" /></Button><Button variant="text" onClick={() => setScreen('goal')}>Volver</Button></div></main> : null

  const demo = <main className="demo page-enter"><Header title="Cómo funciona" onBack={() => setScreen(goal ? 'difficulty' : 'welcome')} /><Progress step={3} /><section><p className="eyebrow">Ejemplo ilustrativo</p><h1>Dos precios parecidos pueden terminar costando diferente.</h1><div className="demo-comparison"><div><span>Alternativa A</span><strong>S/ 100</strong><small>+ S/ 4 transporte</small></div><div className="versus">VS</div><div><span>Alternativa B</span><strong>S/ 95</strong><small>+ S/ 2 transporte</small></div></div><p className="explanation">El precio final depende del descuento aplicable, los beneficios de pago y los costos adicionales.</p></section><div className="sticky-actions"><Button onClick={() => { setComparison(example()); setDirty(false); setScreen('form') }}>Probar comparación <Icon name="arrow" /></Button></div></main>

  const home = <main className="app-screen page-enter"><header className="app-brand"><div><Mark compact /><strong>AhorraBien</strong></div><button className="avatar" onClick={() => setScreen('profile')} aria-label="Abrir perfil"><Icon name="user" /></button></header><section className="home-hero"><p className="eyebrow">Hola, compara con calma</p><h1>Compra mejor,<br /><em>no solo más barato.</em></h1><p>Compara el costo real antes de decidir.</p><Button onClick={newComparison} icon="plus">Nueva comparación</Button></section>{saved.length ? <section className="home-section"><div className="section-title"><span>Tu actividad</span><small>Ahorro potencial acumulado: {money(totalSavings)}</small></div><button className="last-comparison" onClick={() => openSaved(saved[0])}><div><small>ÚLTIMA COMPARACIÓN</small><strong>{saved[0].product}</strong></div><span>{money(Math.min(calculateCost(saved[0].a)!, calculateCost(saved[0].b)!))}<Icon name="arrow" /></span></button></section> : <section className="empty"><div className="empty-lines"><i /><i /><i /></div><strong>Tu primera decisión empieza aquí</strong><p>Aún no guardaste comparaciones. Crea una y revisa el costo real.</p></section>}<aside className="tip"><span>01</span><div><small>CONSEJO PRÁCTICO</small><p>Suma el transporte antes de dejarte llevar por un descuento.</p></div></aside></main>

  const priceError = (alt: Alt) => !Number.isFinite(alt.price) || alt.price <= 0 ? 'Ingresa un precio mayor que cero.' : undefined
  const form = <main className="app-screen page-enter"><Header title="Nueva comparación" onBack={() => leaveEditor('home')} /><section className="form-intro"><p className="eyebrow">Paso 1 de 2</p><h1>¿Qué alternativas quieres comparar?</h1><p>Usa montos reales o modifica el ejemplo ilustrativo.</p></section><section className="form-card"><label className="text-field"><span>Nombre del producto</span><input value={comparison.product} onChange={(e) => update({ product: e.target.value })} placeholder="Ej. Auriculares inalámbricos" /></label><div className="price-grid"><Field label="Alternativa A" value={comparison.a.price} onChange={(v) => updateAlt('a', 'price', v)} error={priceError(comparison.a)} /><Field label="Alternativa B" value={comparison.b.price} onChange={(v) => updateAlt('b', 'price', v)} error={priceError(comparison.b)} /></div></section><section className="optional"><div><p className="eyebrow">Detalles opcionales</p><p>Agrega descuentos, beneficios y gastos para una comparación precisa.</p></div>{(['a', 'b'] as const).map((key) => <button key={key} onClick={() => { setEditingAlt(key); setScreen('details') }}><span><b>{key.toUpperCase()}</b> Detalles de alternativa {key.toUpperCase()}</span><Icon name="arrow" /></button>)}</section><div className="form-action"><Button disabled={!comparison.product.trim() || !!priceError(comparison.a) || !!priceError(comparison.b)} onClick={() => setScreen('result')}>Comparar costos reales</Button></div></main>

  const alt = comparison[editingAlt]
  const altCost = calculateCost(alt)
  const details = <main className="app-screen page-enter"><Header title={`Alternativa ${editingAlt.toUpperCase()}`} onBack={() => setModal('discard')} /><section className="detail-total"><span>Costo actualizado</span><strong>{altCost === null ? '—' : money(altCost)}</strong><small>El cashback posterior no reduce este importe.</small></section><section className="detail-fields"><Field label="Precio original" value={alt.price} onChange={(v) => updateAlt(editingAlt, 'price', v)} error={priceError(alt)} /><Field label="Descuento inmediato" value={alt.discount} onChange={(v) => updateAlt(editingAlt, 'discount', v)} /><Field label="Beneficio inmediato de pago" value={alt.benefit} onChange={(v) => updateAlt(editingAlt, 'benefit', v)} error={alt.discount + alt.benefit > alt.price ? 'Descuentos y beneficios superan el precio.' : undefined} /><Field label="Transporte" value={alt.transport} onChange={(v) => updateAlt(editingAlt, 'transport', v)} /><Field label="Otros gastos" value={alt.extras} onChange={(v) => updateAlt(editingAlt, 'extras', v)} /><Field label="Cashback posterior (referencial)" value={alt.cashback} onChange={(v) => updateAlt(editingAlt, 'cashback', v)} /></section><div className="form-action double"><Button variant="secondary" onClick={() => setModal('discard')}>Cancelar</Button><Button disabled={altCost === null} onClick={() => { setDirty(true); setScreen('form') }}>Guardar cambios</Button></div></main>

  const Breakdown = ({ side, data, cost }: { side: string; data: Alt; cost: number }) => <div className="breakdown"><div className="breakdown-title"><strong>Alternativa {side}</strong><span>{money(cost)}</span></div><dl><div><dt>Precio original</dt><dd>{money(data.price)}</dd></div><div><dt>Descuento inmediato</dt><dd>− {money(data.discount)}</dd></div><div><dt>Beneficio de pago</dt><dd>− {money(data.benefit)}</dd></div><div><dt>Transporte</dt><dd>+ {money(data.transport)}</dd></div><div><dt>Otros gastos</dt><dd>+ {money(data.extras)}</dd></div>{data.cashback > 0 && <div className="cashback"><dt>Cashback posterior</dt><dd>{money(data.cashback)} aparte</dd></div>}</dl></div>
  const result = valid ? <main className="app-screen result page-enter"><Header title="Resultado" onBack={() => setScreen('form')} action={<button className="icon-button" onClick={() => setScreen('learn')} aria-label="Aprender"><Icon name="info" /></button>} /><section className="result-head">{isExample && <div className="illustrative">DATOS ILUSTRATIVOS</div>}<p className="eyebrow">{comparison.product}</p><h1>{winner === 'tie' ? 'Ambas cuestan lo mismo.' : <>Puedes pagar <em>{money(difference)} menos.</em></>}</h1><div className="costs"><CostBlock label="Alternativa A" cost={aCost!} winner={winner === 'a'} /><CostBlock label="Alternativa B" cost={bCost!} winner={winner === 'b'} /></div><div className="verdict"><span>{winner === 'tie' ? '=' : winner.toUpperCase()}</span><p>{winner === 'tie' ? 'Hay un empate. Compara garantía, calidad o facilidad de devolución.' : `Te conviene la alternativa ${winner.toUpperCase()}. Su costo final es ${money(difference)} más bajo según los datos ingresados.`}</p></div></section><section className="breakdowns"><div className="section-title"><span>Cómo llegamos al resultado</span><small>Desglose transparente</small></div><Breakdown side="A" data={comparison.a} cost={aCost!} /><Breakdown side="B" data={comparison.b} cost={bCost!} /></section><div className="result-actions"><Button onClick={saveComparison}>Guardar comparación</Button><Button variant="secondary" onClick={() => setScreen('form')}>Editar comparación</Button><Button variant="text" onClick={newComparison}>Nueva comparación</Button>{saved.some((x) => x.id === comparison.id) && <Button variant="text" onClick={() => setModal('delete-one')}>Eliminar del historial</Button>}</div></main> : <main className="app-screen"><Header title="Resultado" onBack={() => setScreen('form')} /><section className="empty"><strong>No podemos calcular todavía</strong><p>Revisa los precios y asegúrate de que los descuentos no superen el precio original.</p><Button onClick={() => setScreen('form')}>Revisar datos</Button></section></main>

  const learn = <main className="app-screen learning page-enter"><Header title="Aprendizaje" onBack={() => setScreen('result')} /><div className="lesson-number">01</div><section><p className="eyebrow">Un minuto para comprar mejor</p><h1>¿Un descuento del <em>20 %</em> siempre es mejor?</h1><p className="lead">No necesariamente. Compara el precio final y suma los gastos adicionales. Un descuento mayor puede no compensar un precio inicial elevado o un transporte más caro.</p><div className="mini-example"><div><span>Precio</span><strong>S/ 120</strong></div><b>−20 %</b><div><span>Con envío</span><strong>S/ 106</strong></div></div><Button onClick={() => setScreen('result')}>Volver a la comparación</Button></section></main>

  const history = <main className="app-screen page-enter"><Header title="Tus comparaciones" /><section className="history-head"><p className="eyebrow">Decisiones guardadas</p><h1>Tu historial,<br /><em>con números claros.</em></h1></section>{saved.length ? <section className="history-list">{saved.map((item, index) => { const x = calculateCost(item.a)!, y = calculateCost(item.b)!, win = x === y ? 'Empate' : x < y ? 'A' : 'B'; return <button key={item.id} onClick={() => openSaved(item)}><span className="history-index">{String(index + 1).padStart(2, '0')}</span><div><strong>{item.product}</strong><small>{new Date(item.date).toLocaleDateString('es-PE', { day: 'numeric', month: 'short', year: 'numeric' })} · Resultado: {win}</small><p>A {money(x)} <i /> B {money(y)}</p></div><span className="history-diff">{x === y ? 'Empate' : `${money(Math.abs(x-y))} menos`}<Icon name="arrow" size={16} /></span></button>})}</section> : <section className="empty history-empty"><div className="empty-lines"><i /><i /><i /></div><strong>Aún no hay comparaciones</strong><p>Las que guardes aparecerán aquí para que puedas volver a revisarlas.</p><Button onClick={newComparison}>Crear la primera</Button></section>}</main>

  const profile = <main className="app-screen page-enter"><Header title="Perfil" /><section className="profile-head"><div className="profile-mark"><Mark /></div><div><p className="eyebrow">Tus preferencias</p><h1>Compra a tu manera.</h1></div></section><section className="settings"><div><small>OBJETIVO SELECCIONADO</small><strong>{goal || 'Aún no seleccionado'}</strong><button onClick={() => setScreen('goal')}>Cambiar</button></div><div><small>MONEDA</small><strong>Soles peruanos (S/)</strong></div><details><summary>Cómo se calculan los costos <Icon name="plus" /></summary><p>Precio original menos descuentos y beneficios inmediatos, más transporte y otros gastos. El cashback posterior se muestra por separado.</p></details><details><summary>Información de privacidad <Icon name="plus" /></summary><p>Tus preferencias e historial se guardan solo en este dispositivo. No solicitamos información bancaria ni datos personales.</p></details>{saved.length > 0 && <Button variant="danger" onClick={() => setModal('delete-all')} icon="trash">Eliminar historial</Button>}</section></main>

  const content = screen === 'welcome' ? welcome : screen === 'goal' || screen === 'difficulty' ? onboarding : screen === 'demo' ? demo : screen === 'home' ? home : screen === 'form' ? form : screen === 'details' ? details : screen === 'result' ? result : screen === 'learn' ? learn : screen === 'history' ? history : profile
  const showNav = ['home', 'form', 'history', 'profile'].includes(screen)

  return <div className="app-shell"><div className="phone">{content}{showNav && <BottomNav screen={screen} go={go} />}{toast && <div className="toast"><Icon name="check" />{toast}</div>}<ModalView type={modal} close={() => setModal(null)} confirm={() => {
    if (modal === 'delete-all') { setSaved([]); flash('Historial eliminado') }
    if (modal === 'delete-one') { setSaved((all) => all.filter((x) => x.id !== comparison.id)); setScreen('history'); flash('Comparación eliminada') }
    if (modal === 'discard') { setDirty(false); setScreen((window as Window & { discardTarget?: Screen }).discardTarget || 'form') }
    setModal(null)
  }} /></div></div>
}
