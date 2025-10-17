/* Enhanced Render Cron Job script for Sepaktakraw Federation
 * - Calls NEXT_API_URL (db-keepalive endpoint)
 * - Logs response with website details
 * - Sends comprehensive email report via SMTP (Nodemailer)
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

async function fetchWithTimeout(url, options = {}, ms = 30000) {
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
  const response = await fetchWithTimeout(NEXT_API_URL, { method: 'GET', headers }, 30000)
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
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Sepaktakraw Federation - Database KeepAlive Report</title>
    </head>
    <body style="margin: 0; padding: 20px; background-color: #f5f5f5;">
        <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 25px; text-align: center;">
                <h1 style="margin: 0; font-size: 28px; font-weight: bold;">🌐 Sepaktakraw Federation</h1>
                <p style="margin: 8px 0 0 0; font-size: 16px; opacity: 0.9;">Database KeepAlive Report ${healthScore === 'excellent' ? '✅' : '⚠️'}</p>
                <p style="margin: 5px 0 0 0; font-size: 14px; opacity: 0.8;">${new Date().toLocaleString()}</p>
            </div>
            
            <!-- Website Details -->
            <div style="background: #f8f9fa; padding: 20px; border-bottom: 1px solid #e9ecef;">
                <h3 style="color: #495057; margin-top: 0; font-size: 18px;">📊 Website Details</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                    <div>
                        <p style="margin: 5px 0;"><strong>Website:</strong> <a href="${websiteUrl}" style="color: #007bff; text-decoration: none;">${websiteUrl}</a></p>
                        <p style="margin: 5px 0;"><strong>Organization:</strong> Sepaktakraw Federation of India</p>
                    </div>
                    <div>
                        <p style="margin: 5px 0;"><strong>Purpose:</strong> Official Sepaktakraw sports federation</p>
                        <p style="margin: 5px 0;"><strong>Database:</strong> Supabase (PostgreSQL)</p>
                    </div>
                </div>
            </div>
            
            <!-- KeepAlive Summary -->
            <div style="padding: 20px; border-bottom: 1px solid #e9ecef;">
                <h3 style="color: #495057; margin-top: 0; font-size: 18px;">🔍 KeepAlive Summary</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                    <div>
                        <p style="margin: 5px 0;"><strong>Status:</strong> <span style="color: ${response.status === 200 ? '#28a745' : '#dc3545'}; font-weight: bold;">${response.status}</span></p>
                        <p style="margin: 5px 0;"><strong>Health Score:</strong> <span style="color: ${healthScore === 'excellent' ? '#28a745' : '#ffc107'}; font-weight: bold;">${healthScore}</span></p>
                    </div>
                    <div>
                        <p style="margin: 5px 0;"><strong>Database Status:</strong> ${dbStats.database_status || 'unknown'}</p>
                        <p style="margin: 5px 0;"><strong>Operations:</strong> ${dbStats.total_operations || 'unknown'}</p>
                    </div>
                </div>
            </div>
            
            <!-- Database Statistics -->
            <div style="padding: 20px; border-bottom: 1px solid #e9ecef;">
                <h3 style="color: #495057; margin-top: 0; font-size: 18px;">📈 Database Statistics</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
                    <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; text-align: center;">
                        <h4 style="margin: 0 0 5px 0; color: #1976d2;">📰 News Articles</h4>
                        <p style="margin: 0; font-size: 24px; font-weight: bold; color: #1976d2;">${dbStats.news_articles?.count || 0}</p>
                        <p style="margin: 0; font-size: 12px; color: #666;">${dbStats.news_articles?.recent_items || 0} recent</p>
                    </div>
                    <div style="background: #f3e5f5; padding: 15px; border-radius: 8px; text-align: center;">
                        <h4 style="margin: 0 0 5px 0; color: #7b1fa2;">📅 Events</h4>
                        <p style="margin: 0; font-size: 24px; font-weight: bold; color: #7b1fa2;">${dbStats.events?.count || 0}</p>
                        <p style="margin: 0; font-size: 12px; color: #666;">${dbStats.events?.recent_items || 0} recent</p>
                    </div>
                    <div style="background: #fff3e0; padding: 15px; border-radius: 8px; text-align: center;">
                        <h4 style="margin: 0 0 5px 0; color: #f57c00;">🏆 Results</h4>
                        <p style="margin: 0; font-size: 24px; font-weight: bold; color: #f57c00;">${dbStats.results?.count || 0}</p>
                        <p style="margin: 0; font-size: 12px; color: #666;">${dbStats.results?.recent_items || 0} recent</p>
                    </div>
                    <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; text-align: center;">
                        <h4 style="margin: 0 0 5px 0; color: #388e3c;">👥 General Body</h4>
                        <p style="margin: 0; font-size: 24px; font-weight: bold; color: #388e3c;">${dbStats.general_body?.count || 0}</p>
                        <p style="margin: 0; font-size: 12px; color: #666;">members</p>
                    </div>
                    <div style="background: #fce4ec; padding: 15px; border-radius: 8px; text-align: center;">
                        <h4 style="margin: 0 0 5px 0; color: #c2185b;">🖼️ Hero Images</h4>
                        <p style="margin: 0; font-size: 24px; font-weight: bold; color: #c2185b;">${dbStats.hero_images?.count || 0}</p>
                        <p style="margin: 0; font-size: 12px; color: #666;">${dbStats.hero_images?.active_images || 0} active</p>
                    </div>
                    <div style="background: #f1f8e9; padding: 15px; border-radius: 8px; text-align: center;">
                        <h4 style="margin: 0 0 5px 0; color: #689f38;">📚 History</h4>
                        <p style="margin: 0; font-size: 24px; font-weight: bold; color: #689f38;">${dbStats.history?.count || 0}</p>
                        <p style="margin: 0; font-size: 12px; color: #666;">entries</p>
                    </div>
                </div>
            </div>
            
            <!-- System Operations -->
            <div style="padding: 20px; border-bottom: 1px solid #e9ecef;">
                <h3 style="color: #495057; margin-top: 0; font-size: 18px;">⚙️ System Operations</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px;">
                    <div style="text-align: center; padding: 10px;">
                        <p style="margin: 0; font-size: 18px; font-weight: bold; color: #495057;">${dbStats.queries_executed || 'unknown'}</p>
                        <p style="margin: 0; font-size: 12px; color: #666;">Queries Executed</p>
                    </div>
                    <div style="text-align: center; padding: 10px;">
                        <p style="margin: 0; font-size: 18px; font-weight: bold; color: #495057;">${dbStats.counts_executed || 'unknown'}</p>
                        <p style="margin: 0; font-size: 12px; color: #666;">Counts Executed</p>
                    </div>
                    <div style="text-align: center; padding: 10px;">
                        <p style="margin: 0; font-size: 18px; font-weight: bold; color: ${dbStats.system_log_created ? '#28a745' : '#dc3545'};">${dbStats.system_log_created ? '✅' : '❌'}</p>
                        <p style="margin: 0; font-size: 12px; color: #666;">System Log</p>
                    </div>
                    <div style="text-align: center; padding: 10px;">
                        <p style="margin: 0; font-size: 18px; font-weight: bold; color: ${dbStats.system_record_updated ? '#28a745' : '#dc3545'};">${dbStats.system_record_updated ? '✅' : '❌'}</p>
                        <p style="margin: 0; font-size: 12px; color: #666;">Record Updated</p>
                    </div>
                </div>
            </div>
            
            <!-- Recommendation -->
            <div style="background: #fff3cd; padding: 20px; border-left: 4px solid #ffc107;">
                <h3 style="color: #856404; margin-top: 0; font-size: 18px;">💡 Recommendation</h3>
                <p style="margin: 0; color: #856404;">${dbStats.recommendation || 'No recommendation provided'}</p>
            </div>
            
            <!-- Footer -->
            <div style="background: #6c757d; color: white; padding: 15px; text-align: center; font-size: 12px;">
                <p style="margin: 0;">Generated by Sepaktakraw Federation Database KeepAlive System</p>
                <p style="margin: 5px 0 0 0;">${new Date().toISOString()}</p>
            </div>
        </div>
    </body>
    </html>`

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
