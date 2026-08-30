'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function AdminGuard({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === '/admin/login';

  // 'checking' | 'ok' | 'unauthenticated' | 'unauthorized'
  const [state, setState] = useState(isLoginPage ? 'ok' : 'checking');

  useEffect(() => {
    if (isLoginPage) return;

    let cancelled = false;

    async function check() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        if (!cancelled) {
          setState('unauthenticated');
          router.replace('/admin/login');
        }
        return;
      }

      // RLS policy "self_check_admin_status" lets a logged-in user check
      // only their own row — this can't be used to enumerate other admins.
      const { data: adminRow } = await supabase
        .from('admins')
        .select('user_id')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (cancelled) return;
      setState(adminRow ? 'ok' : 'unauthorized');
    }

    check();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session && !isLoginPage) {
        router.replace('/admin/login');
      }
    });

    return () => {
      cancelled = true;
      listener.subscription.unsubscribe();
    };
  }, [isLoginPage, pathname, router]);

  if (isLoginPage) return children;

  if (state === 'checking' || state === 'unauthenticated') {
    return (
      <div className="admin-content">
        <p className="admin-sub">Checking your session…</p>
      </div>
    );
  }

  if (state === 'unauthorized') {
    return (
      <div className="admin-content">
        <h1 className="admin-h1">Not authorized</h1>
        <p className="admin-sub">
          You&apos;re logged in, but this account isn&apos;t set up as a salon admin yet.
          Ask whoever manages the Supabase project to add your user to the <code>admins</code> table.
        </p>
        <button
          className="admin-btn"
          onClick={async () => {
            await supabase.auth.signOut();
            router.replace('/admin/login');
          }}
        >
          Sign out
        </button>
      </div>
    );
  }

  return children;
}
