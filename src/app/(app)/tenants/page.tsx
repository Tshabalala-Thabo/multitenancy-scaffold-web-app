import React from 'react';
import Header from '@/app/(app)/Header';

export const metadata = {
    title: 'Tenants',
};

const Dashboard: React.FC = () => {
    return (
        <>
            <Header title="Tenants" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            Tenants page
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Dashboard