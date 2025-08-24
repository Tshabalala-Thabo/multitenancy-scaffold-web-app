import { User } from '@/hooks/auth'

type BanUser = Pick<User, 'id' | 'name' | 'last_name' | 'email'>

export interface Ban {
    id: number
    reason: string | null
    banned_at: string
    user: BanUser
    banned_by: BanUser
}
