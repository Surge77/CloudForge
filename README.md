<p align="center">
  <img src="public/readme/hero-banner.png" alt="VibeCode Editor Hero Banner" width="100%" />
</p>

<h1 align="center">🚀 VibeCode Editor</h1>

<p align="center">
  <strong>A powerful, cloud-based code editor with AI-powered intelligence, live preview, and WebContainer runtime.</strong>
</p>

<p align="center">
  <a href="#-features"><img src="https://img.shields.io/badge/Features-✨_Rich-blueviolet?style=for-the-badge" alt="Features"/></a>
  <a href="#-quick-start"><img src="https://img.shields.io/badge/Quick_Start-🚀_Easy-green?style=for-the-badge" alt="Quick Start"/></a>
  <a href="#-tech-stack"><img src="https://img.shields.io/badge/Stack-⚡_Modern-orange?style=for-the-badge" alt="Tech Stack"/></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" alt="License"/></a>
</p>

<p align="center">
  <a href="https://github.com/Surge77/code-editor/stargazers">
    <img src="https://img.shields.io/github/stars/Surge77/code-editor?style=social" alt="GitHub stars"/>
  </a>
  <a href="https://github.com/Surge77/code-editor/network/members">
    <img src="https://img.shields.io/github/forks/Surge77/code-editor?style=social" alt="GitHub forks"/>
  </a>
</p>

---

## 📖 Table of Contents

- [✨ Features](#-features)
- [🎯 Demo](#-demo)
- [🏗️ Architecture](#️-architecture)
- [🛠️ Tech Stack](#️-tech-stack)
- [🚀 Quick Start](#-quick-start)
- [📁 Project Structure](#-project-structure)
- [🔐 Authentication](#-authentication)
- [💻 Core Components](#-core-components)
- [🤖 AI-Powered Features](#-ai-powered-features)
- [🌐 WebContainer Integration](#-webcontainer-integration)
- [🗄️ Database Schema](#️-database-schema)
- [🔧 Configuration](#-configuration)
- [📜 API Reference](#-api-reference)
- [🎨 UI Components](#-ui-components)
- [🧪 Development](#-development)
- [🚢 Deployment](#-deployment)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## ✨ Features

<table>
  <tr>
    <td width="50%">
      <h3>🎨 Monaco Editor Integration</h3>
      <p>Full-featured code editor powered by Monaco (VS Code's engine) with syntax highlighting, IntelliSense, and advanced editing capabilities.</p>
    </td>
    <td width="50%">
      <h3>🤖 AI-Powered Code Assistance</h3>
      <p>Intelligent code suggestions, completions, and code reviews powered by AI. Get real-time suggestions as you type!</p>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h3>🌐 WebContainer Runtime</h3>
      <p>Run Node.js directly in your browser! No server required. Execute code, run npm commands, and see live previews instantly.</p>
    </td>
    <td width="50%">
      <h3>📁 Multi-Framework Templates</h3>
      <p>Start projects with React, Next.js, Vue, Angular, Express, or Hono templates. All pre-configured and ready to code!</p>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h3>💾 Cloud Persistence</h3>
      <p>Your projects are saved to the cloud automatically. Access your code from anywhere, anytime.</p>
    </td>
    <td width="50%">
      <h3>🔐 Secure Authentication</h3>
      <p>GitHub OAuth integration for secure, hassle-free authentication. Your projects stay private and protected.</p>
    </td>
  </tr>
</table>

### 🌟 Additional Features

| Feature | Description |
|---------|-------------|
| 📂 **File Explorer** | Intuitive file tree with create, rename, delete, and folder management |
| 📑 **Multi-Tab Editor** | Work on multiple files simultaneously with tabbed interface |
| 🎨 **Theme Support** | Light and dark mode with beautiful, customizable themes |
| ⌨️ **Keyboard Shortcuts** | Ctrl+S to save, and many more productivity shortcuts |
| 🔄 **Real-time Sync** | Changes sync between editor and WebContainer in real-time |
| ⭐ **Star Projects** | Bookmark your favorite projects for quick access |
| 📋 **Project Management** | Create, duplicate, edit, and delete projects from dashboard |
| 🖥️ **Integrated Terminal** | Full-featured terminal with command history and search |

---

## 🎯 Demo

<p align="center">
  <img src="public/readme/feature-webcontainer.png" alt="VibeCode Editor Demo" width="90%" />
</p>

### Live Features Showcase

| Feature | Preview |
|---------|---------|
| **AI Code Suggestions** | <img src="public/readme/feature-ai-assist.png" alt="AI Assist" width="400"/> |
| **WebContainer Terminal** | Real-time terminal with npm, node, and shell commands |
| **Live Preview** | Instant preview of React, Vue, and other framework apps |

---

## 🏗️ Architecture

<p align="center">
  <img src="public/readme/architecture-diagram.png" alt="Architecture Diagram" width="90%" />
</p>

### System Flow

```mermaid
graph LR
    A[User] -->|GitHub OAuth| B[Authentication]
    B -->|JWT Token| C[Dashboard]
    C -->|Create/Select Project| D[Playground]
    D -->|Code| E[Monaco Editor]
    D -->|AI| F[Code Suggestions API]
    D -->|Run| G[WebContainer]
    G -->|Output| H[Live Preview]
    G -->|Logs| I[Terminal]
    E -->|Sync| G
```

### Key Components

1. **Authentication Layer** - NextAuth.js with GitHub OAuth
2. **Dashboard** - Project management and organization
3. **Playground** - The core coding environment
4. **Monaco Editor** - Code editing with AI assistance
5. **WebContainer** - Browser-based Node.js runtime
6. **Terminal** - XTerm.js powered terminal emulator
7. **Live Preview** - Real-time application preview

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| ![Next.js](https://img.shields.io/badge/Next.js_16-black?style=flat-square&logo=next.js) | React Framework with App Router |
| ![React](https://img.shields.io/badge/React_19-61DAFB?style=flat-square&logo=react&logoColor=black) | UI Library |
| ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white) | Type Safety |
| ![Tailwind CSS](https://img.shields.io/badge/Tailwind_v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white) | Styling |
| ![Monaco Editor](https://img.shields.io/badge/Monaco_Editor-007ACC?style=flat-square&logo=visualstudiocode&logoColor=white) | Code Editor |
| ![Radix UI](https://img.shields.io/badge/Radix_UI-161618?style=flat-square&logo=radixui&logoColor=white) | Accessible Components |
| ![Zustand](https://img.shields.io/badge/Zustand-5A3E1B?style=flat-square) | State Management |

### Backend
| Technology | Purpose |
|------------|---------|
| ![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat-square&logo=prisma&logoColor=white) | ORM |
| ![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white) | Database |
| ![NextAuth](https://img.shields.io/badge/NextAuth.js-000000?style=flat-square&logo=nextauth.js&logoColor=white) | Authentication |

### Runtime & AI
| Technology | Purpose |
|------------|---------|
| ![WebContainer](https://img.shields.io/badge/WebContainer-FF3E00?style=flat-square) | Browser Node.js Runtime |
| ![XTerm.js](https://img.shields.io/badge/XTerm.js-000000?style=flat-square) | Terminal Emulator |
| ![Ollama](https://img.shields.io/badge/Ollama_(CodeLlama)-FF6B6B?style=flat-square) | AI Code Suggestions |

---

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** v18.0 or higher
- **npm** v9.0 or higher (or pnpm/yarn)
- **MongoDB** database (local or Atlas)
- **GitHub OAuth App** credentials
- **Ollama** (optional, for AI features)

### Installation

1️⃣ **Clone the repository**

```bash
git clone https://github.com/Surge77/code-editor.git
cd code-editor
```

2️⃣ **Install dependencies**

```bash
npm install
# or
pnpm install
# or
yarn install
```

3️⃣ **Set up environment variables**

Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/vibecode?retryWrites=true&w=majority"

# NextAuth.js
AUTH_SECRET="your-super-secret-key-generate-with-openssl-rand-base64-32"

# GitHub OAuth
AUTH_GITHUB_ID="your-github-oauth-app-client-id"
AUTH_GITHUB_SECRET="your-github-oauth-app-client-secret"

# Optional: AI Service (Ollama)
OLLAMA_URL="http://localhost:11434"
```

4️⃣ **Set up the database**

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push
```

5️⃣ **Run the development server**

```bash
npm run dev
```

6️⃣ **Open your browser**

Navigate to [http://localhost:3000](http://localhost:3000) 🎉

---

## 📁 Project Structure

```
code-editor/
├── 📂 app/                          # Next.js App Router
│   ├── 📂 (auth)/                   # Authentication routes
│   │   └── auth/sign-in/           # Sign-in page
│   ├── 📂 (root)/                   # Public routes
│   │   ├── layout.tsx              # Root layout with header
│   │   └── page.tsx                # Landing page
│   ├── 📂 api/                      # API Routes
│   │   ├── auth/[...nextauth]/     # NextAuth.js handlers
│   │   ├── code-suggestion/        # AI code suggestion endpoint
│   │   └── template/               # Template file operations
│   ├── 📂 dashboard/                # Dashboard page
│   │   └── page.tsx                # Project list & management
│   ├── 📂 playground/               # Code playground
│   │   └── [id]/page.tsx           # Dynamic playground pages
│   ├── globals.css                  # Global styles
│   └── layout.tsx                   # Root layout
├── 📂 components/                   # Shared UI components
│   ├── 📂 ui/                       # shadcn/ui components (56 components)
│   │   ├── button.tsx
│   │   ├── dialog.tsx
│   │   ├── sidebar.tsx
│   │   └── ...
│   ├── 📂 modal/                    # Modal components
│   └── 📂 providers/                # Context providers
├── 📂 features/                     # Feature modules
│   ├── 📂 ai-chat/                  # AI Chat feature
│   │   ├── 📂 components/
│   │   │   ├── ai-chat-sidepanel.tsx  # Main AI chat panel
│   │   │   ├── ai-chat-code-blocks.tsx
│   │   │   └── file-preview.tsx
│   │   └── 📂 hooks/
│   ├── 📂 auth/                     # Authentication feature
│   │   ├── 📂 actions/              # Server actions
│   │   ├── 📂 components/           # Auth components
│   │   └── 📂 hooks/
│   ├── 📂 dashboard/                # Dashboard feature
│   │   ├── 📂 components/
│   │   │   ├── add-new-btn.tsx     # Create project button
│   │   │   ├── project-table.tsx   # Projects list table
│   │   │   └── dashboard-sidebar.tsx
│   │   └── types.ts
│   ├── 📂 home/                     # Home/Landing feature
│   │   ├── header.tsx              # Navigation header
│   │   └── footer.tsx
│   ├── 📂 playground/               # Code playground feature
│   │   ├── 📂 actions/              # Server actions (CRUD)
│   │   ├── 📂 components/
│   │   │   ├── playground-editor.tsx   # Monaco editor wrapper
│   │   │   ├── playground-explorer.tsx # File tree
│   │   │   ├── toggle-ai.tsx           # AI toggle switch
│   │   │   └── 📂 dialogs/             # Modal dialogs
│   │   ├── 📂 hooks/
│   │   │   ├── usePlayground.ts    # Playground data hook
│   │   │   ├── useFileExplorer.ts  # File operations hook
│   │   │   └── useAISuggestion.ts  # AI suggestions hook
│   │   ├── 📂 libs/                 # Utility libraries
│   │   └── 📂 types/
│   └── 📂 webcontainers/            # WebContainer feature
│       ├── 📂 components/
│       │   ├── terminal.tsx         # XTerm.js terminal
│       │   └── webcontainer-preview.tsx
│       ├── 📂 hooks/
│       │   └── useWebContainer.ts   # WebContainer lifecycle
│       └── 📂 service/
├── 📂 hooks/                        # Global hooks
├── 📂 lib/                          # Shared utilities
│   ├── db.ts                        # Prisma client instance
│   ├── utils.ts                     # Helper functions
│   └── template.ts                  # Template configurations
├── 📂 prisma/                       # Database schema
│   └── schema.prisma               # Prisma schema definition
├── 📂 public/                       # Static assets
│   ├── logo.svg
│   ├── hero.svg
│   └── 📂 readme/                   # README images
├── auth.ts                          # NextAuth.js configuration
├── auth.config.ts                   # Auth provider config
├── middleware.ts                    # Route protection middleware
├── routes.ts                        # Route definitions
├── package.json
└── README.md
```

---

## 🔐 Authentication

### GitHub OAuth Setup

1. **Create a GitHub OAuth App**
   - Go to [GitHub Developer Settings](https://github.com/settings/developers)
   - Click "New OAuth App"
   - Fill in the details:
     - **Application name**: VibeCode Editor
     - **Homepage URL**: `http://localhost:3000`
     - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`

2. **Configure Environment Variables**
   ```env
   AUTH_GITHUB_ID="your-client-id"
   AUTH_GITHUB_SECRET="your-client-secret"
   ```

### Authentication Flow

```mermaid
sequenceDiagram
    participant U as User
    participant A as App
    participant G as GitHub
    participant DB as Database

    U->>A: Click "Sign in with GitHub"
    A->>G: Redirect to GitHub OAuth
    G->>U: Show authorization page
    U->>G: Authorize application
    G->>A: Callback with auth code
    A->>G: Exchange code for token
    G->>A: Return access token
    A->>DB: Create/Update user
    A->>U: Set session cookie
    U->>A: Access protected routes
```

### Protected Routes

| Route | Access Level |
|-------|-------------|
| `/` | Public |
| `/auth/sign-in` | Public |
| `/dashboard` | Authenticated |
| `/playground/[id]` | Authenticated (Owner) |
| `/api/auth/*` | Public |
| `/api/*` | Authenticated |

---

## 💻 Core Components

### Monaco Editor

The code editor is powered by Monaco Editor with custom configurations:

```typescript
// features/playground/components/playground-editor.tsx

const PlaygroundEditor = ({
  activeFile,
  content,
  onContentChange,
  suggestion,
  suggestionLoading,
  onAcceptSuggestion,
  onRejectSuggestion,
  onTriggerSuggestion,
}) => {
  // ✨ Features:
  // - Inline AI suggestions (Tab to accept)
  // - Auto-language detection
  // - Keyboard shortcuts (Ctrl+Space for suggestions)
  // - Real-time syntax highlighting
  // - IntelliSense support
};
```

### File Explorer

Interactive file tree with full CRUD operations:

```typescript
// features/playground/components/playground-explorer.tsx

<TemplateFileTree
  data={templateData}
  onFileSelect={handleFileSelect}
  onAddFile={wrappedHandleAddFile}
  onAddFolder={wrappedHandleAddFolder}
  onDeleteFile={wrappedHandleDeleteFile}
  onDeleteFolder={wrappedHandleDeleteFolder}
  onRenameFile={wrappedHandleRenameFile}
  onRenameFolder={wrappedHandleRenameFolder}
/>
```

### Terminal Component

Full-featured terminal with XTerm.js:

```typescript
// features/webcontainers/components/terminal.tsx

// ✨ Features:
// - Command history (Up/Down arrows)
// - Search functionality
// - Copy/Download logs
// - WebContainer integration
// - Color themes
```

---

## 🤖 AI-Powered Features

<p align="center">
  <img src="public/readme/feature-ai-assist.png" alt="AI Features" width="80%" />
</p>

### Code Suggestions API

The AI code suggestion system analyzes context and provides intelligent completions:

```typescript
// POST /api/code-suggestion

{
  fileContent: string,      // Full file content
  cursorLine: number,       // Current cursor line
  cursorColumn: number,     // Current cursor column
  suggestionType: string,   // Type of suggestion needed
  fileName?: string         // Optional filename for language detection
}
```

### Context Analysis

The AI system analyzes:
- 📍 Cursor position and surrounding code
- 🔤 Language and framework detection
- 📦 Import statements and dependencies
- 🔄 Incomplete patterns (functions, objects, arrays)
- 💬 Comments and documentation

### AI Chat Panel

Interactive AI assistant with:
- 💬 Natural language conversation
- 📎 File attachments for context
- 💡 Code suggestions with insert functionality
- 🔍 Code review and optimization recommendations
- 📋 Markdown rendering with syntax highlighting

---

## 🌐 WebContainer Integration

### What is WebContainer?

WebContainer is a browser-based runtime that allows running Node.js applications directly in the browser without a server.

### Features

| Feature | Description |
|---------|-------------|
| **Node.js Runtime** | Full Node.js environment in the browser |
| **npm Support** | Install and manage npm packages |
| **File System** | Virtual file system for project files |
| **Live Preview** | Real-time preview of web applications |
| **Terminal Access** | Execute commands directly in the terminal |

### Supported Templates

| Template | Framework | Default Port |
|----------|-----------|--------------|
| REACT | React + Vite | 5173 |
| NEXTJS | Next.js | 3000 |
| VUE | Vue + Vite | 5173 |
| ANGULAR | Angular | 4200 |
| EXPRESS | Express.js | 3000 |
| HONO | Hono.js | 3000 |

### WebContainer Lifecycle

```mermaid
stateDiagram-v2
    [*] --> Initializing
    Initializing --> MountingFiles: Boot complete
    MountingFiles --> InstallingDeps: Files mounted
    InstallingDeps --> StartingServer: npm install complete
    StartingServer --> Ready: Server started
    Ready --> [*]: Cleanup
```

---

## 🗄️ Database Schema

### Entity Relationship Diagram

```mermaid
erDiagram
    User ||--o{ Account : has
    User ||--o{ Playground : creates
    User ||--o{ StarMark : marks
    Playground ||--o{ StarMark : receives
    Playground ||--|| TemplateFile : contains

    User {
        string id PK
        string name
        string email UK
        string image
        UserRole role
        datetime createdAt
        datetime updatedAt
    }

    Account {
        string id PK
        string userId FK
        string type
        string provider
        string providerAccountId
        string accessToken
        string refreshToken
        int expiresAt
    }

    Playground {
        string id PK
        string title
        string description
        Templates template
        string userId FK
        datetime createdAt
        datetime updatedAt
    }

    TemplateFile {
        string id PK
        json content
        string playgroundId FK UK
        datetime createdAt
        datetime updatedAt
    }

    StarMark {
        string id PK
        string userId FK
        string playgroundId FK
        boolean isMarked
        datetime createdAt
    }
```

### Enums

```prisma
enum UserRole {
  ADMIN
  USER
  PREMIUM_USER
}

enum Templates {
  REACT
  NEXTJS
  EXPRESS
  VUE
  HONO
  ANGULAR
}
```

---

## 🔧 Configuration

### Environment Variables

```env
# ═══════════════════════════════════════════════════════════
#                    DATABASE CONFIGURATION
# ═══════════════════════════════════════════════════════════
DATABASE_URL="mongodb+srv://user:pass@cluster.mongodb.net/vibecode"

# ═══════════════════════════════════════════════════════════
#                    AUTHENTICATION
# ═══════════════════════════════════════════════════════════
AUTH_SECRET="your-32-character-random-string"
AUTH_GITHUB_ID="github-oauth-client-id"
AUTH_GITHUB_SECRET="github-oauth-client-secret"

# ═══════════════════════════════════════════════════════════
#                    AI CONFIGURATION (Optional)
# ═══════════════════════════════════════════════════════════
OLLAMA_URL="http://localhost:11434"
AI_MODEL="codellama:latest"

# ═══════════════════════════════════════════════════════════
#                    DEPLOYMENT (Production)
# ═══════════════════════════════════════════════════════════
NEXTAUTH_URL="https://your-domain.com"
```

### Next.js Configuration

```typescript
// next.config.ts

const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { hostname: "avatars.githubusercontent.com" },
    ],
  },
  headers: async () => [
    {
      source: "/:path*",
      headers: [
        { key: "Cross-Origin-Embedder-Policy", value: "require-corp" },
        { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
      ],
    },
  ],
};
```

---

## 📜 API Reference

### Authentication

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/signin` | GET | Sign in page |
| `/api/auth/signout` | POST | Sign out |
| `/api/auth/session` | GET | Get session |
| `/api/auth/callback/github` | GET | GitHub OAuth callback |

### Playground

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/template` | GET | Get template files |
| `/api/template` | POST | Save template files |

### AI Suggestions

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/code-suggestion` | POST | Get AI code suggestions |

#### Example Request

```bash
curl -X POST http://localhost:3000/api/code-suggestion \
  -H "Content-Type: application/json" \
  -d '{
    "fileContent": "function hello() {\n  ",
    "cursorLine": 1,
    "cursorColumn": 2,
    "suggestionType": "completion",
    "fileName": "index.ts"
  }'
```

#### Example Response

```json
{
  "suggestion": "console.log(\"Hello, World!\");",
  "context": {
    "language": "TypeScript",
    "framework": "None",
    "isInFunction": true,
    "isInClass": false
  },
  "metadata": {
    "language": "TypeScript",
    "framework": "None",
    "position": { "line": 1, "column": 2 },
    "generatedAt": "2025-12-06T10:30:00.000Z"
  }
}
```

---

## 🎨 UI Components

### Component Library

VibeCode uses **shadcn/ui** with **Radix UI** primitives. Available components:

<details>
<summary>📋 View all 56 components</summary>

| Component | Description |
|-----------|-------------|
| `Accordion` | Collapsible content sections |
| `AlertDialog` | Modal dialogs for confirmations |
| `Alert` | Status messages |
| `Avatar` | User profile images |
| `Badge` | Status indicators |
| `Button` | Interactive buttons with variants |
| `Calendar` | Date picker |
| `Card` | Content containers |
| `Carousel` | Image/content sliders |
| `Checkbox` | Toggle checkboxes |
| `Collapsible` | Expandable sections |
| `Command` | Command palette |
| `ContextMenu` | Right-click menus |
| `Dialog` | Modal windows |
| `Drawer` | Slide-out panels |
| `DropdownMenu` | Dropdown menus |
| `Form` | Form components |
| `HoverCard` | Hover tooltips |
| `Input` | Text inputs |
| `Label` | Form labels |
| `Menubar` | Application menus |
| `NavigationMenu` | Navigation |
| `Popover` | Floating content |
| `Progress` | Progress bars |
| `RadioGroup` | Radio buttons |
| `Resizable` | Resizable panels |
| `ScrollArea` | Custom scrollbars |
| `Select` | Dropdown selects |
| `Separator` | Visual dividers |
| `Sheet` | Side sheets |
| `Sidebar` | Navigation sidebar |
| `Skeleton` | Loading skeletons |
| `Slider` | Range sliders |
| `Sonner` | Toast notifications |
| `Switch` | Toggle switches |
| `Table` | Data tables |
| `Tabs` | Tabbed navigation |
| `Textarea` | Multi-line input |
| `Toggle` | Toggle buttons |
| `Tooltip` | Hover tooltips |
| ...and more! | |

</details>

### Theme System

```css
/* Light Theme */
:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.141 0.005 285.823);
  --primary: oklch(0.21 0.006 285.885);
  /* ... */
}

/* Dark Theme */
.dark {
  --background: oklch(0.141 0.005 285.823);
  --foreground: oklch(0.985 0 0);
  --primary: oklch(0.92 0.004 286.32);
  /* ... */
}
```

---

## 🧪 Development

### Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Generate Prisma client
npx prisma generate

# Push database changes
npx prisma db push

# Open Prisma Studio
npx prisma studio
```

### Code Quality

```bash
# Format code
npx prettier --write .

# Type check
npx tsc --noEmit
```

### Setting Up AI (Ollama)

1. Install [Ollama](https://ollama.ai)
2. Pull the CodeLlama model:
   ```bash
   ollama pull codellama:latest
   ```
3. Start Ollama server:
   ```bash
   ollama serve
   ```

---

## 🚢 Deployment

### Vercel (Recommended)

1. **Connect Repository**
   - Import project to Vercel
   - Connect GitHub repository

2. **Configure Environment Variables**
   - Add all environment variables in Vercel dashboard

3. **Deploy**
   ```bash
   vercel --prod
   ```

### Docker

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npx prisma generate
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

```bash
# Build and run
docker build -t vibecode-editor .
docker run -p 3000:3000 --env-file .env vibecode-editor
```

### Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Configure `NEXTAUTH_URL` to production domain
- [ ] Set up MongoDB Atlas for production
- [ ] Configure CORS headers for WebContainer
- [ ] Enable rate limiting on API routes
- [ ] Set up error monitoring (Sentry, etc.)

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**

2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Make your changes**

4. **Commit with conventional commits**
   ```bash
   git commit -m "feat: add amazing feature"
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```

6. **Open a Pull Request**

### Commit Convention

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation |
| `style` | Code style changes |
| `refactor` | Code refactoring |
| `test` | Adding tests |
| `chore` | Maintenance |

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2025 TEJAS

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

---

<p align="center">
  <strong>Made with ❤️ by <a href="https://github.com/Surge77">TEJAS</a></strong>
</p>

<p align="center">
  <a href="https://github.com/Surge77/code-editor">⭐ Star this repo</a> •
  <a href="https://github.com/Surge77/code-editor/issues">🐛 Report Bug</a> •
  <a href="https://github.com/Surge77/code-editor/issues">💡 Request Feature</a>
</p>

<p align="center">
  <sub>If you found this project helpful, please consider giving it a ⭐!</sub>
</p>
