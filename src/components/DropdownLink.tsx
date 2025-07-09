import React, { ReactNode, ButtonHTMLAttributes } from 'react'
import Link from 'next/link'
import { Menu } from '@headlessui/react'
import { LinkProps } from 'next/link'

interface DropdownLinkProps extends Omit<LinkProps, 'children'> {
    children: ReactNode
}

const DropdownLink: React.FC<DropdownLinkProps> = ({ children, ...props }) => (
    <Menu.Item>
        {({ active }: { active: boolean }) => (
            <Link
                {...props}
                className={`w-full text-left block px-4 py-2 text-sm leading-5 text-gray-700 ${
                    active ? 'bg-gray-100' : ''
                } focus:outline-none transition duration-150 ease-in-out`}>
                {children}
            </Link>
        )}
    </Menu.Item>
)

interface DropdownButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode
}

export const DropdownButton: React.FC<DropdownButtonProps> = ({ children, ...props }) => (
    <Menu.Item>
        {({ active }: { active: boolean }) => (
            <button
                className={`w-full text-left block px-4 py-2 text-sm leading-5 text-gray-700 ${
                    active ? 'bg-gray-100' : ''
                } focus:outline-none transition duration-150 ease-in-out`}
                {...props}>
                {children}
            </button>
        )}
    </Menu.Item>
)

export default DropdownLink