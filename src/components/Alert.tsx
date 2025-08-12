import React from 'react'

import { InfoIcon, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react'

type AlertVariant = 'info' | 'success' | 'error' | 'warning'

interface AlertProps {
    variant?: AlertVariant
    title?: string
    description?: string
    linkText?: string
    linkHref?: string
}

const variantStyles: Record<
    AlertVariant,
    { border: string; text: string; icon: React.ReactElement }
> = {
    info: {
        border: 'border-blue-500/50',
        text: 'text-blue-600',
        icon: (
            <InfoIcon
                className="me-3 -mt-0.5 inline-flex opacity-60"
                size={16}
            />
        ),
    },
    success: {
        border: 'border-green-500/50',
        text: 'text-green-600',
        icon: (
            <CheckCircle2
                className="me-3 -mt-0.5 inline-flex opacity-60"
                size={16}
            />
        ),
    },
    error: {
        border: 'border-red-500/50',
        text: 'text-red-600',
        icon: (
            <XCircle
                className="me-3 -mt-0.5 inline-flex opacity-60"
                size={16}
            />
        ),
    },
    warning: {
        border: 'border-yellow-500/50',
        text: 'text-yellow-600',
        icon: (
            <AlertTriangle
                className="me-3 -mt-0.5 inline-flex opacity-60"
                size={16}
            />
        ),
    },
}

export default function Alert({
    variant = 'info',
    title,
    description,
    linkText,
    linkHref,
}: AlertProps) {
    const { border, text, icon } = variantStyles[variant]

    return (
        <div className={`rounded-md border px-4 py-3 ${border} ${text}`}>
            <p className="text-sm flex items-start">
                {icon}
                <span>
                    {title && <strong className="font-medium">{title}</strong>}
                    {description && (
                        <span className="block">{description}</span>
                    )}
                    {linkText && linkHref && (
                        <a
                            href={linkHref}
                            className="ml-2 underline hover:opacity-80 inline-flex items-center">
                            {linkText} →
                        </a>
                    )}
                </span>
            </p>
        </div>
    )
}

/** EXAMPLE USAGE
 * <Alert variant="warning" title="Some information is missing!" />
 * <Alert variant="error" title="An error occurred!" />
 * <Alert variant="success" title="Completed successfully!" />
 * <Alert variant="info" title="Just a quick note!" />
 * <Alert
 *   variant="error"
 *   title="Password does not meet requirements:"
 *   description="• Minimum 8 characters\n• Include a special character"
 * />
 * <Alert
 *   variant="warning"
 *   title="Some information is missing!"
 *   linkText="Link"
 *   linkHref="#"
 * />
 */
