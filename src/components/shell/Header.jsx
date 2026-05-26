'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import AGMRLogo from '@/components/ui/AGMRLogo'
import Icon from '@/components/ui/Icon'

export default function Header() {
  const pathname = usePathname()

  const items = [
    { id: "home", label: "Accueil", href: "/" },
    { id: "activites", label: "Activités", group: ["/activites"], drop: [
      { href: "/activites/gym", label: "Gymnastique", meta: "10 disciplines · 43h/semaine" },
      { href: "/activites/randonnee", label: "Randonnée", meta: "5 groupes · jeudi et dimanche" },
      { href: "/activites/nordique", label: "Marche nordique", meta: "Mardi et samedi · bâtons fournis" },
      { href: "/activites/sante", label: "Santé par le sport", meta: "Prescri'Forme · Rando-Santé" },
    ]},
    { id: "planning", label: "Planning", group: ["/planning"], drop: [
      { href: "/planning/gym", label: "Planning Gym", meta: "Grille hebdomadaire" },
      { href: "/planning/randonnee", label: "Planning Rando & Nordique", meta: "Sorties à venir" },
    ]},
    { id: "actu", label: "Actualités", group: ["/actualites"], drop: [
      { href: "/actualites", label: "Annonces & infos", meta: "Toutes les actus" },
      { href: "/actualites/sejours", label: "Séjours & sorties", meta: "Programme saison" },
      { href: "/actualites/galerie", label: "Galerie photos", meta: "Souvenirs en images" },
    ]},
    { id: "asso", label: "L'association", group: ["/association"], drop: [
      { href: "/association", label: "Présentation", meta: "Histoire & gouvernance" },
      { href: "/association/comite-directeur", label: "Comité directeur", meta: "Bureau & animateurs" },
      { href: "/association/assemblee-generale", label: "Assemblée générale", meta: "Documents officiels" },
    ]},
    { id: "contact", label: "Contact", href: "/contact" },
  ]

  const isActive = (item) => {
    if (item.href) return pathname === item.href
    if (item.group) return item.group.some(g => pathname.startsWith(g))
    return false
  }

  return (
    <header className="header">
      <div className="header-inner">
        <Link className="logo-link" href="/">
          <AGMRLogo size={52}/>
        </Link>
        <nav className="nav" aria-label="Navigation principale">
          {items.map(it => it.drop ? (
            <div key={it.id} className="nav-item-drop">
              <button className={`nav-item ${isActive(it) ? "active" : ""}`}>
                {it.label} <Icon name="chevronDown" size={12}/>
              </button>
              <div className="nav-drop" role="menu">
                {it.drop.map(d => (
                  <Link key={d.href} href={d.href}>
                    <strong>{d.label}</strong>
                    <span className="nav-drop-meta">{d.meta}</span>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <Link key={it.id} className={`nav-item ${isActive(it) ? "active" : ""}`} href={it.href}>
              {it.label}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <Link className="btn btn-ghost btn-sm" href="/espace-adherents">
            <Icon name="user" size={15}/> Adhérents
          </Link>
          <Link className="btn btn-primary btn-sm" href="/inscriptions">
            S&apos;inscrire
          </Link>
        </div>
      </div>
    </header>
  )
}
