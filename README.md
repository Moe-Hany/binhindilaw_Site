# BinHindi Law Firm Website

A modern, bilingual (Arabic/English) law firm website built with Next.js 15, TypeScript, and TailwindCSS, featuring a headless CMS backend powered by Strapi.

## 🏗️ Project Overview

This project consists of two main components:

1. **Frontend (`binhindilaw/`)**: A Next.js 15 application with internationalization support
2. **Backend (`cms_server/`)**: A Strapi CMS server for content management

### ✨ Features

- 🌐 **Bilingual Support**: Full Arabic (RTL) and English (LTR) language support
- 📱 **Responsive Design**: Mobile-first approach with TailwindCSS
- 🎨 **Modern UI/UX**: Clean, professional design suitable for a law firm
- 📝 **Content Management**: Easy content updates through Strapi CMS
- 🔍 **Search Functionality**: Integrated search across services and content
- 👥 **Team Management**: Dynamic team member profiles
- 📊 **Service Showcase**: Professional service presentations
- 💬 **Contact Forms**: Client inquiry management

## 🚀 Getting Started

### Prerequisites

- **Node.js**: Version 18.0.0 or higher (up to 22.x.x)
- **npm**: Version 6.0.0 or higher
- **Git**: For cloning the repository

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   ```

2. **Install Frontend Dependencies**
   ```bash
   cd binhindilaw
   npm install
   ```

3. **Install Backend Dependencies**
   ```bash
   cd ../cms_server
   npm install
   ```

## 🏃‍♂️ Running the Project

### Option 1: Run Both Services (Recommended)

1. **Start the CMS Server** (in one terminal):
   ```bash
   cd cms_server
   npm run dev
   ```
   The Strapi admin panel will be available at: `http://localhost:1337/admin`

2. **Start the Frontend** (in another terminal):
   ```bash
   cd binhindilaw
   npm run dev
   ```
   The website will be available at: `http://localhost:3000`

### Option 2: Run Services Individually

#### Frontend Only
```bash
cd binhindilaw
npm run dev
```
*Note: most features may not work without the CMS backend running.*

#### Backend Only
```bash
cd cms_server
npm run dev
```
*Useful for content management without running the frontend.*

## 🛠️ Development Scripts

### Frontend Scripts (`binhindilaw/`)
- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Backend Scripts (`cms_server/`)
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run console` - Open Strapi console
- `npm run strapi` - Run Strapi CLI commands

## 🌍 Internationalization

The website supports both Arabic and English languages:

- **English**: Default language with LTR layout
- **Arabic**: RTL layout with proper text direction
- **Language Switching**: Seamless switching between languages
- **Localized Content**: All content managed through the CMS

## 📱 Available Pages

- **Home**: Hero section, team overview, testimonials
- **Services**: Legal service offerings
- **Our Team**: Team member profiles

## 🗄️ CMS Structure

The Strapi backend includes the following content types:

- **Home Page**: Main page content, logo, background images
- **Hero**: Hero section content and images
- **Services**: Legal service descriptions
- **Team Members**: Staff profiles and information
- **Clients**: Client testimonials and feedback
- **Subscribers**: Newsletter subscription management

## 🎨 Styling & UI

- **TailwindCSS 4**: Modern utility-first CSS framework
- **Responsive Design**: Mobile-first approach
- **Professional Theme**: Law firm-appropriate color scheme
- **Accessibility**: WCAG compliant components
- **RTL Support**: Full Arabic language support

## 🔧 Configuration

### Frontend Configuration
- **Next.js 15**: Latest version with App Router
- **TypeScript**: Full type safety
- **TailwindCSS**: Utility-first styling
- **Redux Toolkit**: State management
- **Formik + Yup**: Form handling and validation

### Backend Configuration
- **Strapi 5**: Headless CMS
- **SQLite**: Database (can be configured for production)
- **JWT Authentication**: Secure API access
- **File Upload**: Image and document management

## 📁 Project Structure

```
assiment/
├── binhindilaw/                 # Frontend application
│   ├── app/                    # Next.js App Router
│   ├── components/             # React components
│   ├── lib/                    # Utilities and API
│   ├── store/                  # Redux store
│   ├── i18n/                   # Internationalization
│   └── public/                 # Static assets
├── cms_server/                 # Strapi CMS backend
│   ├── src/                    # Source code
│   ├── config/                 # Strapi configuration
│   ├── database/               # Database files
│   └── public/                 # Public assets
└── README.md                   # This file
```

For technical support or questions about this project, please contact the development team.

---

**Built with ❤️ using Next.js, Strapi, and modern web technologies**
