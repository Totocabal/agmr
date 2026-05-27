import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

function unauthorized() {
  return Response.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
}

export async function GET(request) {
  const cronSecret = process.env.CRON_SECRET
  const authHeader = request.headers.get('authorization')

  if (!cronSecret) {
    return Response.json(
      { ok: false, error: 'CRON_SECRET is not configured' },
      { status: 500 }
    )
  }

  if (authHeader !== `Bearer ${cronSecret}`) {
    return unauthorized()
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    return Response.json(
      { ok: false, error: 'Supabase environment variables are missing' },
      { status: 500 }
    )
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })

  const { count, error } = await supabase
    .from('site_stats')
    .select('id', { count: 'exact', head: true })

  if (error) {
    return Response.json(
      { ok: false, error: error.message },
      { status: 500 }
    )
  }

  return Response.json({
    ok: true,
    checkedAt: new Date().toISOString(),
    table: 'site_stats',
    count,
  })
}
