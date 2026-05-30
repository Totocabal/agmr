import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'
import { createClient } from '@/lib/supabase-server'

const ALLOWED_TABLES = new Set([
  'home_blocks', 'gym_page_blocks', 'rando_page_blocks', 'nordique_page_blocks',
  'sante_page_blocks', 'asso_page_blocks',
  'gym_courses', 'vacances_scolaires', 'rando_sorties', 'rando_jeudi_groupes',
  'gym_disciplines', 'gym_animateurs',
  'actualites', 'sejours', 'galerie_photos', 'ag_documents',
  'bureau', 'tarifs', 'site_stats',
  'admin_profiles', 'contact_messages', 'activity_log',
])

export async function POST(request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const { data: profile } = await supabase
    .from('admin_profiles').select('role').eq('email', user.email).maybeSingle()
  if (profile?.role !== 'super_admin')
    return NextResponse.json({ error: 'Réservé aux super_admin' }, { status: 403 })

  const body = await request.json()

  // body peut être { data, tables } ou { storagePath, tables }
  let backupData = body.data
  const selectedTables = body.tables // tableau de noms de tables à restaurer (null = toutes)

  // Si on restaure depuis Storage
  if (!backupData && body.storagePath) {
    const admin = createAdminClient()
    const { data: fileData, error } = await admin.storage
      .from('backups')
      .download(body.storagePath)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    const text = await fileData.text()
    try {
      const parsed = JSON.parse(text)
      backupData = parsed.data
    } catch {
      return NextResponse.json({ error: 'Fichier JSON invalide' }, { status: 400 })
    }
  }

  if (!backupData || typeof backupData !== 'object') {
    return NextResponse.json({ error: 'Données de sauvegarde manquantes' }, { status: 400 })
  }

  const admin = createAdminClient()
  const results = {}
  const tablesToRestore = selectedTables
    ? selectedTables.filter(t => ALLOWED_TABLES.has(t))
    : Object.keys(backupData).filter(t => ALLOWED_TABLES.has(t))

  for (const table of tablesToRestore) {
    const rows = backupData[table]
    if (!Array.isArray(rows)) { results[table] = { skipped: true }; continue }

    // Supprimer toutes les lignes existantes puis insérer
    const { error: delErr } = await admin.from(table).delete().neq('id', '00000000-0000-0000-0000-000000000000')
    if (delErr) { results[table] = { error: delErr.message }; continue }

    if (rows.length > 0) {
      const { error: insErr } = await admin.from(table).insert(rows)
      results[table] = insErr ? { error: insErr.message } : { restored: rows.length }
    } else {
      results[table] = { restored: 0 }
    }
  }

  return NextResponse.json({ ok: true, results })
}
