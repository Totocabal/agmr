import { getResend } from '@/lib/resend'

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

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
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

  const apiKey = process.env.RESEND_API_KEY
  const to = process.env.CONTACT_TO_EMAIL || 'tho.chevalier@gmail.com'
  const from = process.env.RESEND_FROM_EMAIL || 'AGMR <onboarding@resend.dev>'

  if (!apiKey) {
    return jsonError('Configuration Resend manquante.', 500)
  }

  const fullName = `${prenom} ${nom}`
  const emailSubject = `[AGMR] ${sujet} - ${fullName}`
  const text = [
    `Nouveau message depuis le formulaire de contact AGMR`,
    '',
    `Prénom : ${prenom}`,
    `Nom : ${nom}`,
    `Email : ${email}`,
    `Sujet : ${sujet}`,
    '',
    'Message :',
    message,
  ].join('\n')
  const html = `
    <div style="font-family: Arial, sans-serif; color: #1a2317; line-height: 1.5;">
      <h1 style="font-size: 20px; margin: 0 0 16px;">Nouveau message AGMR</h1>
      <p><strong>Prénom :</strong> ${escapeHtml(prenom)}</p>
      <p><strong>Nom :</strong> ${escapeHtml(nom)}</p>
      <p><strong>Email :</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
      <p><strong>Sujet :</strong> ${escapeHtml(sujet)}</p>
      <hr style="border: 0; border-top: 1px solid #ddd2b8; margin: 20px 0;" />
      <p style="white-space: pre-line;">${escapeHtml(message)}</p>
    </div>
  `

  const { data, error } = await getResend().emails.send({
    from,
    to,
    replyTo: email,
    subject: emailSubject,
    text,
    html,
  })

  if (error) {
    return jsonError(error.message || "Le message n'a pas pu être envoyé. Réessayez dans un instant.", 500)
  }

  return Response.json({ ok: true, id: data?.id ?? null })
}
