const currency = new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' })
const shortDate = new Intl.DateTimeFormat('es-PE', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
})

/** Formatea un monto en soles: 12.5 → "S/ 12.50". */
export const money = (value: number) => currency.format(value)

export const formatShortDate = (iso: string) => shortDate.format(new Date(iso))
