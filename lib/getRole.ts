import { createClient } from '@/lib/supabase/server'

export async function getRole() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()
  return (data?.role as 'admin' | 'technician') ?? null
}