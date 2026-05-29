import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'
import { createClient } from '@/lib/supabase-server'

export async function POST(req) {
  // Vérifier que l'appelant est super_admin
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const { data: profile } = await supabase
    .from('admin_profiles').select('role').eq('email', user.email).maybeSingle()
  if (profile?.role !== 'super_admin')
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })

  const { email, display_name, role, permissions, password } = await req.json()
  if (!email?.trim())    return NextResponse.json({ error: 'Email requis' },           { status: 400 })
  if (!password?.trim()) return NextResponse.json({ error: 'Mot de passe requis' },    { status: 400 })
  if (password.length < 8) return NextResponse.json({ error: 'Mot de passe trop court (8 car. min)' }, { status: 400 })

  const admin = createAdminClient()

  // Créer le compte Auth directement (pas d'email d'invitation)
  const { data: created, error: createErr } = await admin.auth.admin.createUser({
    email:          email.trim().toLowerCase(),
    password,
    email_confirm:  true,   // pas de confirmation email
  })

  if (createErr) return NextResponse.json({ error: createErr.message }, { status: 400 })

  // Créer le profil admin
  const { error: profileErr } = await admin.from('admin_profiles').upsert({
    email:        email.trim().toLowerCase(),
    display_name: display_name?.trim() || null,
    role:         role ?? 'admin',
    permissions:  role === 'super_admin' ? [] : (permissions ?? []),
  }, { onConflict: 'email' })

  if (profileErr) return NextResponse.json({ error: profileErr.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}
