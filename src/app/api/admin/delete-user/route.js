import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'
import { createClient } from '@/lib/supabase-server'

// Seul ce compte peut supprimer d'autres super admins
const MASTER_EMAIL = 'tho.chevalier@gmail.com'

export async function POST(req) {
  // Vérifier que l'appelant est super_admin
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const { data: callerProfile } = await supabase
    .from('admin_profiles').select('role').eq('email', user.email).maybeSingle()
  if (callerProfile?.role !== 'super_admin')
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })

  const { targetEmail } = await req.json()
  if (!targetEmail) return NextResponse.json({ error: 'Email cible requis' }, { status: 400 })

  const admin = createAdminClient()

  // Vérifier le rôle de la cible
  const { data: targetProfile } = await admin
    .from('admin_profiles').select('role').eq('email', targetEmail).maybeSingle()

  // Protection : un super admin ne peut pas supprimer un autre super admin
  // sauf tho.chevalier@gmail.com qui peut tout supprimer
  if (targetProfile?.role === 'super_admin' && user.email !== MASTER_EMAIL) {
    return NextResponse.json(
      { error: 'Impossible de supprimer un super administrateur.' },
      { status: 403 }
    )
  }

  // 1. Supprimer le profil admin
  await admin.from('admin_profiles').delete().eq('email', targetEmail)

  // 2. Trouver et supprimer le compte Supabase Auth
  const { data: { users }, error: listErr } = await admin.auth.admin.listUsers({ perPage: 1000 })
  if (listErr) return NextResponse.json({ error: listErr.message }, { status: 500 })

  const authUser = users.find(u => u.email === targetEmail.toLowerCase())
  if (authUser) {
    const { error: delErr } = await admin.auth.admin.deleteUser(authUser.id)
    if (delErr) return NextResponse.json({ error: delErr.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
