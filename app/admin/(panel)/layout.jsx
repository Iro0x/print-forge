import Nav from '@/components/Nav'
import AdminNav from '@/components/AdminNav'

export default function AdminLayout({ children }) {
  return (
    <>
      <Nav />
      <div style={{ padding: '8rem 4rem 6rem', maxWidth: '1400px', margin: '0 auto' }}>
        <AdminNav />
        {children}
      </div>
    </>
  )
}
