/**
 * Enregistre une entrée dans activity_log.
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 * @param {{ message: string, section: string, action: 'create'|'update'|'delete' }} opts
 */
export async function logActivity(supabase, { message, section, action }) {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('activity_log').insert({
      message,
      user_email: user?.email ?? null,
      section,
      action,
    })
  } catch {
    // Ne jamais bloquer l'action principale si le log échoue
  }
}

/**
 * Formate un timestamp en label relatif (il y a 2h, hier, 12/04…)
 */
export function relativeTime(isoString) {
  if (!isoString) return ''
  const date = new Date(isoString)
  const now  = new Date()
  const diffMs  = now - date
  const diffMin = Math.floor(diffMs / 60000)
  const diffH   = Math.floor(diffMs / 3600000)
  const diffD   = Math.floor(diffMs / 86400000)

  if (diffMin < 1)  return 'à l\'instant'
  if (diffMin < 60) return `il y a ${diffMin} min`
  if (diffH   < 24) return `il y a ${diffH}h`
  if (diffD   === 1) return 'hier'
  if (diffD   < 7)  return `il y a ${diffD} jours`

  const d = date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })
  return d
}
