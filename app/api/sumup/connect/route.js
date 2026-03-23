import { NextResponse } from 'next/server'

export async function GET() {
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: process.env.SUMUP_CLIENT_ID,
    redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/sumup/callback`,
    scope: 'transactions.history me',
  })
  return NextResponse.redirect(`https://api.sumup.com/authorize?${params}`)
}
