# 🚀 Sepaktakraw Federation - Cron Job Deployment Guide

## 📋 Overview
This cron job performs daily database keepalive operations to prevent your Supabase database from going into sleep mode after 1 week of inactivity.

## 🎯 What It Does
- **Database Operations**: Performs 14+ database queries across 7 tables
- **Health Monitoring**: Checks database health and records statistics
- **Email Reports**: Sends detailed HTML email reports with website statistics
- **KeepAlive**: Prevents Supabase database sleep mode

## 🛠️ Deployment Options

### Option 1: Render.com (Recommended)
1. **Create Render Account**: Go to [render.com](https://render.com) and sign up
2. **Connect GitHub**: Link your GitHub account
3. **Create New Service**: 
   - Choose "Background Worker"
   - Connect your repository
   - Select the `render-cron` folder as root directory
4. **Configure Environment Variables**:
   ```
   NEXT_API_URL=https://your-app.vercel.app/api/db-keepalive
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   FROM_EMAIL=your-email@gmail.com
   TO_EMAIL=recipient@example.com
   ```
5. **Set Cron Schedule**: 
   - Go to "Cron" tab in Render dashboard
   - Add cron job: `0 9 * * *` (daily at 9 AM)
   - Command: `npm start`

### Option 2: Vercel Cron Jobs
1. **Deploy to Vercel**: Push your code to GitHub
2. **Create vercel.json**:
   ```json
   {
     "crons": [
       {
         "path": "/api/db-keepalive",
         "schedule": "0 9 * * *"
       }
     ]
   }
   ```
3. **Deploy**: Vercel will automatically handle the cron scheduling

### Option 3: Railway.app
1. **Create Railway Account**: Go to [railway.app](https://railway.app)
2. **Deploy from GitHub**: Connect your repository
3. **Set Environment Variables**: Same as Render.com
4. **Configure Cron**: Use Railway's cron service

### Option 4: Heroku Scheduler
1. **Deploy to Heroku**: Create Heroku app
2. **Add Heroku Scheduler**: Add-on for cron jobs
3. **Schedule Job**: `node cron-job-enhanced.js`
4. **Set Frequency**: Daily

## 🔧 Environment Variables Setup

### Required Variables:
```env
NEXT_API_URL=https://your-deployed-app.vercel.app/api/db-keepalive
NEXT_API_KEY= (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=your-email@gmail.com
TO_EMAIL=recipient@example.com
```

### Gmail Setup:
1. **Enable 2FA**: Turn on 2-factor authentication
2. **Generate App Password**: 
   - Go to Google Account settings
   - Security → App passwords
   - Generate password for "Mail"
   - Use this password in `SMTP_PASS`

### Other Email Providers:
- **Outlook**: `smtp-mail.outlook.com:587`
- **Yahoo**: `smtp.mail.yahoo.com:587`
- **Custom**: Check your provider's SMTP settings

## ⏰ Cron Schedule Options

### Recommended Schedules:
- **Daily**: `0 9 * * *` (9 AM daily)
- **Twice Daily**: `0 9,21 * * *` (9 AM and 9 PM)
- **Every 6 Hours**: `0 */6 * * *`
- **Every Minute** (for testing): `* * * * *`

### Time Zones:
- **UTC**: Default timezone for most services
- **Local Time**: Adjust based on your deployment region

## 📧 Email Report Features

### What You'll Receive:
- **Website Details**: Organization info and database type
- **Health Status**: Database health score and status
- **Statistics**: Record counts from all tables
- **System Operations**: Query execution details
- **Recommendations**: Health recommendations
- **Beautiful HTML Format**: Professional email design

### Sample Email Content:
- 🌐 Sepaktakraw Federation branding
- 📊 Website details and organization info
- 🔍 KeepAlive summary with health score
- 📈 Database statistics with visual cards
- ⚙️ System operations status
- 💡 Health recommendations

## 🧪 Testing

### Local Testing:
```bash
cd render-cron
npm start
```

### Test with Different Frequencies:
```bash
# Test every minute (for development)
* * * * * npm start

# Test every 5 minutes
*/5 * * * * npm start
```

## 📊 Monitoring

### Success Indicators:
- ✅ Email received daily
- ✅ Database operations logged
- ✅ Health score: "excellent"
- ✅ All tables accessible

### Failure Indicators:
- ❌ No emails received
- ❌ Health score: "poor"
- ❌ Database connection errors
- ❌ SMTP authentication failures

## 🔍 Troubleshooting

### Common Issues:
1. **SMTP Authentication Failed**:
   - Check email credentials
   - Verify app password for Gmail
   - Check SMTP host/port settings

2. **Database Connection Failed**:
   - Verify NEXT_API_URL is correct
   - Check if your app is deployed and running
   - Ensure /api/db-keepalive endpoint exists

3. **Cron Job Not Running**:
   - Check cron schedule syntax
   - Verify deployment platform settings
   - Check service logs

### Logs to Check:
- Render: Service logs in dashboard
- Vercel: Function logs in dashboard
- Railway: Deployment logs
- Heroku: `heroku logs --tail`

## 🎯 Best Practices

1. **Backup Strategy**: Keep local copy of cron job code
2. **Environment Security**: Never commit real credentials
3. **Monitoring**: Set up alerts for failed cron jobs
4. **Testing**: Test thoroughly before production deployment
5. **Documentation**: Keep deployment notes updated

## 📞 Support

If you encounter issues:
1. Check the logs in your deployment platform
2. Verify all environment variables are set
3. Test the API endpoint manually
4. Check email provider settings

## 🚀 Quick Start

1. **Choose deployment platform** (Render.com recommended)
2. **Set environment variables**
3. **Deploy the render-cron folder**
4. **Configure cron schedule** (daily at 9 AM)
5. **Test and monitor**

Your Supabase database will now stay active and you'll receive daily health reports! 🎉
