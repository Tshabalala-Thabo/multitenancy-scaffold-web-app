'use client'

import Button from '@/components/Button'
import Input from '@/components/Input'
import InputError from '@/components/InputError'
import Label from '@/components/Label'
import { useAuth } from '@/hooks/auth'
import { ChangeEvent, FormEvent, useState } from 'react'
import AuthSessionStatus from '@/app/(auth)/AuthSessionStatus'
import React from 'react'

interface ValidationErrors {
    [key: string]: string[]
}

const Page = (): React.ReactElement => {
    const { forgotPassword } = useAuth({
        middleware: 'guest',
        redirectIfAuthenticated: '/dashboard',
    })

    const [email, setEmail] = useState('')
    const [errors, setErrors] = useState<ValidationErrors>({})
    const [status, setStatus] = useState<string | null>(null)

    const submitForm = (event: FormEvent) => {
        event.preventDefault()

        forgotPassword({ email, setErrors, setStatus })
    }

    return (
        <>
            <div className="mb-4 text-sm text-gray-600">
                Forgot your password? No problem. Just let us know your email
                address and we will email you a password reset link that
                will allow you to choose a new one.
            </div>

            {/* Session Status */}
            <AuthSessionStatus className="mb-4" status={status} />

            <form onSubmit={submitForm}>
                {/* Email Address */}
                <div>
                    <Label className="" htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        name="email"
                        value={email}
                        className="block mt-1 w-full"
                        onChange={(event: ChangeEvent<HTMLInputElement>) => setEmail(event.target.value)}
                        required
                        autoFocus
                    />

                    <InputError messages={errors.email || []} className="mt-2" />
                </div>

                <div className="flex items-center justify-end mt-4">
                    <Button className="">Email Password Reset Link</Button>
                </div>
            </form>
        </>
    )
}

export default Page