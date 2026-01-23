// ============================================
// ROOT PAGE - REDIRECT TO AUTH
// ============================================
// For MVP, the login page is the main entry point
// The store/tienda will be added in a future phase

import { redirect } from 'next/navigation';

export default function RootPage() {
    redirect('/auth');
}
