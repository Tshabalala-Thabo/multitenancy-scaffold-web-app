import { useState } from 'react'
import axios from '@/lib/axios'
import { useRouter } from 'next/navigation'
import { useToast } from './use-toast'
export const useOrganisationUser = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const { toast } = useToast()
    const router = useRouter()

    const joinOrganisation = async (organisationId: string) => {
        setIsLoading(true)
        setError(null)

        try {
            const response = await axios.post(`/api/tenants/${organisationId}/join`)

            toast({
                title: 'Success!',
                description: 'You have successfully joined the organization.',
                variant: 'default',
            })

            // Refresh the page to show the updated organization list
            router.refresh()

            return response.data
        } catch (err: any) {
            const errorMessage =
                err.response?.data?.message || 'Failed to join organization'

            toast({
                title: 'Error',
                description: errorMessage,
                variant: 'destructive',
            })


            //throw new Error(errorMessage)
        } finally {
            setIsLoading(false)
        }
    }

    return {
        joinOrganisation,
        isLoading,
        error,
    }
}

export default useOrganisationUser
