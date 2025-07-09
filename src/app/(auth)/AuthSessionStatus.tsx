import React from 'react'

interface AuthSessionStatusProps {
    status: string | null
    className?: string
    [key: string]: any
}

const AuthSessionStatus = ({ status, className, ...props }: AuthSessionStatusProps): React.ReactElement => (
    <>
        {status && (
            <div
                className={`${className} font-medium text-sm text-green-600`}
                {...props}>
                {status}
            </div>
        )}
    </>
)

export default AuthSessionStatus