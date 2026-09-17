import { useEffect, useMemo, useState } from 'react'
import { supabase, STATUS, eur, date } from '../supabase'

export default function Admin() {
  const [rows, setRows] = useState([])
  const [filter, setFilter] = useState('ativas')
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(null)

  const load = async () => {
    const { data } = await supabase.from('referrals')
      .select('*, referrer:profiles(full_name, email)').order('created_at', { ascending: false })
    setRows(data || [])
  }
  useEffect(() => { load() }, [])

  const shown = useMemo(() => rows.filter(r => {
    if (filter === 'ativas' && !['nova', 'contactada', 'proposta', 'ganha'].includes(r.status)) return false
    if (filter !== 'ativas' && filter !== 'todas' && r.status !== filter) return false
    const s = q.toLowerCase()
    return !s || [r.contact_name, r.contact_email, r.company, r.referrer?.full_name, r.referrer?.email].some(v => v?.toLowerCase().includes(s))
  }), [rows, filter, q])

  const kpi = useMemo(() => ({
    total: rows.length,
    abertas: rows.filter(r => ['nova', 'contactada', 'proposta'].includes(r.status)).length,
    ganhas: rows.filter(r => ['ganha', 'comissao_paga'].includes(r.status)).length,
    porPagar: rows.filter(r => r.status === 'ganha').reduce((a, r) => a + Number(r.commission_amount || 0), 0),
  }), [rows])

  return (
    <>
      <section className="kpis">
        <div><span>Indicações</span><strong>{kpi.total}</strong></div>
        <div><span>Em aberto</span><strong>{kpi.abertas}</strong></div>
        <div><span>Contratos</span><strong>{kpi.ganhas}</strong></div>
        <div><span>Comissões por pagar</span><strong>{eur(kpi.porPagar)}</strong></div>
      </section>
      <section className="card">
        <div className="toolbar">
          <h2>Gestão de indicações</h2>
          <input placeholder="Pesquisar…" value={q} onChange={e => setQ(e.target.value)} />
          <select value={filter} onChange={e => setFilter(e.target.value)}>
            <option value="ativas">Ativas</option><option value="todas">Todas</option>
            {Object.entries(STATUS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>
        <div className="table-wrap"><table>
          <thead><tr><th>Contacto</th><th>Empresa</th><th>Indicado por</th><th>Estado</th><th>Contrato</th><th>Comissão</th><th>Data</th></tr></thead>
          <tbody>{shown.map(r => (
            <Row key={r.id} r={r} open={open === r.id} toggle={() => setOpen(open === r.id ? null : r.id)} onSaved={load} />
          ))}</tbody>
        </table></div>
        {shown.length === 0 && <p className="muted">Sem resultados.</p>}
      </section>
    </>
  )
}

function Row({ r, open, toggle, onSaved }) {
  const [status, setStatus] = useState(r.status)
  const [value, setValue] = useState(r.contract_value ?? '')
  const [rate, setRate] = useState(Number(r.commission_rate) * 100)
  const [notes, setNotes] = useState([])
  const [note, setNote] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!open) return
    supabase.from('referral_notes').select('*').eq('referral_id', r.id).order('created_at').then(({ data }) => setNotes(data || []))
  }, [open, r.id])

  async function save() {
    setBusy(true)
    await supabase.from('referrals').update({
      status, contract_value: value === '' ? null : Number(value), commission_rate: Number(rate) / 100,
    }).eq('id', r.id)
    if (note.trim()) await supabase.from('referral_notes').insert({ referral_id: r.id, body: note.trim() })
    setNote(''); setBusy(false); onSaved()
  }

  return (
    <>
      <tr className="clickable" onClick={toggle}>
        <td>{r.contact_name}<div className="small muted">{r.contact_email}</div></td>
        <td>{r.company}</td>
        <td>{r.referrer?.full_name}<div className="small muted">{r.referrer?.email}</div></td>
        <td><span className={`pill s-${r.status}`}>{STATUS[r.status]}</span></td>
        <td>{eur(r.contract_value)}</td>
        <td>{r.commission_amount > 0 ? eur(r.commission_amount) : '—'}</td>
        <td>{date(r.created_at)}</td>
      </tr>
      {open && (
        <tr className="detail"><td colSpan={7}>
          <div className="detail-grid">
            <div>
              <p className="small muted">Desafio</p>
              <p>{r.challenge}</p>
              <p className="small muted">Válida até {date(r.expires_at)} · Consentimento do contacto e ausência de conflito declarados em {date(r.created_at)}</p>
              <a className="btn ghost" href={`mailto:${r.contact_email}?subject=${encodeURIComponent('Indicação de ' + (r.referrer?.full_name || '') + ' · Huint')}`}>Escrever ao contacto</a>
            </div>
            <div className="stack">
              <label>Estado
                <select value={status} onChange={e => setStatus(e.target.value)}>
                  {Object.entries(STATUS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </label>
              <div className="grid tight">
                <label>Valor do contrato (€, s/ IVA)<input type="number" min="0" step="0.01" value={value} onChange={e => setValue(e.target.value)} /></label>
                <label>Comissão (%)<input type="number" min="0" max="100" step="0.5" value={rate} onChange={e => setRate(e.target.value)} /></label>
              </div>
              <label>Nova nota interna<textarea rows={2} value={note} onChange={e => setNote(e.target.value)} /></label>
              <button className="btn" disabled={busy} onClick={save}>{busy ? 'A guardar…' : 'Guardar'}</button>
              {notes.length > 0 && <ul className="notes">{notes.map(n => <li key={n.id}><span className="small muted">{date(n.created_at)} · {n.author_email}</span><br />{n.body}</li>)}</ul>}
            </div>
          </div>
        </td></tr>
      )}
    </>
  )
}
