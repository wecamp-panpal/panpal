<header id="#header">
<table>
  <tr>
    <td><img src="./public/bigLogo.svg" width="150" alt="Logo"/></td>
    <td align="center">
      <h1 align="center">WeCamp Batch 8 - PanPal Frontend</h1>
    </td>
  </tr>
</table>

<p align="justify">
PanPal is a modern recipe sharing web application built with React, TypeScript, and Material-UI. This frontend application provides an intuitive interface for users to discover, create, and share delicious recipes with a vibrant cooking community. With features like user authentication, recipe management, advanced search and filtering, favorites system, step-by-step cooking instructions with images, rating system, and trending recipes, PanPal offers an engaging cooking experience for both beginners and professional chefs.
</p>

| ![Home Page](./public/preview-1.png) | ![Recipe Detail](./public/preview-2.png) |
| ------------------------------------ | ---------------------------------------- |
| Home Page with Trending Recipes      | Recipe Detail Page                       |

| ![Add Recipe](./public/preview-3.png) | ![User Profile](./public/preview-4.png) |
| ------------------------------------- | --------------------------------------- |
| Add Recipe Form                       | User Profile & Recipes                  |

</header>

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#️-tech-stack)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Available Scripts](#available-scripts)
- [Project Structure](#-project-structure)
- [Design System](#-design-system)
- [API Integration](#-api-integration)
- [Build & Deployment](#-build--deployment)
- [License](#-license)
- [Team](#-team)

## 🍳 Features

- **Recipe Management**: Create, edit, and delete your own recipes
- **Discovery**: Browse trending recipes and discover new favorites
- **Search & Filter**: Find recipes by ingredients, categories, or cooking time
- **Favorites System**: Save your favorite recipes for quick access
- **Step-by-Step Instructions**: Detailed cooking steps with optional images
- **Rating & Review System**: Rate recipes and share your cooking experience
- **User Profiles**: Manage your profile and view your recipe collection
- **Responsive Design**: Beautiful UI that works on all devices
- **Authentication**: Secure user registration and login with JWT and Google OAuth
- **Image Upload**: Upload recipe and step images with preview functionality
- **Real-time Notifications**: Toast notifications for user actions

## 🛠️ Tech Stack

- **Framework**: React 18 with TypeScript
- **UI Library**: Material-UI (MUI) v5
- **Routing**: React Router v6
- **State Management**: Redux Toolkit & React Hooks
- **HTTP Client**: Axios with interceptors
- **Authentication**: Firebase Auth + JWT
- **Notifications**: React Hot Toast
- **Icons**: Lucide React, Material-UI Icons
- **Date Handling**: date-fns
- **Styling**: Material-UI Theme System + Emotion CSS
- **Build Tool**: Vite
- **Package Manager**: npm/yarn
- **Development**: ESLint, TypeScript, Hot Reload

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend API server running (see backend repository)
- Firebase project configured for Google OAuth

### Installation

1. Clone the repository

```bash
git clone https://github.com/your-username/panpal-frontend.git
cd panpal-frontend
```

2. Install dependencies

```bash
npm install
```

3. Create environment file

```bash
cp .env.example .env.local
```

### Environment Variables

Create a `.env.local` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_NAME=PanPal
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
```

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run type checking
npm run type-check

# Run linting
npm run lint
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   │   ├── protected.tsx
│   │   ├── signIn-form.tsx
│   │   └── signUp-form.tsx
│   ├── common/         # Shared common components
│   │   ├── confirm-dialog.tsx
│   │   ├── footer.tsx
│   │   ├── nav-bar.tsx
│   │   ├── search-bar.tsx
│   │   └── simple-success-modal.tsx
│   ├── home-page/      # Home page specific components
│   │   ├── community.tsx
│   │   ├── feature-section.tsx
│   │   ├── hero.tsx
│   │   ├── home-trending.tsx
│   │   └── trending-public.tsx
│   ├── profile/        # User profile components
│   │   ├── favourite-recipe-tab.tsx
│   │   ├── my-recipes-tab.tsx
│   │   ├── profile-info.tsx
│   │   ├── tab-panel.tsx
│   │   └── user-header-board.tsx
│   ├── rating/         # Rating and review system
│   │   ├── comment-card.tsx
│   │   ├── comment-form.tsx
│   │   ├── rating-distribution.tsx
│   │   ├── rating-form.tsx
│   │   ├── rating-list.tsx
│   │   └── rating-section.tsx
│   └── recipes/        # Recipe management components
│       ├── add-ingredient.tsx
│       ├── add-step.tsx
│       ├── category-select-single.tsx
│       ├── category-select.tsx
│       ├── filter-bar.tsx
│       ├── recipe-card.tsx
│       └── text-editor.tsx
├── pages/              # Page components
│   ├── add-recipe.tsx  # Create recipe page
│   ├── home.tsx        # Home page
│   ├── profile.tsx     # User profile page
│   └── recipe-detail.tsx # Recipe detail page
├── services/           # API services
│   ├── auth.ts         # Authentication API
│   ├── recipes.ts      # Recipe API
│   ├── comments-new.ts # Comments and ratings API
│   ├── firebaseAuth.ts # Firebase authentication
│   └── axiosClient.ts  # HTTP client configuration
├── hooks/              # Custom React hooks
│   ├── useFavorites.ts # Favorites management
│   └── use-app-dispatch.ts # Redux hooks
├── stores/             # Redux store
│   └── user-slice.ts   # User state management
├── types/              # TypeScript type definitions
│   ├── ui-recipe.ts    # Recipe types
│   ├── auth.ts         # Authentication types
│   └── user.ts         # User types
├── utils/              # Utility functions
│   └── debug-oauth.ts  # OAuth debugging utilities
├── theme/              # Material-UI theme configuration
└── mocks/              # Mock data for development
```

## 🎨 Design System

PanPal uses a warm, cooking-inspired design system:

### Colors

- **Primary**: `#391F06` (Rich Brown)
- **Secondary**: `#f5e2cc` (Warm Cream)
- **Accent**: `#BFA980` (Light Brown)
- **Background**: `#F5E2CC` (Warm background)

### Typography

- **Headings**: Playfair Display (serif)
- **Body Text**: Montserrat (sans-serif)
- **Font Weights**: 400 (regular), 600 (semi-bold), 700 (bold)

### Components

- Consistent Material-UI theming
- Custom styled components with consistent padding and margins
- Responsive breakpoints for mobile, tablet, and desktop
- Consistent spacing and elevation system
- Hover effects and transitions

## 🔌 API Integration

The frontend communicates with the backend API using:

- **Axios**: HTTP client with request/response interceptors
- **JWT Authentication**: Token-based authentication with automatic refresh
- **Firebase Auth**: Google OAuth integration
- **Error Handling**: Centralized error handling with toast notifications
- **Loading States**: Loading indicators for all async operations

### API Endpoints Used

- `/auth/login` - User authentication
- `/auth/register` - User registration
- `/auth/firebase-login` - Firebase OAuth login
- `/recipes` - Recipe CRUD operations
- `/recipes/trending` - Trending recipes
- `/recipes/:id/comments` - Recipe comments and ratings
- `/users/profile` - User profile management
- `/users/favorites` - Favorites management

## 📦 Build & Deployment

### Production Build

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

### Deployment Options

- **Vercel**: Connect your GitHub repository for automatic deployments
- **Netlify**: Drag and drop the `dist` folder or connect via Git
- **GitHub Pages**: Use GitHub Actions for deployment
- **Docker**: Build and deploy using containers

### Environment Setup for Production

Make sure to set the correct environment variables for production:

```env
VITE_API_BASE_URL=https://your-api-domain.com/api
VITE_APP_NAME=PanPal
VITE_FIREBASE_API_KEY=your_production_firebase_key
VITE_FIREBASE_AUTH_DOMAIN=your_production_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_production_project_id
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

**WeCamp Batch 8 - Team PanPal**

| Name                     | GitHub                                                         |
| ------------------------ | -------------------------------------------------------------- |
| Hoàng Thị Minh Khuê      | [@htmkhue39](https://github.com/htmkhue39)                     |
| Trần Đồng Trúc Lam       | [@limelight-hub](https://github.com/limelight-hub)             |
| Võ Thị Hồng Minh         | [@vominh-source](https://github.com/vominh-source)             |
| Võ Lê Việt Tú            | [@voleviettu](https://github.com/voleviettu)                   |
| Hoàng Ngọc Quỳnh Anh     | [@quynhanhhoang572004](https://github.com/quynhanhhoang572004) |
| Phạm Ngọc Diễm (Advisor) | [@diem-github](https://github.com/diem-github)                 |

### Special Thanks

- WeCamp instructors and mentors
- The amazing cooking community that inspired this project

**Team PanPal** - Connecting food enthusiasts worldwide through the art of cooking.

---

<p align="center">
  <a href="#header">Back to top ⬆️</a>
</p>
