'use client'

import Button from '@/components/Button'
import Input from '@/components/Input'
import InputError from '@/components/InputError'
import Label from '@/components/Label'
import { useAuth } from '@/hooks/auth'
import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import AuthSessionStatus from '@/app/(auth)/AuthSessionStatus'
import React from 'react'

interface ValidationErrors {
    [key: string]: string[]
}

const PasswordReset = (): React.ReactElement => {
    const searchParams = useSearchParams()

    const { resetPassword } = useAuth({ middleware: 'guest' })

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirmation, setPasswordConfirmation] = useState('')
    const [errors, setErrors] = useState<ValidationErrors>({})
    const [status, setStatus] = useState<string | null>(null)

    const submitForm = (event: FormEvent) => {
        event.preventDefault()

        resetPassword({
            email,
            password,
            password_confirmation: passwordConfirmation,
            setErrors,
            setStatus,
        })
    }

    useEffect(() => {
        const emailParam = searchParams.get('email')
        if (emailParam) {
            setEmail(emailParam)
        }
    }, [searchParams])

    return (
        <>
            {/* Session Status */}
            <AuthSessionStatus className="mb-4" status={status} />

            <form onSubmit={submitForm}>
                {/* Email Address */}
                <div>
                    <Label className="" htmlFor="email">Email</Label>

                    <Input
                        id="email"
                        type="email"
                        value={email}
                        className="block mt-1 w-full"
                        onChange={(event: ChangeEvent<HTMLInputElement>) => setEmail(event.target.value)}
                        required
                        autoFocus
                    />

                    <InputError messages={errors.email || []} className="mt-2" />
                </div>

                {/* Password */}
                <div className="mt-4">
                    <Label className="" htmlFor="password">Password</Label>
                    <Input
                        id="password"
                        type="password"
                        value={password}
                        className="block mt-1 w-full"
                        onChange={(event: ChangeEvent<HTMLInputElement>) => setPassword(event.target.value)}
                        required
                    />

                    <InputError
                        messages={errors.password || []}
                        className="mt-2"
                    />
                </div>

                {/* Confirm Password */}
                <div className="mt-4">
                    <Label className="" htmlFor="passwordConfirmation">
                        Confirm Password
                    </Label>

                    <Input
                        id="passwordConfirmation"
                        type="password"
                        value={passwordConfirmation}
                        className="block mt-1 w-full"
                        onChange={(event: ChangeEvent<HTMLInputElement>) =>
                            setPasswordConfirmation(event.target.value)
                        }
                        required
                    />

                    <InputError
                        messages={errors.password_confirmation || []}
                        className="mt-2"
                    />
                </div>

                <div className="flex items-center justify-end mt-4">
                    <Button className="">Reset Password</Button>
                </div>
            </form>
        </>
    )
}

export default PasswordReset