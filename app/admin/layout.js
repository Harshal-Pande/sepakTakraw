import AdminLayout from '@/components/admin/layout/AdminLayout'

export const metadata = {
  title: 'Admin Dashboard - Sepaktakraw Federation',
  description: 'Admin panel for managing Sepaktakraw Federation content',
}

export default function AdminRootLayout({ children }) {
  return <AdminLayout>{children}</AdminLayout>
}
