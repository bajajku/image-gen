# SynthLabel Image Generation Application Architecture

## System Overview

SynthLabel is an image generation application that allows users to generate images with AI models, train custom models, and manage image packs. It is built as a full-stack TypeScript application with a clear separation between frontend, backend, and shared packages. The project follows a modern microservices approach and is organized as a monorepo using Turborepo.

## Monorepo Structure

The project is structured as a Turborepo monorepo with the following components:


## Technology Stack

### Frontend (apps/web)
- **Framework**: Next.js
- **UI Components**: React 19
- **Types**: TypeScript
- **Styling**: CSS (likely with a framework, though not specified in provided code)

### Backend (apps/backend)
- **Runtime**: Bun
- **Framework**: Express.js
- **Database ORM**: Prisma
- **Types**: TypeScript
- **AI Integration**: FalAI for image generation

### Database
- **Type**: PostgreSQL
- **Hosting**: Neon (serverless Postgres)
- **Schema Management**: Prisma

### Shared Packages
- **db**: Prisma client and database utilities
- **common**: Shared TypeScript types and utilities
- **ui**: Shared React components

### Infrastructure
- **Containerization**: Docker
- **Build System**: Turborepo
- **Storage**: AWS S3 for image storage
- **Authentication**: Clerk

## Data Flow Architecture

### 1. User Authentication:
- Users authenticate via Clerk integration.
- JWT tokens provide secure access to API endpoints.

### 2. Image Generation Flow:
- User submits a generation request via frontend.
- Backend validates the request and passes it to the FalAI service.
- Generated images are stored in S3.
- Results are stored in the database and returned to the user.

### 3. Model Training Flow:
- User uploads training data to create custom models.
- Backend processes training requests.
- Model training status is tracked in the database.

## Key Components

### Database Schema
The database includes models for:
- **User**: User accounts and profile information.
- **Model**: Custom AI models for image generation.
- **OutputImages**: Generated images with their metadata.
- **Various status enumerations** to track processing states.

### API Services
The backend Express application provides endpoints for:
- Image generation
- Model training
- User management
- Image pack creation and management

### Storage
AWS S3 is used for storing:
- Generated images
- Training data
- Other user-uploaded content

## Deployment Architecture

The application is containerized with Docker:
- Separate containers for frontend and backend.
- Environment-specific configurations managed via environment variables.
- Services communicate over an internal Docker network.

## Development Environment
During development:
- Frontend runs on port 3000.
- Backend runs on port 8080.

## Production Environment
In production:
- Docker containers are used for consistent deployment.
- Environment variables control service configuration.
- Database connection is secured with SSL.

## Security Architecture
- **Authentication**: Clerk handles user authentication (Not in Production yet).
- **Authorization**: JWT tokens control access to protected resources.
- **Secrets Management**: Environment variables for sensitive credentials.
- **Database Security**: SSL-protected database connections.

## Future Considerations
- Add comprehensive authentication middleware.
- Implement additional AI model providers.
- Scale services horizontally for increased load.
- Add monitoring and observability solutions.
- Enhance caching for improved performance.

This architecture provides a solid foundation for the image generation application, with a clean separation of concerns and the flexibility to scale individual components as needed.
