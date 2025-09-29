/* Minimal Render Cron Job script
 * - Calls NEXT_API_URL
 * - Logs response
 * - Sends acknowledgment email via SMTP (Nodemailer) on success
 * - Reads all credentials from environment variables
 * - Exits 0 on success, 1 on failure
 */

import nodemailer from 'nodemailer'
import { fetch } from 'undici'

async function sendEmail({ host, port, user, pass, from, to, subject, text, html }) {
  const transporter = nodemailer.createTransport({
    host,
    port: Number(port) || 587,
    secure: String(port) === '465',
    auth: { user, pass },
  })

  const info = await transporter.sendMail({ from, to, subject, text, html })
  return info
}

async function fetchWithTimeout(url, options = {}, ms = 20000) {
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), ms)
  try {
    const res = await fetch(url, { ...options, signal: controller.signal })
    return res
  } finally {
    clearTimeout(id)
  }
}

async function main() {
  const {
    NEXT_API_URL,
    NEXT_API_KEY,
    SMTP_HOST,
    SMTP_PORT,
    SMTP_USER,
    SMTP_PASS,
    TO_EMAIL,
    FROM_EMAIL,
  } = process.env

  if (!NEXT_API_URL) throw new Error('Missing env: NEXT_API_URL')
  if (!SMTP_HOST) throw new Error('Missing env: SMTP_HOST')
  if (!SMTP_USER) throw new Error('Missing env: SMTP_USER')
  if (!SMTP_PASS) throw new Error('Missing env: SMTP_PASS')
  if (!TO_EMAIL) throw new Error('Missing env: TO_EMAIL')
  if (!FROM_EMAIL) throw new Error('Missing env: FROM_EMAIL')

  const headers = { 'Content-Type': 'application/json' }
  if (NEXT_API_KEY) headers['x-api-key'] = NEXT_API_KEY

  console.log(`[cron] Pinging: ${NEXT_API_URL}`)
  const response = await fetchWithTimeout(NEXT_API_URL, { method: 'GET', headers }, 20000)
  const contentType = response.headers.get('content-type') || ''
  const body = contentType.includes('application/json') ? await response.json() : await response.text()

  console.log('[cron] Status:', response.status)
  console.log('[cron] Body:', body)

  if (!response.ok) {
    throw new Error(`Upstream returned HTTP ${response.status}`)
  }

  const subject = `Cron OK: ${new Date().toISOString()}`
  const text = `Pinged ${NEXT_API_URL} successfully. Status: ${response.status}. Body: ${typeof body === 'string' ? body : JSON.stringify(body)}`
  const html = `<p>Pinged <code>${NEXT_API_URL}</code> successfully.</p><p>Status: <b>${response.status}</b></p><pre>${
    typeof body === 'string' ? body : JSON.stringify(body, null, 2)
  }</pre>`

  const info = await sendEmail({
    host: SMTP_HOST,
    port: SMTP_PORT,
    user: SMTP_USER,
    pass: SMTP_PASS,
    from: FROM_EMAIL,
    to: TO_EMAIL,
    subject,
    text,
    html,
  })

  console.log('[cron] Email sent:', info && info.messageId)
}

main()
  .then(() => {
    console.log('[cron] Done')
    process.exit(0)
  })
  .catch((err) => {
    console.error('[cron] Error:', err && (err.stack || err.message || err))
    process.exit(1)
  })


