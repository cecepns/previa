import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar, { MobileMenuButton } from './Sidebar';

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-slate-200 bg-white px-4 py-3 lg:px-6">
          <MobileMenuButton onClick={() => setSidebarOpen(true)} />
          <h1 className="text-lg font-semibold text-slate-800">PREVIA Admin</h1>
        </header>

        <main className="flex-1 p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
