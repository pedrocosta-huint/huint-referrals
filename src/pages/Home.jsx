import { useEffect, useState } from 'react'
import { supabase, STATUS, eur, date } from '../supabase'

const empty = { contact_name: '', contact_email: '', company: '', challenge: '', contact_agreed: false, no_conflict: false }

export default function Home({ profile }) {
  const [f, setF] = useState(empty)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState(null)
  const [list, setList] = useState([])

  const load = async () => {
    const { data } = await supabase.from('referrals')
      .select('id, contact_name, company, status, commission_amount, created_at, expires_at')
      .eq('referrer_id', profile.id).order('created_at', { ascending: false })
    setList(data || [])
  }
  useEffect(() => { load() }, [])

  const set = (k) => (e) => setF({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value })

  async function submit(e) {
    e.preventDefault(); setBusy(true); setMsg(null)
    const { error } = await supabase.from('referrals').insert({
      contact_name: f.contact_name.trim(), contact_email: f.contact_email.trim(), company: f.company.trim(),
      challenge: f.challenge.trim(), contact_agreed: f.contact_agreed, no_conflict: f.no_conflict,
    })
    setBusy(false)
    if (error) {
      setMsg({ t: 'err', m: error.code === '23505'
        ? 'Este contacto já foi indicado e está em acompanhamento. Obrigado!'
        : 'Não foi possível enviar a indicação. Verifique os dados e tente novamente.' })
    } else {
      setF(empty); setMsg({ t: 'ok', m: 'Indicação recebida. Vamos contactar a pessoa nos próximos dias e pode acompanhar o estado abaixo.' }); load()
    }
  }

  return (
    <>
      <section className="card">
        <p className="eyebrow">Olá, {profile.full_name.split(' ')[0]}</p>
        <h1>Nova indicação</h1>
        <form onSubmit={submit} className="grid">
          <label>Nome do contacto
            <input required minLength={2} maxLength={120} value={f.contact_name} onChange={set('contact_name')} />
          </label>
          <label>Email profissional
            <input type="email" required maxLength={200} value={f.contact_email} onChange={set('contact_email')} />
          </label>
          <label className="full">Empresa
            <input required minLength={2} maxLength={160} value={f.company} onChange={set('company')} />
          </label>
          <label className="full">Qual é o desafio, numa ou duas frases?
            <textarea required minLength={5} maxLength={600} rows={3} value={f.challenge} onChange={set('challenge')}
              placeholder="Ex.: querem automatizar o apoio ao cliente, mas não sabem por onde começar." />
            <span className="hint">Não inclua informação confidencial da empresa.</span>
          </label>
          <label className="check full">
            <input type="checkbox" required checked={f.contact_agreed} onChange={set('contact_agreed')} />
            <span>Falei com esta pessoa e ela <strong>aceitou ser contactada pela Huint</strong>, sabendo que fui eu que a indiquei.</span>
          </label>
          <label className="check full">
            <input type="checkbox" required checked={f.no_conflict} onChange={set('no_conflict')} />
            <span>Não trabalho nesta empresa nem tenho influência na decisão de contratar a Huint.</span>
          </label>
          {msg && <div className={`notice ${msg.t} full`}>{msg.m}</div>}
          <div className="full"><button className="btn" disabled={busy}>{busy ? 'A enviar…' : 'Enviar indicação'}</button></div>
        </form>
      </section>

      <section className="card">
        <h2>As minhas indicações</h2>
        {list.length === 0 ? <p className="muted">Ainda não fez nenhuma indicação.</p> : (
          <div className="table-wrap"><table>
            <thead><tr><th>Contacto</th><th>Empresa</th><th>Estado</th><th>Comissão</th><th>Data</th></tr></thead>
            <tbody>{list.map(r => (
              <tr key={r.id}>
                <td>{r.contact_name}</td><td>{r.company}</td>
                <td><span className={`pill s-${r.status}`}>{STATUS[r.status]}</span></td>
                <td>{r.commission_amount > 0 ? eur(r.commission_amount) : '—'}</td>
                <td>{date(r.created_at)}</td>
              </tr>))}
            </tbody>
          </table></div>
        )}
      </section>
    </>
  )
}
