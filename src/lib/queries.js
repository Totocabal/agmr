import { supabase } from './supabase'

export async function getGymCourses() {
  const { data, error } = await supabase
    .from('gym_courses')
    .select('*')
    .eq('actif', true)
    .order('jour')
  if (error) { console.error(error); return [] }
  return data.map(c => ({
    id: c.id,
    jour: c.jour,
    heureDebut: c.heure_debut,
    heureFin: c.heure_fin,
    discipline: c.discipline,
    animateur: c.animateur,
    salle: c.salle,
    niveau: c.niveau,
    actif: c.actif,
    disc: c.disc,
  }))
}

export async function getRandoSorties() {
  const { data, error } = await supabase
    .from('rando_sorties')
    .select('*')
    .order('date')
  if (error) { console.error(error); return [] }
  return data.map(s => ({
    id: s.id,
    date: s.date,
    type: s.type,
    titre: s.titre,
    distanceKm: s.distance_km,
    denivele: s.denivele,
    groupes: s.groupes || [],
    pointDepart: s.point_depart,
    heureDepart: s.heure_depart,
    animateur: s.animateur,
    complet: s.complet,
    annule: s.annule,
  }))
}

export async function getActualites() {
  const { data, error } = await supabase
    .from('actualites')
    .select('*')
    .order('date', { ascending: false })
  if (error) { console.error(error); return [] }
  return data.map(n => ({
    id: n.id,
    cat: n.cat,
    date: n.date,
    title: n.title,
    excerpt: n.excerpt,
  }))
}

export async function getSejours() {
  const { data, error } = await supabase
    .from('sejours')
    .select('*')
    .order('created_at')
  if (error) { console.error(error); return [] }
  return data.map(s => ({
    id: s.id,
    titre: s.titre,
    dates: s.dates,
    transport: s.transport,
    statut: s.statut,
    description: s.description,
    img: s.img,
  }))
}

export async function getBureau() {
  const { data, error } = await supabase
    .from('bureau')
    .select('*')
    .order('ordre')
  if (error) { console.error(error); return [] }
  return data.map(b => ({
    id: b.id,
    nom: b.nom,
    role: b.role,
  }))
}
