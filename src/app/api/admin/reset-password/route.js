import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'
import { createClient } from '@/lib/supabase-server'

export async function POST(req) {
  // Vérifier que l'appelant est super_admin
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

  const { targetEmail, newPassword } = await req.json()
  if (!targetEmail || !newPassword) {
    return NextResponse.json({ error: 'Email et mot de passe requis' }, { status: 400 })
  }
  if (newPassword.length < 8) {
    return NextResponse.json({ error: 'Mot de passe trop court (8 caractères minimum)' }, { status: 400 })
  }

  const admin = createAdminClient()

  // Vérifier que la cible n'est pas super_admin (protection)
  const { data: targetProfile } = await admin
    .from('admin_profiles')
    .select('role')
    .eq('email', targetEmail)
    .maybeSingle()

  if (targetProfile?.role === 'super_admin') {
    return NextResponse.json({ error: 'Impossible de modifier le mot de passe d\'un super admin' }, { status: 403 })
  }

  // Trouver l'utilisateur Supabase Auth par email
  const { data: { users }, error: listErr } = await admin.auth.admin.listUsers()
  if (listErr) return NextResponse.json({ error: listErr.message }, { status: 500 })

  const target = users.find(u => u.email === targetEmail.toLowerCase())
  if (!target) {
    return NextResponse.json({ error: 'Utilisateur introuvable dans Auth' }, { status: 404 })
  }

  // Modifier le mot de passe
  const { error: updateErr } = await admin.auth.admin.updateUserById(target.id, { password: newPassword })
  if (updateErr) return NextResponse.json({ error: updateErr.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}
