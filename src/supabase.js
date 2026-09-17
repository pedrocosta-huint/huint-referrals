import { createClient } from '@supabase/supabase-js'
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
)
export const TERMS_VERSION = '2026-09'
export const STATUS = {
  nova: 'Nova', contactada: 'Contactada', proposta: 'Proposta enviada', ganha: 'Contrato assinado',
  perdida: 'Não avançou', comissao_paga: 'Comissão paga', expirada: 'Expirada',
}
export const eur = (v) => v == null ? '—' : new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(v)
export const date = (v) => new Date(v).toLocaleDateString('pt-PT')
