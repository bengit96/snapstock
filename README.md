# 📈 SnapPChart - AI-Powered Stock Trading Analysis

![SnapPChart Banner](https://img.shields.io/badge/Powered%20by-GPT--4%20Vision-purple)
![License](https://img.shields.io/badge/license-MIT-blue)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)

SnapPChart is an advanced AI-powered stock trading analysis platform that uses **OpenAI's GPT-4 Vision** to analyze stock charts and provide instant trading recommendations using proven momentum trading strategies. Simply upload a screenshot of any stock chart and receive professional-grade analysis in seconds.

## ✨ Key Features

- **🧠 GPT-4 Vision Analysis**: Advanced AI that understands charts like a professional trader
- **📊 40+ Trading Signals**: Comprehensive analysis across volume, momentum, patterns, and more
- **🎯 Precision Grading (A-F)**: Clear trade ratings with detailed reasoning
- **💰 Complete Trade Planning**: Exact entry, stop loss, and profit targets
- **🚀 Real-Time Processing**: Get results in under 3 seconds
- **🔒 Secure Authentication**: OTP-based login system
- **💳 Flexible Pricing**: Monthly, yearly, and lifetime subscription options

## 🚀 Quick Start Guide

### Prerequisites

Before you begin, ensure you have:
- **Node.js 18+** installed
- **Docker Desktop** installed and running
- **Git** installed
- Accounts for required services (detailed below)

### 📋 Step-by-Step Setup

#### 1️⃣ Clone the Repository

```bash
# Clone the repository
git clone https://github.com/yourusername/snappchart.git

# Navigate to the project directory
cd snappchart

# The project is already in the snappchart folder
```

#### 2️⃣ Install Dependencies

```bash
# Install all npm packages
npm install
```

#### 3️⃣ Set Up Required Service Accounts

You'll need to create accounts and get API keys for the following services:

##### **OpenAI (Required for Chart Analysis)**
1. Go to [OpenAI Platform](https://platform.openai.com)
2. Sign up or log in
3. Navigate to API Keys section
4. Click "Create new secret key"
5. Copy the key (starts with `sk-`)
6. **Important**: You need GPT-4 Vision API access (may require paid account)

##### **Resend (Required for Email OTP)**
1. Go to [Resend](https://resend.com)
2. Sign up for a free account
3. Go to API Keys section
4. Create an API key
5. Copy the key (starts with `re_`)
6. Add and verify your domain (or use their test domain)

##### **Stripe (Required for Payments)**
1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Sign up or log in
3. Switch to **Test Mode** (toggle in dashboard)
4. Get your test keys from Developers → API keys:
   - Publishable key (starts with `pk_test_`)
   - Secret key (starts with `sk_test_`)
5. Create products and prices:
   ```
   - Monthly: $19.99
   - Yearly: $99.99
   - Lifetime: $599
   ```
6. Save the price IDs (start with `price_`)

#### 4️⃣ Configure Environment Variables

```bash
# Copy the example environment file
cp .env.example .env.local

# Open .env.local in your editor
```

Update `.env.local` with your actual values:

```env
# Database (keep as is for local development)
DATABASE_URL="postgresql://snappchart:snappchart_password_2024@localhost:5432/snappchart?sslmode=disable"

# NextAuth (generate a random secret)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-random-secret-here-use-openssl-rand-base64-32"

# OpenAI (REQUIRED - Get from https://platform.openai.com/api-keys)
OPENAI_API_KEY="sk-proj-xxxxxxxxxxxxxxxxxxxxx"

# Email/Resend (REQUIRED - Get from https://resend.com/api-keys)
RESEND_API_KEY="re_xxxxxxxxxxxxxxxxxxxxx"
EMAIL_FROM="noreply@yourdomain.com"  # Or use "onboarding@resend.dev" for testing

# Stripe (Get from https://dashboard.stripe.com/test/apikeys)
STRIPE_SECRET_KEY="sk_test_xxxxxxxxxxxxxxxxxxxxx"
STRIPE_PUBLISHABLE_KEY="pk_test_xxxxxxxxxxxxxxxxxxxxx"
STRIPE_WEBHOOK_SECRET="whsec_xxxxxxxxxxxxxxxxxxxxx"  # Get this after setting up webhook

# Stripe Price IDs (Create products in Stripe Dashboard)
STRIPE_MONTHLY_PRICE_ID="price_xxxxxxxxxxxxxxxxxxxxx"
STRIPE_YEARLY_PRICE_ID="price_xxxxxxxxxxxxxxxxxxxxx"
STRIPE_LIFETIME_PRICE_ID="price_xxxxxxxxxxxxxxxxxxxxx"

# Application
APP_URL="http://localhost:3000"
```

##### 🔐 Generate NextAuth Secret

Run this command to generate a secure secret:
```bash
openssl rand -base64 32
```

#### 5️⃣ Start the Database

```bash
# Start PostgreSQL with Docker Compose
docker-compose up -d

# Verify it's running
docker ps

# You should see snappchart_postgres container running
```

#### 6️⃣ Initialize the Database

```bash
# Generate database schema
npm run db:generate

# Push schema to database
npm run db:push

# (Optional) Open database studio to view tables
npm run db:studio
```

#### 7️⃣ Start the Development Server

```bash
# Run the development server
npm run dev

# The app will be available at http://localhost:3000
```

#### 8️⃣ Test the Application

1. Open your browser and go to `http://localhost:3000`
2. Click "Start Free Trial" or "Sign In"
3. Enter your email address
4. Check your email for the OTP code
5. Enter the code to log in
6. Upload a stock chart screenshot to test the analysis

## 📝 Detailed Service Setup Guides

### OpenAI GPT-4 Vision Setup

1. **Check API Access**:
   - Log in to [OpenAI Platform](https://platform.openai.com)
   - Go to Settings → Limits
   - Ensure you have access to `gpt-4-vision-preview`
   - If not, you may need to add payment method and upgrade

2. **Set Usage Limits** (Recommended):
   - Go to Settings → Limits
   - Set monthly budget to prevent unexpected charges
   - Monitor usage in Usage → Overview

3. **Test Your API Key**:
   ```bash
   curl https://api.openai.com/v1/models \
     -H "Authorization: Bearer YOUR_API_KEY"
   ```

### Resend Email Setup

1. **Domain Configuration**:
   - For production: Add and verify your domain
   - For testing: Use `onboarding@resend.dev` as EMAIL_FROM

2. **Test Email Sending**:
   ```bash
   curl -X POST 'https://api.resend.com/emails' \
     -H 'Authorization: Bearer YOUR_RESEND_API_KEY' \
     -H 'Content-Type: application/json' \
     -d '{
       "from": "onboarding@resend.dev",
       "to": "your-email@example.com",
       "subject": "Test",
       "html": "<p>Test email</p>"
     }'
   ```

### Stripe Payment Setup

1. **Create Products**:
   - Go to Products in Stripe Dashboard
   - Create three products:
     - Monthly Subscription: $19.99/month
     - Yearly Subscription: $99.99/year
     - Lifetime Access: $599 one-time

2. **Set Up Webhook** (For production):
   ```
   Endpoint URL: https://yourdomain.com/api/stripe/webhook
   Events to listen:
   - checkout.session.completed
   - customer.subscription.created
   - customer.subscription.updated
   - customer.subscription.deleted
   ```

3. **Test Payments**:
   - Use Stripe test cards: `4242 4242 4242 4242`
   - Any future date for expiry
   - Any 3 digits for CVC

## 🏗️ Project Structure

```
snappchart/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   ├── analysis/      # Chart analysis endpoint
│   │   ├── auth/          # Authentication endpoints
│   │   └── stripe/        # Payment endpoints
│   ├── auth/              # Auth pages (login, etc.)
│   ├── dashboard/         # Main dashboard
│   └── page.tsx          # Landing page
├── components/            # React components
│   ├── ui/               # Shadcn UI components
│   └── providers.tsx     # App providers
├── lib/                   # Core business logic
│   ├── auth/             # Authentication logic
│   ├── db/               # Database schema & config
│   ├── openai/           # OpenAI GPT-4 integration
│   ├── stripe/           # Stripe integration
│   └── trading/          # Trading analysis engine
├── public/               # Static assets
├── docker-compose.yml    # Database configuration
└── package.json         # Dependencies
```

## 🔧 Common Issues & Solutions

### Issue: "OPENAI_API_KEY not configured"
**Solution**: Make sure you've added your OpenAI API key to `.env.local` and restarted the dev server

### Issue: "No such file or directory: snappchart"
**Solution**: The project is already in a snappchart folder. Don't create another one.

### Issue: Database connection failed
**Solution**:
```bash
# Make sure Docker is running
docker ps

# Restart the database
docker-compose down
docker-compose up -d
```

### Issue: Email OTP not received
**Solution**:
- Check spam folder
- Verify Resend API key is correct
- Use `onboarding@resend.dev` for testing
- Check Resend dashboard for email logs

### Issue: GPT-4 Vision API error
**Solution**:
- Verify you have GPT-4 Vision access in OpenAI account
- Check API key permissions
- Ensure you have credits/payment method added

## 📈 Trading Signals Explained

The app analyzes 40+ signals across these categories:

### Bullish Signals (Positive Points)
- **Volume**: High buying volume, low selling volume
- **Momentum**: MACD green, technical alignment
- **Trend**: Close to 9 EMA, support rejection
- **Patterns**: Bullish engulfing, hammer, cup & handle
- **Risk/Reward**: 2:1 or better ratio

### Bearish Signals (Negative Points)
- **Volume**: Heavy selling, decreasing buying
- **Momentum**: MACD red, weakening indicators
- **Trend**: Extended moves, far from 9 EMA
- **Patterns**: Topping tail, bearish engulfing
- **Risk**: Poor risk/reward, below 2:1

### No-Go Conditions (Automatic F Grade)
- Below VWAP
- Prior sudden rejection (hidden seller)
- Near 200 EMA resistance

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your GitHub repository
4. Add all environment variables
5. Deploy!

### Production Database Options

- **Neon**: [neon.tech](https://neon.tech) (Recommended)
- **Supabase**: [supabase.com](https://supabase.com)
- **Railway**: [railway.app](https://railway.app)
- **AWS RDS**: For enterprise scale

## 📊 API Endpoints

### Authentication
```
POST /api/auth/send-otp     # Send OTP to email
POST /api/auth/[...nextauth] # Handle authentication
```

### Analysis
```
POST /api/analysis          # Analyze uploaded chart
```

### Payments
```
POST /api/stripe/checkout   # Create checkout session
POST /api/stripe/webhook    # Handle Stripe events
POST /api/stripe/portal     # Customer portal
```

## 🛠️ Development Commands

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run start           # Start production server

# Database
npm run db:generate     # Generate migrations
npm run db:push        # Push schema to database
npm run db:studio      # Open Drizzle Studio
npm run db:migrate     # Run migrations

# Docker
docker-compose up -d    # Start services
docker-compose down     # Stop services
docker-compose logs -f  # View logs
```

## 📜 License

MIT License - feel free to use this project for your own trading platform!

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## ⚠️ Disclaimer

**Important**: This tool is for educational and informational purposes only. Trading stocks involves substantial risk of loss. Past performance does not guarantee future results. Always do your own research and consider consulting with a financial advisor.

## 🆘 Support

If you encounter any issues:
1. Check the [Common Issues](#-common-issues--solutions) section
2. Search existing [GitHub Issues](https://github.com/yourusername/snappchart/issues)
3. Create a new issue with:
   - Error message/screenshot
   - Steps to reproduce
   - Your environment (OS, Node version, etc.)

## 🎉 Ready to Trade Smarter!

You're all set! Your SnapPChart platform is ready to analyze charts and help you make better trading decisions. Remember to:

1. ✅ Test thoroughly in development
2. ✅ Use Stripe test mode for payments
3. ✅ Monitor your OpenAI usage
4. ✅ Keep your API keys secure
5. ✅ Never commit `.env.local` to git

Happy Trading! 🚀📈