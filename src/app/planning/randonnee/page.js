import Header from '@/components/shell/Header'
import Footer from '@/components/shell/Footer'
import PlanningRandoClient from './PlanningRandoClient'

export const metadata = { title: 'Planning Rando & Nordique — AGMR' }

export default function PlanningRandoPage() {
  return (
    <div className="page-shell">
      <Header/>
      <main className="page-main">
        <div className="page-header">
          <div className="container">
            <div className="crumb">Accueil / Planning / Rando & Nordique</div>
            <div className="page-header-eyebrow">Planning · Saison 2025-2026</div>
            <h1>Planning Rando & Nordique</h1>
            <p className="page-header-lede">Calendrier des sorties randonnée (jeudi et dimanche) et des séances de marche nordique (mardi et samedi).</p>
          </div>
        </div>
        <PlanningRandoClient/>
      </main>
      <Footer/>
    </div>
  )
}
