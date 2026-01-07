# Aurora

[![build-docker.yml](https://github.com/Day-fit/Aurora/actions/workflows/build-docker.yml/badge.svg)](https://github.com/Day-fit/Aurora/actions/workflows/build-docker.yml)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)

Aurora is a modern, cloud-native web application for creating professional resumes (CVs) with AI-powered enhancement capabilities. Built with a microservices architecture, Aurora offers a seamless user experience for generating, editing, and exporting high-quality CVs with optional AI assistance from OpenAI.

## 📋 Table of Contents

- [Features](#-features)
- [Architecture](#-architecture)
- [Technology Stack](#-technology-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Infrastructure](#-infrastructure)
- [Authentication](#-authentication)
- [API Documentation](#-api-documentation)
- [Development](#-development)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### Core Features
- **CV Generation**: Create professional resumes through an intuitive web interface
- **AI Enhancement**: Leverage OpenAI's GPT models to improve CV content, descriptions, and formatting
- **AI Translation**: Automatically translate your CV to different languages using AI
- **AI Auto-generation**: Generate CV sections automatically based on minimal input
- **Multiple Templates**: Choose from various professional CV templates
- **PDF Export**: Download your CV in high-quality PDF format using iText
- **Real-time Preview**: See changes instantly as you edit your CV
- **Version Control**: Track and manage different versions of your CVs
- **Save & Edit**: Store CVs in the cloud and update them anytime

### User Features
- **OAuth2 Authentication**: Secure login with Google, Apple, and GitHub
- **User Profiles**: Personalized workspace for managing multiple CVs
- **Profile Images**: Add professional photos to your CV
- **Multi-language Support**: Create CVs in different languages
- **Contact Information**: Include email, website, LinkedIn, and GitHub links

### Technical Features
- **Microservices Architecture**: Scalable and maintainable service-oriented design
- **Real-time Updates**: WebSocket support for live collaboration features
- **Event-driven Communication**: RabbitMQ for asynchronous processing
- **Cloud Storage**: MinIO for secure file and asset storage
- **Caching**: Redis for improved performance
- **Health Monitoring**: Spring Boot Actuator for service health checks
- **Containerization**: Full Docker support with multi-architecture builds

## 🏗️ Architecture

Aurora follows a microservices architecture with the following services:

```
┌─────────────────┐
│   NGINX         │  ← Reverse Proxy & SSL Termination
│   (Port 80/443) │
└────────┬────────┘
         │
    ┌────┴─────────────────────────────────┐
    │                                       │
┌───▼──────────┐  ┌──────────────┐  ┌─────▼────────┐
│ Frontend     │  │ Aurora Core  │  │ Aurora Auth  │
│ (Next.js)    │  │ (Kotlin)     │  │ (Kotlin)     │
│ Port 3000    │  │ Port 8081    │  │ Port 8083    │
└──────────────┘  └──────┬───────┘  └──────┬───────┘
                         │                   │
                    ┌────▼──────────┐  ┌────▼────────┐
                    │  Aurora AI    │  │  PostgreSQL │
                    │  (Kotlin)     │  │  Database   │
                    │  Port 8082    │  └─────────────┘
                    └───────┬───────┘
                            │
         ┌──────────────────┼──────────────────┐
         │                  │                  │
    ┌────▼─────┐    ┌──────▼──────┐    ┌─────▼────┐
    │ RabbitMQ │    │    Redis    │    │  MinIO   │
    │ Streams  │    │   Cache     │    │  Storage │
    └──────────┘    └─────────────┘    └──────────┘
```

### Service Responsibilities

#### Aurora Frontend (aurora-front)
- **Technology**: Next.js 16, React 19, TypeScript
- **Purpose**: Modern, responsive web interface for CV creation and management
- **Features**: Server-side rendering, responsive design, form validation
- **Key Libraries**: React Hook Form, Framer Motion, Radix UI, Tailwind CSS

#### Aurora Core (aurora-core)
- **Technology**: Kotlin, Spring Boot 3.5.7, Java 21
- **Purpose**: Main business logic service for CV management and PDF generation
- **Features**: 
  - CV CRUD operations
  - PDF generation using iText html2pdf
  - Resume versioning and management
  - WebSocket support for real-time updates
  - Integration with auth service for user management
- **Database**: PostgreSQL (JPA/Hibernate)

#### Aurora Auth (aurora-auth)
- **Technology**: Kotlin, Spring Boot 3.5.6, Java 21
- **Purpose**: Centralized authentication and authorization service
- **Features**:
  - OAuth2 integration (Google, Apple, GitHub)
  - JWT token generation and validation (JWKS)
  - User session management with Redis
  - User profile management
- **Security**: Custom auth library (aurora-auth-lib) for shared security logic

#### Aurora AI (aurora-ai)
- **Technology**: Kotlin, Spring Boot 3.5.6, Java 21
- **Purpose**: AI-powered CV enhancement service using OpenAI
- **Features**:
  - Content enhancement using GPT models
  - Language translation
  - Auto-generation of CV sections
  - Asynchronous processing via RabbitMQ streams
- **API**: OpenAI Java Spring Boot Starter

## 🛠️ Technology Stack

### Backend Services (Microservices)
- **Language**: Kotlin 2.2
- **Runtime**: Java 21 (OpenJDK)
- **Framework**: Spring Boot 3.5.x (aurora-core: 3.5.7, aurora-auth/ai: 3.5.6)
- **Build Tool**: Maven

### Frontend
- **Framework**: Next.js 16 (React 19)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod validation

### Infrastructure & Services
- **Database**: PostgreSQL (latest)
- **Cache**: Redis (latest)
- **Message Broker**: RabbitMQ 4.1 (with RabbitMQ Streams)
- **Object Storage**: MinIO (S3-compatible)
- **Reverse Proxy**: Nginx (with Let's Encrypt SSL)
- **Container Orchestration**: Docker Compose
- **Container Registry**: GitHub Container Registry (GHCR)
- **Auto-updates**: Watchtower

### Key Libraries & Dependencies

#### Backend
- **Spring Framework**: Spring Security, Spring Data JPA, Spring AMQP, Spring WebSocket, Spring Actuator
- **Database**: PostgreSQL JDBC Driver, Hibernate
- **PDF Generation**: iText html2pdf 6.2.1
- **Templating**: FreeMarker 2.3
- **AI Integration**: OpenAI Java Spring Boot Starter 4.6.1
- **Storage**: MinIO SDK 8.6.0
- **HTTP Client**: OkHttp 4.12.0

#### Frontend
- **UI Libraries**: Radix UI Dialog, React Icons, Swiper
- **Form Handling**: React Hook Form 7.66, Zod 4.1
- **Code Quality**: ESLint, Prettier

### Development & DevOps
- **CI/CD**: GitHub Actions
- **Containerization**: Docker (multi-arch: amd64, arm64)
- **SSL**: Certbot (Let's Encrypt)
- **Monitoring**: Spring Boot Actuator health checks

## 🚀 Getting Started

### Prerequisites
- Docker and Docker Compose
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Day-fit/Aurora.git
   cd Aurora
   ```

2. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and configure the following required variables:
   ```env
   # Database
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_NAME=aurora
   DB_URL=jdbc:postgresql://postgres:5432/aurora
   
   # RabbitMQ
   RABBITMQ_HOST=rabbitmq
   RABBITMQ_USER=auroraapp
   RABBITMQ_PASSWORD=appsecret
   
   # OpenAI (Required for AI features)
   OPENAI_API_KEY=your_openai_api_key
   OPENAI_PROJECT=your_project_id
   OPENAI_ORGANIZATION=your_org_id
   
   # MinIO (Object Storage)
   MINIO_HOST=http://minio:9000
   MINIO_ACCESS_KEY=your_minio_access_key
   MINIO_SECRET_KEY=your_minio_secret_key
   
   # Redis
   REDIS_HOST=redis
   REDIS_PASSWORD=your_redis_password
   
   # Authentication
   JWKS_SUPPLIER_URI=http://aurora-auth:8083/auth/jwks
   
   # OAuth2 (Optional - for social login)
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GITHUB_CLIENT_ID=your_github_client_id
   GITHUB_CLIENT_SECRET=your_github_client_secret
   APPLE_CLIENT_ID=your_apple_client_id
   APPLE_CLIENT_SECRET=your_apple_client_secret
   APPLE_JWKS_URI=https://appleid.apple.com/auth/keys
   
   # CORS
   CORS_ALLOWED_ORIGINS=http://localhost:3000
   
   # GitHub (for package registry access)
   GITHUB_PAT=your_github_personal_access_token
   ```

3. **Start the application (Development mode)**
   ```bash
   docker-compose --profile dev up -d
   ```
   
   Or for production:
   ```bash
   docker-compose --profile prod up -d
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Aurora Core API: http://localhost:8081
   - Aurora Auth API: http://localhost:8083
   - Aurora AI API: http://localhost:8082
   - RabbitMQ Management: http://localhost:15672 (admin/admin)
   - MinIO Console: http://localhost:9090

### Quick Start for Development

For local development without Docker:

1. **Start infrastructure services**
   ```bash
   docker-compose --profile dev up postgres redis rabbitmq-dev minio -d
   ```

2. **Run backend services** (each in separate terminals)
   ```bash
   # Aurora Core
   cd aurora-core
   ./mvnw spring-boot:run
   
   # Aurora Auth
   cd aurora-auth
   ./mvnw spring-boot:run
   
   # Aurora AI
   cd aurora-ai
   ./mvnw spring-boot:run
   ```

3. **Run frontend**
   ```bash
   cd aurora-front
   npm install
   npm run dev
   ```

## 📁 Project Structure

```
Aurora/
├── aurora-core/              # Main CV management service
│   ├── src/
│   │   ├── main/kotlin/pl/dayfit/auroracore/
│   │   │   ├── configuration/    # Spring configuration
│   │   │   ├── controller/       # REST API controllers
│   │   │   ├── dto/              # Data transfer objects
│   │   │   ├── event/            # Event handlers
│   │   │   ├── exception/        # Custom exceptions
│   │   │   ├── model/            # JPA entities
│   │   │   ├── repository/       # Data repositories
│   │   │   ├── service/          # Business logic
│   │   │   └── websocket/        # WebSocket handlers
│   │   └── test/
│   └── pom.xml
│
├── aurora-auth/              # Authentication service
│   ├── src/
│   │   └── main/kotlin/pl/dayfit/auroraauth/
│   │       ├── auth/             # Authentication logic
│   │       ├── configuration/    # Security configuration
│   │       ├── controller/       # Auth endpoints
│   │       ├── oauth/            # OAuth2 providers
│   │       ├── model/            # User models
│   │       ├── repository/       # User repositories
│   │       └── service/          # Auth services
│   └── pom.xml
│
├── aurora-ai/                # AI enhancement service
│   ├── src/
│   │   └── main/kotlin/pl/dayfit/auroraai/
│   │       ├── configuration/    # OpenAI configuration
│   │       ├── service/          # AI processing services
│   │       └── event/            # RabbitMQ consumers
│   └── pom.xml
│
├── aurora-auth-lib/          # Shared authentication library
│   ├── src/
│   │   └── main/kotlin/
│   └── pom.xml
│
├── aurora-front/             # Next.js frontend
│   ├── src/
│   │   ├── app/                  # Next.js app router
│   │   ├── components/           # React components
│   │   │   ├── auth/             # Authentication UI
│   │   │   └── cv-components/    # CV editing components
│   │   ├── lib/                  # Utilities
│   │   └── proxy.tsx             # API proxy
│   ├── public/                   # Static assets
│   ├── package.json
│   └── next.config.ts
│
├── dockerfiles/              # Docker build files
│   ├── dockerfile-core
│   ├── dockerfile-auth
│   ├── dockerfile-ai
│   └── dockerfile-frontend
│
├── nginx/                    # Nginx configuration
│   └── conf.d/
│
├── .github/
│   └── workflows/            # CI/CD pipelines
│       ├── build-docker.yml  # Multi-arch Docker builds
│       └── test-frontend.yml # Frontend tests
│
├── compose.yaml              # Docker Compose configuration
├── definitions.json          # RabbitMQ configuration
├── buckets.json              # MinIO bucket definitions
└── .env.example              # Environment variables template
```

## 🔧 Infrastructure

### Database (PostgreSQL)
Aurora uses PostgreSQL for persistent data storage with the following main entities:
- **Users**: User accounts and profiles
- **Resumes**: CV data with versioning support
- **WorkExperience**: Job history entries
- **Education**: Educational background
- **Skills**: Technical and soft skills
- **Achievements**: Awards and accomplishments
- **PersonalPortfolio**: Projects and portfolio items

### Message Queue (RabbitMQ)
RabbitMQ handles asynchronous communication between services:
- **Streams**: For AI processing queues (enhancement, translation, auto-generation)
- **Classic Queues**: For user initialization and JWKS updates
- **Exchanges**: Fanout exchanges for broadcasting events

**Queues**:
- `enhancement.stream` - CV enhancement requests
- `translation.stream` - Translation tasks
- `autogeneration.stream` - Auto-generation jobs
- `post.*.stream` - Post-processing results
- `user.init.core` - User initialization events
- `jwks.queue.core` - JWKS synchronization

### Object Storage (MinIO)
MinIO provides S3-compatible storage for:
- **Buckets**:
  - `jwks` - JSON Web Key Sets for authentication
  - `resumes` - Generated PDF files and profile images

### Cache (Redis)
Redis caches frequently accessed data:
- User sessions
- Authentication tokens
- Temporary data for improved performance

### Reverse Proxy (Nginx)
Nginx handles:
- SSL/TLS termination with Let's Encrypt certificates
- Request routing to microservices
- Static file serving
- Load balancing

## 🔐 Authentication

Aurora implements a comprehensive authentication system with multiple OAuth2 providers:

### Supported OAuth2 Providers
- **Google OAuth2**: Login with Google account
- **GitHub OAuth2**: Login with GitHub account
- **Apple ID**: Login with Apple account

### Authentication Flow
1. User initiates login via OAuth2 provider
2. Provider validates credentials and returns authorization code
3. Aurora Auth exchanges code for access token
4. Aurora Auth validates token with provider
5. Aurora Auth creates/updates user in database
6. Aurora Auth generates JWT token with JWKS
7. JWT token is used for subsequent API requests
8. Tokens are cached in Redis for performance

### Security Features
- **JWT Tokens**: Secure token-based authentication
- **JWKS**: JSON Web Key Sets for token validation
- **Shared Auth Library**: Common security logic across services (aurora-auth-lib)
- **Session Management**: Redis-backed session storage
- **CORS Protection**: Configurable allowed origins

## 📚 API Documentation

### Aurora Core API (Port 8081)

**Resume Management**
- `GET /api/resumes` - List user's resumes
- `POST /api/resumes` - Create new resume
- `GET /api/resumes/{id}` - Get resume details
- `PUT /api/resumes/{id}` - Update resume
- `DELETE /api/resumes/{id}` - Delete resume
- `GET /api/resumes/{id}/pdf` - Download resume as PDF
- `POST /api/resumes/{id}/enhance` - Trigger AI enhancement
- `POST /api/resumes/{id}/translate` - Translate resume

**Health Check**
- `GET /actuator/health` - Service health status

### Aurora Auth API (Port 8083)

**Authentication**
- `POST /auth/login/google` - Google OAuth2 login
- `POST /auth/login/github` - GitHub OAuth2 login
- `POST /auth/login/apple` - Apple ID login
- `GET /auth/jwks` - Get public JWKS for token validation
- `POST /auth/logout` - Logout user
- `GET /auth/user` - Get current user info

**Health Check**
- `GET /actuator/health` - Service health status

### Aurora AI API (Port 8082)

**AI Processing** (Internal, called via RabbitMQ)
- Enhancement processing
- Translation processing
- Auto-generation processing

**Health Check**
- `GET /actuator/health` - Service health status

## 💻 Development

### Building from Source

**Backend Services (Maven)**
```bash
# Build aurora-core
cd aurora-core
./mvnw clean package

# Build aurora-auth
cd aurora-auth
./mvnw clean package

# Build aurora-ai
cd aurora-ai
./mvnw clean package

# Build aurora-auth-lib (shared library)
cd aurora-auth-lib
./mvnw clean install
```

**Frontend (npm)**
```bash
cd aurora-front
npm install
npm run build
```

### Running Tests

**Backend Tests**
```bash
cd aurora-core
./mvnw test

cd aurora-auth
./mvnw test

cd aurora-ai
./mvnw test
```

**Frontend Tests**
```bash
cd aurora-front
npm run lint
```

### Code Quality
- **Backend**: Kotlin with Spring Boot best practices
- **Frontend**: ESLint and Prettier for code formatting
- **Version Control**: Git with GitHub

## 🚢 Deployment

### Docker Deployment

Aurora uses GitHub Actions for automated builds and deployments:

1. **Automated Builds**: On push to `main` branch
   - Builds multi-architecture Docker images (amd64, arm64)
   - Pushes to GitHub Container Registry (ghcr.io)
   - Tags: `ghcr.io/day-fit/aurora-{service}:latest`

2. **Services**:
   - `ghcr.io/day-fit/aurora-frontend:latest`
   - `ghcr.io/day-fit/aurora-core:latest`
   - `ghcr.io/day-fit/aurora-auth:latest`
   - `ghcr.io/day-fit/aurora-ai:latest`

3. **Auto-updates**: Watchtower monitors and updates containers automatically

### Production Setup

1. **Configure domain and SSL**:
   - Update Nginx configuration with your domain
   - Configure Certbot for Let's Encrypt SSL certificates
   - Update `CORS_ALLOWED_ORIGINS` in `.env`

2. **Start production stack**:
   ```bash
   docker-compose --profile prod up -d
   ```

3. **Services include**:
   - All application services
   - Nginx with SSL termination
   - Certbot for certificate renewal
   - Watchtower for automatic updates
   - Health checks and restart policies

### Monitoring
- Spring Boot Actuator health endpoints on all services
- Docker health checks configured for all containers
- RabbitMQ Management UI for queue monitoring
- MinIO Console for storage monitoring

## 🤝 Contributing

Aurora is primarily intended as a hosted web application. However, contributions are welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines
- Follow existing code style and conventions
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

## 📄 License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenAI** for AI enhancement capabilities
- **Spring Framework** for robust backend infrastructure
- **Next.js** and **React** teams for excellent frontend framework
- **Docker** for containerization platform
- All open-source contributors whose libraries make Aurora possible

---

**Built with ❤️ by the Day-fit team**

For questions, issues, or feature requests, please open an issue on GitHub.
