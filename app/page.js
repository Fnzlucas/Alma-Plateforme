import { createServerSupabase } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { readFileSync } from 'fs'
import { join } from 'path'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const supabase = createServerSupabase()
  const { data: { session } } = await supabase.auth.getSession()
  if (session) redirect('/dashboard')
  const html = readFileSync(join(process.cwd(), 'public', 'alma-co-landing.html'), 'utf8')
  return <div dangerouslySetInnerHTML={{ __html: html }} />
}
