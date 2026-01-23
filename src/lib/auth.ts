// ============================================
// NEXT-AUTH CONFIGURATION
// ============================================
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';

// Demo users for development (in production, use database)
const DEMO_USERS = [
    {
        id: '1',
        email: 'admin@sellast.com',
        password: '$2a$10$K8C5K8C5K8C5K8C5K8C5KeG8G8G8G8G8G8G8G8G8G8G8G8G8G8', // admin123
        name: 'Administrador',
        role: 'admin'
    },
    {
        id: '2',
        email: 'gerente@sellast.com',
        password: '$2a$10$K8C5K8C5K8C5K8C5K8C5KeG8G8G8G8G8G8G8G8G8G8G8G8G8G8', // gerente123
        name: 'Gerente',
        role: 'gerente'
    },
    {
        id: '3',
        email: 'cajero@sellast.com',
        password: '$2a$10$K8C5K8C5K8C5K8C5K8C5KeG8G8G8G8G8G8G8G8G8G8G8G8G8G8', // cajero123
        name: 'Cajero',
        role: 'cajero'
    }
];

// For demo, allow any password in development
const DEMO_PASSWORD = 'demo123';

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            name: 'credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                const email = (credentials.email as string).toLowerCase().trim();
                const password = (credentials.password as string).trim();

                // Find user (case-insensitive email)
                const user = DEMO_USERS.find(u => u.email.toLowerCase() === email);

                if (!user) {
                    return null;
                }

                // Accept any of the demo passwords
                const validPasswords = ['demo123', 'admin123', 'gerente123', 'cajero123'];
                if (!validPasswords.includes(password)) {
                    return null;
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role
                };
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = (user as any).role;
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).role = token.role;
                (session.user as any).id = token.id;
            }
            return session;
        }
    },
    pages: {
        signIn: '/auth',
        error: '/auth'
    },
    session: {
        strategy: 'jwt',
        maxAge: 24 * 60 * 60 // 24 hours
    },
    debug: process.env.NODE_ENV === 'development',
    trustHost: true,
    secret: process.env.NEXTAUTH_SECRET || 'sellast-secret-key-change-in-production'
});
