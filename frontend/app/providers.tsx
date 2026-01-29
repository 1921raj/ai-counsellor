'use client';

import { GoogleOAuthProvider } from '@react-oauth/google';

export function Providers({ children }: { children: React.ReactNode }) {
    // NOTE: Replace with your actual Google Client ID or set NEXT_PUBLIC_GOOGLE_CLIENT_ID in .env.local
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "603527817862-hr6a8po12p97cv62f0q71ob5kmh93qiu.apps.googleusercontent.com";

    return (
        <GoogleOAuthProvider clientId={clientId}>
            {children}
        </GoogleOAuthProvider>
    );
}
