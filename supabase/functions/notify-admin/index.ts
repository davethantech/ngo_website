import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  try {
    const { record } = await req.json()

    // Read email config from system_settings table
    // SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are auto-injected by Supabase
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    const { data: settingsRow, error: settingsErr } = await supabase
      .from('system_settings')
      .select('value')
      .eq('key', 'email_config')
      .single()

    if (settingsErr || !settingsRow) {
      console.warn('No email_config found in system_settings, skipping.')
      return new Response(JSON.stringify({ skipped: true }), { status: 200 })
    }

    const config = settingsRow.value
    if (!config.enabled || !config.resend_api_key || !config.admin_email) {
      console.warn('Email notifications not configured or disabled, skipping.')
      return new Response(JSON.stringify({ skipped: true }), { status: 200 })
    }

    const fromAddress = config.from_email || 'onboarding@resend.dev'
    const fromName = config.from_name || 'LOF Command Center'
    const from = fromAddress.includes('@resend.dev')
      ? `${fromName} <${fromAddress}>`
      : `${fromName} <${fromAddress}>`

    // Build the email HTML
    const html = `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;background:#f9f9f9;border-radius:12px;overflow:hidden;">
        <div style="background:#10B981;padding:24px 32px;">
          <h1 style="color:#fff;margin:0;font-size:20px;">📬 New Inquiry — Layeni Ogunmakinwa Foundation</h1>
        </div>
        <div style="padding:32px;">
          <p style="color:#555;margin-bottom:24px;">A new contact form submission has been received.</p>
          <table style="width:100%;border-collapse:collapse;">
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #eee;color:#888;width:140px;font-size:13px;">Full Name</td>
              <td style="padding:10px 0;border-bottom:1px solid #eee;color:#111;font-size:13px;font-weight:600">${record.full_name}</td>
            </tr>
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #eee;color:#888;font-size:13px;">Email</td>
              <td style="padding:10px 0;border-bottom:1px solid #eee;color:#111;font-size:13px;">${record.email}</td>
            </tr>
            ${record.phone ? `<tr>
              <td style="padding:10px 0;border-bottom:1px solid #eee;color:#888;font-size:13px;">Phone</td>
              <td style="padding:10px 0;border-bottom:1px solid #eee;color:#111;font-size:13px;">${record.phone}</td>
            </tr>` : ''}
            ${record.subject ? `<tr>
              <td style="padding:10px 0;border-bottom:1px solid #eee;color:#888;font-size:13px;">Subject</td>
              <td style="padding:10px 0;border-bottom:1px solid #eee;color:#111;font-size:13px;">${record.subject}</td>
            </tr>` : ''}
            <tr>
              <td style="padding:10px 0;color:#888;font-size:13px;vertical-align:top;">Message</td>
              <td style="padding:10px 0;color:#111;font-size:13px;line-height:1.6;">${record.message || '—'}</td>
            </tr>
          </table>
          <div style="margin-top:32px;">
            <a href="${Deno.env.get('SITE_URL') || 'https://localhost:5173'}/admin/inbox"
               style="background:#10B981;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">
              View in Command Center →
            </a>
          </div>
          <p style="color:#aaa;font-size:11px;margin-top:24px;">
            Received: ${new Date(record.created_at).toLocaleString('en-GB', { timeZone: 'Africa/Lagos' })} WAT
          </p>
        </div>
      </div>
    `

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.resend_api_key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [config.admin_email],
        subject: `📬 New Inquiry from ${record.full_name}`,
        html,
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      throw new Error(`Resend API error: ${err}`)
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 })
  } catch (err: any) {
    console.error('notify-admin error:', err)
    return new Response(JSON.stringify({ error: err.message }), { status: 500 })
  }
})
