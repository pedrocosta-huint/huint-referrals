import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase, TERMS_VERSION } from '../supabase'

export default function Onboarding({ profile, onDone }) {
  const [name, setName] = useState(profile.full_name || '')
  const [accept, setAccept] = useState(false)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  async function submit(e) {
    e.preventDefault(); setBusy(true); setErr('')
    const { error } = await supabase.from('profiles').update({
      full_name: name.trim(), terms_version: TERMS_VERSION, terms_accepted_at: new Date().toISOString(),
    }).eq('id', profile.id)
    setBusy(false)
    if (error) setErr('Não foi possível guardar. Tente novamente.'); else onDone()
  }

  return (
    <section className="card narrow">
      <p className="eyebrow">Bem-vindo</p>
      <h1>Só falta o seu nome</h1>
      <form onSubmit={submit} className="stack">
        <label>Nome completo
          <input required minLength={2} maxLength={120} value={name} onChange={e => setName(e.target.value)} autoFocus />
        </label>
        <label className="check">
          <input type="checkbox" required checked={accept} onChange={e => setAccept(e.target.checked)} />
          <span>Li e aceito os <Link to="/termos" target="_blank">Termos do programa</Link> e o <Link to="/privacidade" target="_blank">Aviso de privacidade</Link>.</span>
        </label>
        {err && <div className="notice err">{err}</div>}
        <button className="btn" disabled={busy}>Continuar</button>
      </form>
    </section>
  )
}
