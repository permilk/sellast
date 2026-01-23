// ============================================
// STORE REDIRECT - Alias for /tienda
// ============================================
// This page redirects to /tienda for users who navigate to /store

import { redirect } from 'next/navigation';

export default function StorePage() {
    redirect('/tienda');
}
