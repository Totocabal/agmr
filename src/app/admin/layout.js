import { HelpProvider } from '@/lib/help-context'

export const metadata = { title: "Administration — AGMR" }

export default function AdminLayout({ children }) {
  return <HelpProvider>{children}</HelpProvider>
}
