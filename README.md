# ComplyEasy - Compliance Management Platform

**URL**: https://lovable.dev/projects/c787eeaa-df56-4e7d-9b8f-476398b6d25f

## Overview

ComplyEasy is a comprehensive compliance management platform designed specifically for small businesses in Australia. It streamlines compliance tasks across multiple domains including Food Safety, Workplace Health & Safety (WHS), Fire Safety, and Test & Tag requirements.

## Key Features

### 🏢 **Multi-Tenant Architecture**
- Organization-based user management
- Role-based access control (Admin, Manager, User)
- Secure data isolation between organizations

### 📋 **Compliance Management**
- **Food Safety 3.2.2A**: Complete food safety compliance tracking
- **WHS (Workplace Health & Safety)**: Risk management and safety protocols
- **Fire Safety**: Fire prevention and safety equipment tracking
- **Test & Tag**: Electrical equipment testing and certification

### 🎯 **Core Functionality**
- **Task Management**: Create, assign, and track compliance tasks
- **Calendar Integration**: Visual deadline tracking and reminders
- **Evidence Management**: Upload and organize compliance documentation
- **Audit Pack Generation**: One-click compliance reports
- **State Template Packs**: Pre-loaded templates for QLD, NSW, VIC, WA

### 🛡️ **Admin Platform**
- Platform administration dashboard
- Customer and user management
- Organization oversight
- Subscription tier management
- System analytics and health monitoring
- Template library management

## Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: shadcn/ui
- **Backend**: Supabase (Authentication, Database, Storage)
- **State Management**: React Query + Context API
- **Routing**: React Router v6

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── AdminShell.tsx  # Admin layout wrapper
│   ├── CustomerShell.tsx # Customer layout wrapper
│   └── ...            # Feature-specific components
├── pages/              # Route components
│   ├── admin/         # Admin platform pages
│   ├── customer/      # Customer dashboard pages
│   └── public/        # Public marketing pages
├── hooks/              # Custom React hooks
├── integrations/       # Third-party integrations
│   └── supabase/      # Supabase client and types
├── lib/               # Utility functions
└── types/             # TypeScript type definitions
```

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Supabase account and project

### Installation

1. **Clone the repository**
   ```bash
   git clone <YOUR_GIT_URL>
   cd <YOUR_PROJECT_NAME>
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   - Copy `.env.example` to `.env`
   - Configure Supabase credentials

4. **Start development server**
   ```bash
   npm run dev
   ```

### Database Setup

The application uses Supabase with the following key tables:
- `organizations` - Multi-tenant organization data
- `organization_members` - User-organization relationships
- `compliance_tasks` - Task management
- `evidence_files` - Document storage
- `audit_packs` - Compliance reports
- `user_roles` - Permission management

Refer to `src/docs/ADMIN_SETUP.md` for admin user creation instructions.

## User Roles & Permissions

### **Platform Admin**
- Full system access
- Customer management
- Subscription management
- System analytics

### **Organization Admin**
- Organization management
- User invitation and role assignment
- Compliance oversight

### **Organization Manager**
- Task assignment and tracking
- Evidence review
- Report generation

### **Organization User**
- Task completion
- Evidence upload
- Calendar access

## Key Pages & Features

### Public Marketing Site
- **Landing Page** (`/`): Hero, features, pricing preview
- **Product Pages**: Detailed compliance domain information
- **Pricing** (`/pricing`): Subscription tiers and features
- **Resources** (`/resources`): Compliance guides and downloads

### Customer Dashboard
- **Dashboard** (`/dashboard`): Compliance overview and quick actions
- **Tasks** (`/tasks`): Full task management interface
- **Calendar** (`/calendar`): Visual deadline tracking
- **Evidence** (`/evidence`): Document management
- **Audit Pack** (`/audit-pack`): Report generation
- **Templates** (`/templates`): State pack imports

### Admin Platform
- **Platform Dashboard** (`/admin`): System overview
- **Customer Management** (`/admin/customers`): Organization oversight
- **User Management** (`/admin/users`): User administration
- **Analytics** (`/admin/analytics`): Usage and performance metrics
- **Subscription Tiers** (`/admin/subscription-tiers`): Plan management

## Development Guidelines

### Design System
- Use semantic tokens from `index.css` and `tailwind.config.ts`
- HSL color format for all design tokens
- Component variants for reusability
- Responsive design with mobile-first approach

### Code Standards
- TypeScript strict mode
- ESLint configuration for code quality
- Component composition over inheritance
- Custom hooks for business logic

### Security Considerations
- Row Level Security (RLS) enabled on all tables
- Permission-based route protection
- Secure file upload handling
- Admin privilege separation

## Deployment

### Production Deployment
1. **Via Lovable**: Click Share → Publish in the Lovable interface
2. **Custom Domain**: Configure in Project → Settings → Domains

### Environment Configuration
- Production Supabase project
- Storage bucket configuration
- Email templates setup
- Payment gateway integration (if applicable)

## Documentation

- `src/docs/ADMIN_SETUP.md` - Admin user creation guide
- `PRODUCTION_CHECKLIST.md` - Pre-launch verification steps
- Supabase database schema and RLS policies

## Support & Contributing

For support or contributions:
1. Review existing issues and documentation
2. Follow the established code patterns
3. Test thoroughly across user roles
4. Maintain documentation updates

## Security Notes

- Admin roles must be created manually in Supabase
- All user data is organization-scoped
- File uploads are scanned and validated
- Audit trails for compliance actions

---

Built with ❤️ using [Lovable](https://lovable.dev) - The fastest way to build web applications.