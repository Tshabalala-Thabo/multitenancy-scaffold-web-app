'use client'

import Button from '@/components/Button'
import Input from '@/components/Input'
import InputError from '@/components/InputError'
import Label from '@/components/Label'
import Link from 'next/link'
import { useAuth } from '@/hooks/auth'
import { ChangeEvent, FormEvent, useState } from 'react'
import React from 'react'

interface ValidationErrors {
    [key: string]: string[]
}

const Page = (): React.ReactElement => {
    const { register } = useAuth({
        middleware: 'guest',
        redirectIfAuthenticated: '/dashboard',
    })

    const [name, setName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirmation, setPasswordConfirmation] = useState('')
    const [errors, setErrors] = useState<ValidationErrors>({})

    const submitForm = (event: FormEvent) => {
        event.preventDefault()

        register({
            name,
            last_name: lastName,
            email,
            password,
            password_confirmation: passwordConfirmation,
            setErrors,
        })
    }

    return (
        <form onSubmit={submitForm}>
            {/* Name */}
            <div>
                <Label htmlFor="name">Name</Label>
                <Input
                    id="name"
                    type="text"
                    value={name}
                    data-testid="input-name"
                    className="block mt-1 w-full"
                    onChange={(event: ChangeEvent<HTMLInputElement>) => setName(event.target.value)}
                    required
                    autoFocus
                />
                <InputError messages={errors.name || []} className="mt-2" />
            </div>

            {/* Last Name */}
            <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                    id="lastName"
                    type="text"
                    value={lastName}
                    data-testid="input-last-name"
                    className="block mt-1 w-full"
                    onChange={(event: ChangeEvent<HTMLInputElement>) => setLastName(event.target.value)}
                    required
                    autoFocus
                />
                <InputError messages={errors.lastName || []} className="mt-2" />
            </div>

            {/* Email Address */}
            <div className="mt-4">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    type="email"
                    value={email}
                    data-testid="input-email"
                    className="block mt-1 w-full"
                    onChange={(event: ChangeEvent<HTMLInputElement>) => setEmail(event.target.value)}
                    required
                />
                <InputError messages={errors.email as string[] || []} className="mt-2" />
            </div>

            {/* Password */}
            <div className="mt-4">
                <Label htmlFor="password">Password</Label>
                <Input
                    id="password"
                    type="password"
                    value={password}
                    data-testid="input-password"
                    className="block mt-1 w-full"
                    onChange={(event: ChangeEvent<HTMLInputElement>) => setPassword(event.target.value)}
                    required
                    autoComplete="new-password"
                />
                <InputError messages={errors.password || []} className="mt-2" />
            </div>

            {/* Confirm Password */}
            <div className="mt-4">
                <Label htmlFor="passwordConfirmation">Confirm Password</Label>
                <Input
                    id="passwordConfirmation"
                    type="password"
                    value={passwordConfirmation}
                    data-testid="input-password-confirmation"
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
                <Link
                    href="/login"
                    className="underline text-sm text-gray-600 hover:text-gray-900">
                    Already registered?
                </Link>
                <Button className="ml-4" data-testid="register-button">Register</Button>
            </div>
        </form>
    )
}

export default Page
