# Real Estate Agency Frontend Template

A modern React CRM frontend template for real estate agencies built with Vite, React Router, and Tailwind CSS.

## 🚀 Features

### Core Functionality
- **Modern React Architecture** - Built with React 18 and Vite
- **Authentication** - JWT-based authentication with protected routes
- **Responsive Design** - Mobile-first responsive design with Tailwind CSS
- **Real-time Data** - React Query for efficient data fetching and caching
- **Role-based UI** - Different interfaces for Owner, Admin, and Agent roles

### Dashboard Features
- **Analytics Dashboard** - Key metrics and performance indicators
- **Lead Management** - Complete lead lifecycle management
- **Property Listings** - Property management interface
- **Client Management** - Client relationship tools
- **Task Management** - Task and follow-up tracking
- **Reports & Analytics** - Business intelligence and reporting

### UI/UX Features
- **Modern Design** - Clean, professional interface
- **Dark/Light Mode Ready** - Prepared for theme switching
- **Interactive Charts** - Recharts integration for data visualization
- **Toast Notifications** - User feedback with react-hot-toast
- **Form Validation** - React Hook Form with validation
- **Loading States** - Proper loading and error states

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend API running (see backend README)

## 🛠️ Installation

1. **Navigate to the frontend directory**
   ```bash
   cd agency-template/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   VITE_API_URL=http://localhost:6001/api
   VITE_AGENCY_NAME=Your Agency Name
   VITE_AGENCY_DOMAIN=your-agency.yourdomain.com
   VITE_AGENCY_ID=1
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   ```
   http://localhost:5001
   ```

## 🏗️ Project Structure

```
frontend/
├── public/                  # Static assets
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── Header.jsx      # Main header component
│   │   ├── Sidebar.jsx     # Navigation sidebar
│   │   ├── Layout.jsx      # Main layout wrapper
│   │   ├── StatsCard.jsx   # Dashboard statistics card
│   │   ├── RecentLeads.jsx # Recent leads component
│   │   └── LeadsChart.jsx  # Leads analytics chart
│   ├── contexts/           # React contexts
│   │   └── AuthContext.jsx # Authentication context
│   ├── hooks/              # Custom React hooks
│   │   └── useAuth.js      # Authentication hook
│   ├── pages/              # Page components
│   │   ├── Login.jsx       # Login page
│   │   ├── Dashboard.jsx   # Main dashboard
│   │   ├── Leads.jsx       # Leads management
│   │   ├── Properties.jsx  # Property management
│   │   ├── Clients.jsx     # Client management
│   │   ├── Tasks.jsx       # Task management
│   │   ├── Reports.jsx     # Reports and analytics
│   │   ├── Settings.jsx    # Agency settings
│   │   └── Profile.jsx     # User profile
│   ├── services/           # API services
│   │   └── api.js          # API client and endpoints
│   ├── App.jsx             # Main app component
│   ├── main.jsx            # App entry point
│   └── index.css           # Global styles
├── .env.example            # Environment variables template
├── package.json            # Dependencies and scripts
├── tailwind.config.js      # Tailwind CSS configuration
├── vite.config.js          # Vite configuration
└── README.md               # This file
```

## 🎨 Design System

### Colors
- **Primary**: Blue (#3b82f6)
- **Success**: Green (#10b981)
- **Warning**: Yellow (#f59e0b)
- **Error**: Red (#ef4444)
- **Gray Scale**: Tailwind gray palette

### Typography
- **Font Family**: Inter (Google Fonts)
- **Headings**: Bold weights (600-700)
- **Body**: Regular weight (400)
- **Small Text**: Medium weight (500)

### Components
- **Buttons**: Primary, secondary, outline variants
- **Cards**: Consistent shadow and border radius
- **Forms**: Consistent input styling with validation states
- **Tables**: Responsive with hover states

## 🔐 Authentication

### Login Flow
1. User enters credentials on login page
2. Frontend sends request to backend API
3. Backend validates and returns JWT token
4. Token stored in localStorage
5. User redirected to dashboard

### Protected Routes
- All routes except `/login` require authentication
- Automatic redirect to login if token is invalid
- Token refresh handled automatically

### Role-based Access
- **Owner**: Full access to all features
- **Admin**: Access to user management and reports
- **Agent**: Limited to assigned leads and properties

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

### Mobile Features
- Collapsible sidebar navigation
- Touch-friendly buttons and inputs
- Optimized table layouts
- Responsive charts and graphs

## 🔧 Configuration

### API Integration
Configure the backend API URL in `.env`:
```env
VITE_API_URL=http://localhost:6001/api
```

### Agency Branding
Customize agency information:
```env
VITE_AGENCY_NAME=Your Agency Name
VITE_AGENCY_DOMAIN=your-agency.yourdomain.com
```

### Development vs Production
```env
# Development
VITE_NODE_ENV=development

# Production
VITE_NODE_ENV=production
```

## 🚀 Build and Deployment

### Development Build
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Deploy to Static Hosting
The built files in `dist/` can be deployed to any static hosting service:
- Netlify
- Vercel
- AWS S3
- GitHub Pages

## 🧪 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔌 API Integration

### Endpoints Used
- `POST /api/auth/login` - User authentication
- `GET /api/auth/me` - Get current user
- `GET /api/leads` - Get leads with filters
- `GET /api/reports/dashboard` - Dashboard statistics
- `GET /api/properties` - Get properties
- And more...

### Error Handling
- Automatic token refresh
- Network error handling
- User-friendly error messages
- Loading states for all API calls

## 🎯 Features Roadmap

### Completed ✅
- Authentication system
- Dashboard with analytics
- Leads management interface
- Responsive design
- Role-based navigation

### In Progress 🚧
- Property management
- Client management
- Task management
- Advanced reporting

### Planned 📋
- Real-time notifications
- Advanced search and filters
- Bulk operations
- Export functionality
- Mobile app

## 📝 License

MIT License - see LICENSE file for details.

## 🤝 Support

For support and questions, contact the development team.
