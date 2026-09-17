import { useState } from 'react'
import { supabase } from '../supabase'

export default function Login() {
  const [email, setEmail] = useState('')
  const [state, setState] = useState('idle')
  const [err, setErr] = useState('')

  async function submit(e) {
    e.preventDefault(); setState('sending'); setErr('')
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(), options: { emailRedirectTo: window.location.origin + '/' },
    })
    if (error) { setErr('Não foi possível enviar o link. Tente novamente dentro de alguns minutos.'); setState('idle') }
    else setState('sent')
  }

  return (
    <section className="card narrow">
      <p className="eyebrow">Programa de Indicações</p>
      <h1>Conhece uma empresa que precisa de IA a sério?</h1>
      <p className="lead">Apresente-nos. Se a indicação resultar num contrato, recebe <strong>10% do valor</strong>.</p>
      {state === 'sent' ? (
        <div className="notice ok">Enviámos um link de acesso para <strong>{email}</strong>. Abra o email neste dispositivo para entrar.</div>
      ) : (
        <form onSubmit={submit} className="stack">
          <label>O seu email
            <input type="email" required autoFocus value={email} onChange={e => setEmail(e.target.value)} placeholder="nome@empresa.pt" />
          </label>
          {err && <div className="notice err">{err}</div>}
          <button className="btn" disabled={state === 'sending'}>{state === 'sending' ? 'A enviar…' : 'Receber link de acesso'}</button>
          <p className="small muted">Sem password. Enviamos-lhe um link seguro por email.</p>
        </form>
      )}
      <ol className="steps">
        <li><strong>Fale com o contacto</strong> e confirme que aceita ser contactado pela Huint.</li>
        <li><strong>Indique-o aqui</strong> em menos de um minuto.</li>
        <li><strong>Acompanhe</strong> o estado e receba 10% se houver contrato.</li>
      </ol>
    </section>
  )
}
