import { createClient } from '@supabase/supabase-js'

const SUBJECTS = new Set([
  'Inscription',
  'Randonnée',
  'Gym',
  'Marche nordique',
  'Séjour',
  'Autre',
])

function clean(value, maxLength) {
  return String(value ?? '').trim().replace(/\s+/g, ' ').slice(0, maxLength)
}

function jsonError(message, status = 400) {
  return Response.json({ ok: false, error: message }, { status })
}

export async function POST(request) {
  let payload

  try {
    payload = await request.json()
  } catch {
    return jsonError('Requête invalide.')
  }

  if (payload.website) {
    return Response.json({ ok: true })
  }

  const prenom = clean(payload.prenom, 80)
  const nom = clean(payload.nom, 80)
  const email = clean(payload.email, 160).toLowerCase()
  const sujet = clean(payload.sujet, 60)
  const message = String(payload.message ?? '').trim().slice(0, 3000)

  if (!prenom || !nom || !email || !message) {
    return jsonError('Merci de compléter tous les champs obligatoires.')
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return jsonError('Merci de saisir une adresse email valide.')
  }

  if (!SUBJECTS.has(sujet)) {
    return jsonError('Merci de choisir un sujet valide.')
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    return jsonError('Configuration Supabase manquante.', 500)
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })

  const { error } = await supabase.from('contact_messages').insert({
    prenom,
    nom,
    email,
    sujet,
    message,
    source: 'site_web',
    user_agent: request.headers.get('user-agent') ?? null,
  })

  if (error) {
    return jsonError("Le message n'a pas pu être envoyé. Réessayez dans un instant.", 500)
  }

  return Response.json({ ok: true })
}
