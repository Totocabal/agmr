import Header from '@/components/shell/Header'
import Footer from '@/components/shell/Footer'
import PlanningGymClient from './PlanningGymClient'

export const metadata = { title: 'Planning Gym — AGMR' }

export default function PlanningGymPage() {
  return (
    <div className="page-shell">
      <Header/>
      <main className="page-main">
        <div className="page-header">
          <div className="container">
            <div className="crumb">Accueil / Planning / Gym</div>
            <div className="page-header-eyebrow">Planning · Saison 2025-2026</div>
            <h1>Planning de la Gym</h1>
            <p className="page-header-lede">43 heures de cours par semaine dans 5 salles. Pas de cours pendant les vacances scolaires.</p>
          </div>
        </div>
        <PlanningGymClient/>
      </main>
      <Footer/>
    </div>
  )
}
