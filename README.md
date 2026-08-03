# AI ChatBot - Client

A modern, full-featured AI chatbot application built with React, TypeScript, and Vite. This client-side application provides an intuitive interface for users to interact with AI models, manage prompts, access assets, and handle subscriptions.

## Features

- **AI Chat Interface**: Real-time conversations with multiple AI models
- **Authentication**: Secure login and registration with JWT tokens
- **User Dashboard**: Personalized dashboard with key metrics and quick access
- **Prompt Studio**: Create, edit, and manage AI prompts
- **Asset Library**: Browse and manage images, videos, and other assets
- **Model Selection**: Choose from multiple AI models for different tasks
- **Subscription Management**: View and manage subscription plans
- **Admin Panel**: Administrative interface for managing users and content
- **Social Integration**: Connect with social media links
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Cookie Banner**: GDPR-compliant cookie consent management

## Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS
- **HTTP Client**: RTK Query (built into Redux Toolkit)
- **Routing**: React Router
- **Icons & UI**: Custom components with theme support

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Copy `.env.example` to `.env.local` (if available)
   - Configure required environment variables (see Environment Variables section)

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint to check code quality
- `npm run type-check` - Run TypeScript type checking

## Project Structure

```
src/
├── components/          # Reusable React components
│   ├── admin/          # Admin-specific components
│   ├── AppFooter.tsx   # Footer component
│   ├── AppSidebar.tsx  # Sidebar navigation
│   ├── AppTopBar.tsx   # Top navigation bar
│   └── ...
├── pages/              # Page components for routing
│   ├── ChatPage.tsx
│   ├── DashboardPage.tsx
│   ├── AdminPage.tsx
│   └── ...
├── redux/              # Redux store and slices
│   ├── api/            # RTK Query API endpoints
│   ├── slice/          # Redux slices
│   └── store.ts        # Redux store configuration
├── hooks/              # Custom React hooks
│   └── useAuth.ts
├── secure/             # Route protection components
│   ├── AdminRoute.tsx
│   ├── PrivateRoute.tsx
│   └── PublicRoute.tsx
├── helpers/            # Utility functions
│   ├── utils.ts
│   ├── securityConfig.ts
│   └── socialLinks.ts
├── config/             # Configuration files
│   └── envImport.ts
├── types.ts            # TypeScript type definitions
├── theme.ts            # Theme configuration
├── App.tsx             # Root component
└── main.tsx            # Application entry point
```

## Environment Variables

Configure the following environment variables in your `.env.local` file:

```
VITE_API_BASE_URL=<your-api-base-url>
VITE_AUTH_TOKEN_KEY=<token-storage-key>
VITE_GOOGLE_CLIENT_ID=<google-oauth-client-id>
VITE_GITHUB_CLIENT_ID=<github-oauth-client-id>
```

## Authentication

The application uses JWT-based authentication with the following flows:

- **Login**: Email/password authentication
- **Registration**: New user sign-up
- **Token Refresh**: Automatic token renewal
- **Protected Routes**: Admin and private routes require authentication

## API Integration

The client communicates with the backend API through Redux Toolkit Query. API endpoints are defined in:

- `redux/api/authApi.ts` - Authentication endpoints
- `redux/api/userApi.ts` - User profile endpoints
- `redux/api/subscriptionApi.ts` - Subscription management
- `redux/api/paymentApi.ts` - Payment processing
- `redux/api/menuApi.ts` - Menu endpoints

## Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit your changes (`git commit -m 'Add amazing feature'`)
3. Push to the branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## License

This project is part of the Full-Stack Projects collection. All rights reserved.

## Support

For issues, questions, or suggestions, please open an issue in the repository or contact the development team.

---

**Built with ❤️ for AI enthusiasts**
