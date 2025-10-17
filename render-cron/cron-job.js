/* Minimal Render Cron Job script
 * - Calls NEXT_API_URL
 * - Logs response
 * - Sends acknowledgment email via SMTP (Nodemailer) on success
 * - Reads all credentials from environment variables
 * - Exits 0 on success, 1 on failure
 */

import nodemailer from 'nodemailer'
import { fetch } from 'undici'
import dotenv from 'dotenv'

// Load environment variables from .env file
dotenv.config()

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

  // Parse the response to extract database health information
  let dbStats = {}
  let healthScore = 'unknown'
  
  try {
    if (typeof body === 'object' && body.data) {
      dbStats = body.data
      healthScore = body.data.health_score || 'unknown'
    }
  } catch (e) {
    console.log('Could not parse database stats:', e.message)
  }

  const websiteUrl = NEXT_API_URL.replace('/api/db-keepalive', '')
  
  const subject = `🌐 Sepaktakraw Federation - Database KeepAlive ${healthScore === 'excellent' ? '✅' : '⚠️'}: ${new Date().toISOString()}`
  const text = `🌐 SEPAKTAKRAW FEDERATION - DATABASE KEEPALIVE REPORT

📊 WEBSITE DETAILS:
Website: ${websiteUrl}
Organization: Sepaktakraw Federation of India
Purpose: Official website for national Sepaktakraw sports federation
Database: Supabase (PostgreSQL)

🔍 KEEPALIVE SUMMARY:
URL: ${NEXT_API_URL}
Status: ${response.status}
Health Score: ${healthScore}
Database Status: ${dbStats.database_status || 'unknown'}
Operations Performed: ${dbStats.total_operations || 'unknown'}
Execution Time: ${new Date().toISOString()}

📈 DATABASE STATISTICS:
• News Articles: ${dbStats.news_articles?.count || 0} (${dbStats.news_articles?.recent_items || 0} recent)
• Events: ${dbStats.events?.count || 0} (${dbStats.events?.recent_items || 0} recent)
• Results: ${dbStats.results?.count || 0} (${dbStats.results?.recent_items || 0} recent)
• General Body Members: ${dbStats.general_body?.count || 0}
• Hero Images: ${dbStats.hero_images?.count || 0} (${dbStats.hero_images?.active_images || 0} active)
• History Entries: ${dbStats.history?.count || 0}
• Contact Records: ${dbStats.contact_info?.count || 0}

⚙️ SYSTEM OPERATIONS:
System Log Created: ${dbStats.system_log_created ? 'Yes' : 'No'}
System Record Updated: ${dbStats.system_record_updated ? 'Yes' : 'No'}
Queries Executed: ${dbStats.queries_executed || 'unknown'}
Counts Executed: ${dbStats.counts_executed || 'unknown'}

💡 RECOMMENDATION:
${dbStats.recommendation || 'No recommendation'}

📋 FULL RESPONSE DATA:
${typeof body === 'string' ? body : JSON.stringify(body, null, 2)}`

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto;">
      <h2 style="color: ${healthScore === 'excellent' ? '#28a745' : '#ffc107'};">Database KeepAlive Report ${healthScore === 'excellent' ? '✅' : '⚠️'}</h2>
      
      <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 10px 0;">
        <h3>Summary</h3>
        <p><strong>URL:</strong> <code>${NEXT_API_URL}</code></p>
        <p><strong>Status:</strong> <span style="color: ${response.status === 200 ? 'green' : 'red'};">${response.status}</span></p>
        <p><strong>Health Score:</strong> <span style="color: ${healthScore === 'excellent' ? 'green' : 'orange'};">${healthScore}</span></p>
        <p><strong>Database Status:</strong> ${dbStats.database_status || 'unknown'}</p>
      </div>
      
      <div style="background: #e9ecef; padding: 15px; border-radius: 5px; margin: 10px 0;">
        <h3>Database Statistics</h3>
        <ul>
          <li>News Articles: ${dbStats.news_articles?.count || 0} (${dbStats.news_articles?.recent_items || 0} recent)</li>
          <li>Events: ${dbStats.events?.count || 0} (${dbStats.events?.recent_items || 0} recent)</li>
          <li>Results: ${dbStats.results?.count || 0} (${dbStats.results?.recent_items || 0} recent)</li>
          <li>General Body: ${dbStats.general_body?.count || 0} members</li>
          <li>Hero Images: ${dbStats.hero_images?.count || 0} (${dbStats.hero_images?.active_images || 0} active)</li>
          <li>History Entries: ${dbStats.history?.count || 0}</li>
        </ul>
      </div>
      
      <div style="background: #d1ecf1; padding: 15px; border-radius: 5px; margin: 10px 0;">
        <h3>System Operations</h3>
        <p><strong>Total Operations:</strong> ${dbStats.total_operations || 'unknown'}</p>
        <p><strong>System Log Created:</strong> ${dbStats.system_log_created ? '✅ Yes' : '❌ No'}</p>
        <p><strong>System Record Updated:</strong> ${dbStats.system_record_updated ? '✅ Yes' : '❌ No'}</p>
      </div>
      
      <div style="background: #fff3cd; padding: 15px; border-radius: 5px; margin: 10px 0;">
        <h3>Recommendation</h3>
        <p>${dbStats.recommendation || 'No recommendation provided'}</p>
      </div>
      
      <details style="margin-top: 20px;">
        <summary style="cursor: pointer; font-weight: bold;">Full Response Data</summary>
        <pre style="background: #f8f9fa; padding: 10px; border-radius: 5px; overflow-x: auto; margin-top: 10px;">${
          typeof body === 'string' ? body : JSON.stringify(body, null, 2)
        }</pre>
      </details>
    </div>`

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


