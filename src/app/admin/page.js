import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import AdminApp from './AdminApp'

export const metadata = { title: "Administration — AGMR" }

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  return <AdminApp user={user}/>
}
