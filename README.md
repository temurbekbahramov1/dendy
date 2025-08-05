# 🍔 DendyFood - Fast Food Delivery App

A modern, responsive food delivery application for DendyFood with Uzbek and Russian language support. Built with Next.js 15, TypeScript, and Tailwind CSS.

## ✨ Features

### 🎯 Core Features
- **🍔 Food Menu**: Complete catalog with categories (Hotdogs, Burgers, Sides, Drinks, Combos)
- **🛒 Shopping Cart**: Add/remove items with quantity controls
- **💳 Payment Options**: Cash and card payment methods
- **📱 Responsive Design**: Mobile-first approach with desktop optimization
- **🌐 Multi-language**: Full support for Uzbek and Russian languages
- **📞 Phone Integration**: Direct call button for customer support

### 🎨 User Experience
- **🎯 Interactive UI**: Modern design with smooth animations
- **🛒 Real-time Cart**: Live total calculation and quantity updates
- **🏷️ Special Offers**: Badge system for promotional items
- **📱 Mobile Optimized**: Touch-friendly interface for mobile devices
- **🎨 Clean Layout**: Visually appetizing food presentation

### 🛠️ Admin Panel
- **🔐 Secure Login**: Username/password authentication (dendyuz/parolyoq)
- **📝 Item Management**: Add, edit, and delete food items
- **🖼️ Image Upload**: Support for food item images
- **💰 Price Management**: Dynamic pricing updates
- **📊 Category Management**: Organize items by categories

## 🚀 Technology Stack

### 🎯 Core Framework
- **⚡ Next.js 15** - React framework with App Router
- **📘 TypeScript 5** - Type-safe development
- **🎨 Tailwind CSS 4** - Utility-first CSS framework
- **🧩 shadcn/ui** - High-quality UI components

### 🗄️ Backend & Database
- **🗄️ Prisma** - Next-generation ORM
- **💾 SQLite** - Lightweight database
- **🔄 API Routes** - RESTful API endpoints

### 🎨 UI & UX
- **🎯 Lucide React** - Beautiful icon library
- **🌈 Framer Motion** - Smooth animations
- **📱 Responsive Design** - Mobile-first approach

## 📱 App Screenshots

### Main Features:
- **Product Cards**: Images, prices, and quantity controls
- **Category Filtering**: Easy navigation between food types
- **Shopping Cart**: Slide-out cart with real-time updates
- **Checkout**: Payment method selection and order placement
- **Admin Panel**: Complete content management system

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd dendyfood

# Install dependencies
npm install

# Set up database
npm run db:push
npm run db:generate

# Seed database with sample data
npx tsx prisma/seed.ts

# Start development server
npm run dev
```

### Access the Application

1. **Main Application**: [http://localhost:3000](http://localhost:3000)
2. **Admin Panel**: [http://localhost:3000/admin](http://localhost:3000/admin)
   - Username: `dendyuz`
   - Password: `parolyoq`

### Build for Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Main food menu page
│   ├── admin/             # Admin panel
│   └── api/               # API routes
│       ├── food-items/    # Food item management
│       ├── categories/    # Category management
│       └── orders/        # Order management
├── components/            # Reusable React components
│   └── ui/               # shadcn/ui components
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
└── prisma/               # Database schema and migrations
```

## 🍔 Food Categories

### Hotdogs
- Hotdog 5 tasi 1 da
- Hotdog 5 tasi 1 da (Big)
- ChickenDog 5 tasi 1 da
- Hot-Dog
- Hot-Dog (big)
- Gigant Hot-Dog

### Burgers
- Gamburger 5 tasi 1 da
- Chicken Burger 5 tasi 1 da
- Gamburger
- DablBurger
- Chizburger
- DablChizburger
- ChickenBurger
- Klab Sendwich

### Sides
- Kartoshka Fri
- Naggets 4
- Naggets 8
- Strips

### Drinks
- Coca Cola 0.5
- IceCoffee
- Moxito Classic
- Ice-Tea

### Combos
- Klab Sendwich Fri bilan
- Fri va Cola
- Combo 2
- Chizburger set 4

## 💳 Payment Options

### Cash Payment
- Traditional cash on delivery
- No additional fees

### Card Payment
- Bank transfer to card: `9860 3501 4506 8143`
- Card holder: `Otabek Narimanov`
- Instant confirmation

## 📞 Customer Support

- **Phone**: +998 88 459-18-19
- **Hours**: 10:00 - 23:00
- **Location**: Otabek Narimanov street

## 🔧 Development Commands

```bash
# Development
npm run dev          # Start development server
npm run lint         # Run ESLint
npm run build        # Build for production

# Database
npm run db:push      # Push schema to database
npm run db:generate  # Generate Prisma client
npm run db:migrate   # Run migrations
npm run db:reset     # Reset database
```

## 🎨 Design System

### Color Palette
- **Primary**: Orange (#ea580c) - Brand color for buttons and highlights
- **Secondary**: Red variants for special offers
- **Background**: Light gradient from orange to red
- **Text**: Dark gray for readability

### Typography
- **Headings**: Bold, large font for brand identity
- **Body**: Clean, readable font for content
- **Prices**: Prominent display with orange accent

### Components
- **Cards**: Rounded corners with subtle shadows
- **Buttons**: Orange with hover effects
- **Forms**: Clean input fields with proper validation
- **Navigation**: Sticky header with language toggle

## 🌐 Language Support

The application supports two languages:
- **Uzbek (UZ)**: Primary language for Uzbekistan market
- **Russian (RU)**: Secondary language for broader audience

Language toggle is available in the header for easy switching.

## 🔐 Security Features

- **Admin Authentication**: Secure login for admin panel
- **Input Validation**: Form validation with proper error handling
- **API Security**: Protected routes and proper error handling
- **Data Protection**: Secure database operations with Prisma

## 🚀 Deployment

### Production Build
```bash
npm run build
npm start
```

### Environment Variables
Create a `.env` file with:
```
DATABASE_URL="file:./dev.db"
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)
- Database by [Prisma](https://prisma.io/)

---

Made with ❤️ for DendyFood customers. Enjoy your meal! 🍔✨
