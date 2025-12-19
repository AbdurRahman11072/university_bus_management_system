# 🚌 GUB Bus Management System

A modern, full-featured bus management platform designed specifically for Green University of Bangladesh (GUB) students and faculty. This Next.js application provides real-time bus tracking, online booking, route scheduling, and comprehensive transportation management.

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://green-university-five.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Installation](#-installation)
- [Usage](#-usage)
- [Project Structure](#-project-structure)
- [Environment Variables](#-environment-variables)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

## ✨ Features

### 🎯 Core Features
- **Real-time Bus Tracking** - Live GPS tracking of all university buses
- **Smart Booking System** - Quick and easy ticket booking with just a few taps
- **Route Management** - Comprehensive bus route and schedule information
- **User Authentication** - Secure login/signup system for students and faculty
- **Payment Integration** - Secure and encrypted payment processing
- **Notice Board** - Important announcements and updates
- **Profile Management** - Personal dashboard for managing bookings and preferences

### 🚀 Advanced Features
- **Live Route Tracking** - Monitor your bus in real-time
- **Schedule Management** - Accurate arrival and departure times
- **Student Discount Program** - Special pricing for GUB students
- **Group Booking** - 20% discount on group reservations
- **Early Bird Specials** - Save by booking 3 days in advance
- **Emergency Support** - 24/7 assistance for travelers
- **Mobile Responsive** - Fully optimized for mobile devices

## 🛠 Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/)
- **Package Manager:** [pnpm](https://pnpm.io/)
- **Deployment:** [Vercel](https://vercel.com)
- **Linting:** ESLint

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher)
- [pnpm](https://pnpm.io/) (recommended) or npm/yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/AbdurRahman11072/green_university.git
   cd green_university
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Then edit `.env.local` with your configuration

4. **Run the development server**
   ```bash
   pnpm dev
   # or
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application

## 💻 Usage

### For Students/Faculty

1. **Sign Up** - Create an account using your university credentials
2. **Browse Routes** - Explore available bus routes and schedules
3. **Book Tickets** - Select your route and book your seat
4. **Track Bus** - Monitor your bus location in real-time
5. **Manage Bookings** - View and manage your trip history

### For Administrators

- Manage bus routes and schedules
- Monitor real-time bus locations
- Handle booking requests
- Post notices and announcements
- Generate reports and analytics

## 📁 Project Structure

```
green_university/
├── public/              # Static assets (images, icons, etc.)
├── scripts/             # Utility scripts
├── src/
│   ├── app/            # Next.js app directory (routes)
│   ├── components/     # Reusable React components
│   ├── lib/            # Utility functions and configurations
│   ├── hooks/          # Custom React hooks
│   └── styles/         # Global styles
├── middleware.ts       # Next.js middleware
├── next.config.ts      # Next.js configuration
├── tailwind.config.ts  # Tailwind CSS configuration
├── tsconfig.json       # TypeScript configuration
└── package.json        # Project dependencies
```

## 🔐 Environment Variables

Create a `.env.local` file in the root directory:

```env
# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Database
DATABASE_URL=your_database_url

# Authentication
NEXTAUTH_SECRET=your_secret_key
NEXTAUTH_URL=http://localhost:3000

# Payment Gateway
PAYMENT_API_KEY=your_payment_key

# Maps API (for tracking)
NEXT_PUBLIC_MAPS_API_KEY=your_maps_api_key
```

## 🌐 Deployment

### Deploy on Vercel (Recommended)

The easiest way to deploy this Next.js application is using [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Import your repository on Vercel
3. Configure environment variables
4. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/AbdurRahman11072/green_university)

### Manual Deployment

```bash
# Build the application
pnpm build

# Start production server
pnpm start
```

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Write clean, documented code
- Test your changes thoroughly
- Follow the existing code style
- Update documentation as needed

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

**Green University Bus Management Team**

- 📧 Email: support@gubbus.com
- 📱 Phone: +880 1234-567890
- 🏢 Address: Green University of Bangladesh, Dhaka
- 🌐 Website: [green-university.vercel.app](https://green-university.vercel.app)

### Connect With Us

[![Facebook](https://img.shields.io/badge/Facebook-1877F2?style=for-the-badge&logo=facebook&logoColor=white)](https://facebook.com)
[![Instagram](https://img.shields.io/badge/Instagram-E4405F?style=for-the-badge&logo=instagram&logoColor=white)](https://instagram.com)
[![WhatsApp](https://img.shields.io/badge/WhatsApp-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)](https://whatsapp.com)

## 🙏 Acknowledgments

- Green University of Bangladesh for supporting this initiative
- All contributors who have helped improve this project
- The Next.js and React communities for excellent documentation

---

<div align="center">
  <p>Made with ❤️ for Green University of Bangladesh</p>
  <p>© 2025 Green University Of Bangladesh. All Rights Reserved.</p>
</div>
