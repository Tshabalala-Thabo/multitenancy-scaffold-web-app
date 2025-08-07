import useSWR from 'swr'
import axios from '@/lib/axios'
import { useEffect } from 'react'
import { Organisation } from '@/types/organisation'
import { Role, Permissions } from '@/types/roles-and-permissions'
import { useParams, useRouter } from 'next/navigation'

// Types
export interface User {
    id: number
    name: string
    last_name: string
    roles: Role[]
    permissions: Permissions[]
    tenant_id?: number
    organisations: Pick<Organisation, 'id' | 'name' | 'logo_url'>[]
    email: string
    email_verified_at: string | null
    created_at: string
    updated_at: string
}

interface ValidationErrors {
    [key: string]: string[]
}

interface AuthProps {
    middleware?: 'auth' | 'guest'
    redirectIfAuthenticated?: string
}

interface RegisterProps {
    setErrors: (errors: ValidationErrors) => void
    name: string
    last_name: string
    email: string
    password: string
    password_confirmation: string
}

interface LoginProps {
    setErrors: (errors: ValidationErrors) => void
    setStatus: (status: string | null) => void
    email: string
    password: string
    remember?: boolean
}

interface ForgotPasswordProps {
    setErrors: (errors: ValidationErrors) => void
    setStatus: (status: string | null) => void
    email: string
}

interface ResetPasswordProps {
    setErrors: (errors: ValidationErrors) => void
    setStatus: (status: string | null) => void
    email: string
    password: string
    password_confirmation: string
}

interface ResendEmailVerificationProps {
    setStatus: (status: string) => void
}

interface UseAuthReturn {
    user: User | undefined
    register: (props: RegisterProps) => Promise<void>
    login: (props: LoginProps) => Promise<void>
    forgotPassword: (props: ForgotPasswordProps) => Promise<void>
    resetPassword: (props: ResetPasswordProps) => Promise<void>
    resendEmailVerification: (props: ResendEmailVerificationProps) => void
    logout: () => Promise<void>
    mutate: () => Promise<any>
}

export const useAuth = ({ middleware, redirectIfAuthenticated }: AuthProps = {}): UseAuthReturn => {
    const router = useRouter()
    const params = useParams()

    const { data: user, error, mutate } = useSWR<User>('/api/user', () =>
        axios
            .get('/api/user')
            .then(res => res.data)
            .catch(error => {
                if (error.response.status !== 409) throw error

                router.push('/verify-email')
            }),
    )

    const csrf = (): Promise<any> => axios.get('/sanctum/csrf-cookie')

    const register = async ({ setErrors, ...props }: RegisterProps): Promise<void> => {
        await csrf()

        setErrors({})

        try {
            await axios.post('/register', props)
            mutate()
        } catch (error: any) {
            if (error.response.status !== 422) throw error

            setErrors(error.response.data.errors)
        }
    }

    const login = async ({ setErrors, setStatus, ...props }: LoginProps): Promise<void> => {
        await csrf()

        setErrors({})
        setStatus(null)

        try {
            await axios.post('/login', props)
            mutate()
        } catch (error: any) {
            if (error.response.status !== 422) throw error

            setErrors(error.response.data.errors)
        }
    }

    const forgotPassword = async ({ setErrors, setStatus, email }: ForgotPasswordProps): Promise<void> => {
        await csrf()

        setErrors({})
        setStatus(null)

        try {
            const response = await axios.post('/forgot-password', { email })
            setStatus(response.data.status)
        } catch (error: any) {
            if (error.response.status !== 422) throw error

            setErrors(error.response.data.errors)
        }
    }

    const resetPassword = async ({ setErrors, setStatus, ...props }: ResetPasswordProps): Promise<void> => {
        await csrf()

        setErrors({})
        setStatus(null)

        try {
            const response = await axios.post('/reset-password', {
                token: params.token,
                ...props
            })
            router.push('/login?reset=' + btoa(response.data.status))
        } catch (error: any) {
            if (error.response.status !== 422) throw error

            setErrors(error.response.data.errors)
        }
    }

    const resendEmailVerification = ({ setStatus }: ResendEmailVerificationProps): void => {
        axios
            .post('/email/verification-notification')
            .then(response => setStatus(response.data.status))
    }

    const logout = async (): Promise<void> => {
        if (!error) {
            await axios.post('/logout').then(() => mutate())
        }

        window.location.pathname = '/login'
    }

    useEffect(() => {
        if (middleware === 'guest' && redirectIfAuthenticated && user)
            router.push(redirectIfAuthenticated)

        if (middleware === 'auth' && (user && !user.email_verified_at))
            router.push('/verify-email')

        if (
            window.location.pathname === '/verify-email' &&
            user?.email_verified_at
        )
            router.push(redirectIfAuthenticated || '/dashboard')

        if (middleware === 'auth' && error) logout()
    }, [user, error, middleware, redirectIfAuthenticated, router])

    return {
        user,
        register,
        login,
        forgotPassword,
        resetPassword,
        resendEmailVerification,
        logout,
        mutate
    }
}
