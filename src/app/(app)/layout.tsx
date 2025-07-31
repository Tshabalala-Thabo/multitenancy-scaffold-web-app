'use client'

import React from 'react';
import { useAuth } from '@/hooks/auth';
import Navigation from '@/app/(app)/Navigation';
import Loading from '@/app/(app)/Loading';
import { Toaster } from "@/components/ui/toaster"

interface AppLayoutProps {
    children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
    const { user } = useAuth({ middleware: 'auth' });

    if (!user) {
        return <Loading />
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <Navigation user={user} />

            <main>
                {children}
                <Toaster />
            </main>
        </div>
    )
}

export default AppLayout
