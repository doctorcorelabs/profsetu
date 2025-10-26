import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { AdminHeader } from './AdminHeader'

export const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <AdminHeader />
          <main className="flex-1 p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}

