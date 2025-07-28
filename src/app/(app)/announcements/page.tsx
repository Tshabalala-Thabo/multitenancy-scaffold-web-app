'use client'

import Header from '@/components/Header';
import { AnnouncementsListView } from './components/AnnouncementsListView';

export default function AnnouncementsPage() {

    const mockAnnouncements = [
        {
            id: 1,
            title: 'New Feature: Dark Mode',
            content: 'We are excited to announce that dark mode is now available for all users. You can enable it in your account settings.',
            created_at: '2023-03-15T10:00:00.000Z',
        },
        {
            id: 2,
            title: 'Scheduled Maintenance',
            content: 'Our platform will be undergoing scheduled maintenance on March 20th from 2:00 AM to 4:00 AM UTC. We apologize for any inconvenience.',
            created_at: '2023-03-12T14:30:00.000Z',
        },
        {
            id: 3,
            title: 'Welcome to the New and Improved Dashboard!',
            content: 'We have completely redesigned our dashboard to provide a more intuitive and user-friendly experience. We hope you enjoy it!',
            created_at: '2023-03-10T09:00:00.000Z',
        },
    ];


    return (
        <main>
            <Header title="Announcements" />
            <AnnouncementsListView
                announcements={mockAnnouncements}
            />
        </main>
    )
}
