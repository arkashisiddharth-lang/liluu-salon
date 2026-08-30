'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import './admin.css';
import AdminGuard from '@/components/AdminGuard';
import { supabase } from '@/lib/supabaseClient';

function NavLink({ href, children }) {
  const pathname = usePathname();
  const active = pathname === href;
  return (
    <Link href={href} className={active ? 'active' : ''}>{children}</Link>
  );
}

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === '/admin/login';

  return (
    <div className="admin-shell">
      {!isLoginPage && (
        <div className="admin-topbar">
          <div className="brand">
            LILLU SALON
            <span>Admin Dashboard</span>
          </div>
          <nav className="admin-nav">
            <NavLink href="/admin">Dashboard</NavLink>
            <NavLink href="/admin/appointments">Appointments</NavLink>
            <NavLink href="/admin/customers">Customers</NavLink>
            <NavLink href="/admin/services">Services</NavLink>
          </nav>
          <button
            className="admin-signout"
            onClick={async () => {
              await supabase.auth.signOut();
              router.replace('/admin/login');
            }}
          >
            Sign out
          </button>
        </div>
      )}
      <AdminGuard>{children}</AdminGuard>
    </div>
  );
}
