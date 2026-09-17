import { useEffect, useState, useCallback } from 'react'
import { Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom'
import { supabase } from './supabase'
import Login from './pages/Login'
import Onboarding from './pages/Onboarding'
import Home from './pages/Home'
import Admin from './pages/Admin'
import { Terms, Privacy } from './pages/Legal'

export default function App() {
  const [session, setSession] = useState(undefined)
  const [profile, setProfile] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)

  const loadProfile = useCallback(async (s) => {
    if (!s) { setProfile(null); setIsAdmin(false); return }
    const [{ data: p }, { data: a }] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', s.user.id).maybeSingle(),
      supabase.rpc('is_admin'),
    ])
    setProfile(p); setIsAdmin(!!a)
  }, [])

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); loadProfile(data.session) })
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => { setSession(s); loadProfile(s) })
    return () => sub.subscription.unsubscribe()
  }, [loadProfile])

  if (session === undefined || (session && !profile)) return <Shell><p className="muted">A carregar…</p></Shell>

  const needsOnboarding = session && profile && (!profile.full_name || !profile.terms_accepted_at)

  return (
    <Shell session={session} isAdmin={isAdmin}>
      <Routes>
        <Route path="/termos" element={<Terms />} />
        <Route path="/privacidade" element={<Privacy />} />
        <Route path="/entrar" element={session ? <Navigate to="/" /> : <Login />} />
        <Route path="/admin" element={!session ? <Navigate to="/entrar" /> : isAdmin ? <Admin /> : <NoAccess email={session.user.email} />} />
        <Route path="/" element={
          !session ? <Navigate to="/entrar" /> :
          needsOnboarding ? <Onboarding profile={profile} onDone={() => loadProfile(session)} /> :
          <Home profile={profile} />
        } />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Shell>
  )
}

function NoAccess({ email }) {
  return (
    <section className="card narrow">
      <p className="eyebrow">Área de gestão</p>
      <h1>Sem acesso</h1>
      <p className="lead">A sessão atual é <strong>{email}</strong> e este email não está na lista de administradores da Huint. Saia e entre com o email autorizado.</p>
      <Link className="btn" to="/">Voltar às minhas indicações</Link>
    </section>
  )
}

function Shell({ children, session, isAdmin }) {
  const nav = useNavigate()
  return (
    <div className="app">
      <header className="top">
        <Link to="/" className="brand">huint<sup>®</sup> <span className="brand-sub">Indicações</span></Link>
        {session && (
          <nav>
            <span className="who">{session.user.email}</span>
            {isAdmin && <Link to="/admin">Gestão</Link>}
            <button className="link" onClick={async () => { await supabase.auth.signOut(); nav('/entrar') }}>Sair</button>
          </nav>
        )}
      </header>
      <main>{children}</main>
      <footer className="foot">
        <span>© Huint</span>
        <Link to="/termos">Termos do programa</Link>
        <Link to="/privacidade">Privacidade</Link>
      </footer>
    </div>
  )
}
