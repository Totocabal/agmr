import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'
import { createClient } from '@/lib/supabase-server'

export async function POST(req) {
  // Vérifier que l'appelant est bien super_admin
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const { data: profile } = await supabase
    .from('admin_profiles')
    .select('role')
    .eq('email', user.email)
    .maybeSingle()

  if (profile?.role !== 'super_admin') {
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
  }

  const { email, display_name, role, permissions } = await req.json()
  if (!email?.trim()) return NextResponse.json({ error: 'Email requis' }, { status: 400 })

  const admin = createAdminClient()

  // 1. Envoyer l'invitation Supabase Auth (l'utilisateur reçoit un mail pour définir son mot de passe)
  const { data: invite, error: inviteErr } = await admin.auth.admin.inviteUserByEmail(
    email.trim().toLowerCase(),
    { redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://agmr.vercel.app'}/admin` }
  )

  if (inviteErr) {
    // Si l'utilisateur existe déjà dans Auth, ce n'est pas bloquant
    if (!inviteErr.message?.includes('already')) {
      return NextResponse.json({ error: inviteErr.message }, { status: 400 })
    }
  }

  // 2. Créer / mettre à jour le profil admin
  const { error: profileErr } = await admin
    .from('admin_profiles')
    .upsert({
      email:        email.trim().toLowerCase(),
      display_name: display_name?.trim() || null,
      role:         role ?? 'admin',
      permissions:  role === 'super_admin' ? [] : (permissions ?? []),
    }, { onConflict: 'email' })

  if (profileErr) {
    return NextResponse.json({ error: profileErr.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
