import AdminLayout from '@/components/admin/layout/AdminLayout'
import { ThemeProvider } from '@/components/theme-provider'

export const metadata = {
  title: 'Admin Dashboard - Sepaktakraw Federation',
  description: 'Admin panel for managing Sepaktakraw Federation content',
}

export default function AdminRootLayout({ children }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <AdminLayout>{children}</AdminLayout>
    </ThemeProvider>
  )
}
