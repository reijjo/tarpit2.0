# AGENTS.md

## Overview

This document provides comprehensive guidance on using AI agents and automation tools within the tarpit2.0 project. The project is a full-stack application built with Next.js (React) for the frontend and Node.js with TypeScript for the backend, utilizing Prisma ORM for database operations and PostgreSQL as the database.

## Table of Contents

1. [Introduction](#introduction)
2. [Agent Categories](#agent-categories)
3. [Setup & Configuration](#setup--configuration)
4. [Usage Guidelines](#usage-guidelines)
5. [Project-Specific Agents](#project-specific-agents)
6. [Troubleshooting](#troubleshooting)
7. [Contributing](#contributing)

## Introduction

The tarpit2.0 project leverages AI agents and automation tools to enhance development productivity, maintain code quality, and streamline the development workflow. This document serves as a comprehensive guide for developers working on the project.

### Project Architecture

- **Frontend**: Next.js 15+ with TypeScript, React 19+
- **Backend**: Node.js with TypeScript, Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT-based with email verification
- **Testing**: Vitest for frontend, custom test setup for backend
- **CI/CD**: GitHub Actions with comprehensive workflows

## Agent Categories

### Development Agents

Development agents assist with code generation, refactoring, and development tasks.

#### Code Generation Agent

- **Purpose**: Generate boilerplate code, components, and utilities
- **Usage**: Use for creating new features, components, or API endpoints
- **Best Practices**:
  - Always review generated code for security vulnerabilities
  - Ensure generated code follows project conventions
  - Test generated code thoroughly
  - Keep all generated functions under 150 lines
  - Use bun for any package management operations
  - Never perform git operations
  - Never write too complicated code, keep the code clean and readable also after 15 beers or in hangover

#### Refactoring Agent

- **Purpose**: Improve code quality, performance, and maintainability
- **Usage**: Use when optimizing existing code or updating patterns
- **Best Practices**:
  - Create backups before major refactoring
  - Run tests after refactoring changes
  - Document the rationale for refactoring decisions
  - Break down functions exceeding 150 lines into smaller, focused functions
  - Use bun for dependency management during refactoring
  - Never perform git operations

### Infrastructure Agents

Infrastructure agents handle CI/CD, deployment, and monitoring tasks.

#### CI/CD Agent

- **Purpose**: Automate build, test, and deployment processes
- **Configuration**: See `.github/workflows/` directory
- **Usage**: Automatically triggered on pull requests and merges
- **Best Practices**:
  - Keep workflows fast and efficient
  - Use caching for dependencies
  - Implement proper error handling

#### Deployment Agent

- **Purpose**: Deploy applications to staging and production environments
- **Configuration**: Defined in GitHub Actions workflows
- **Usage**: Automatic deployment on main branch merges
- **Best Practices**:
  - Use environment-specific configurations
  - Implement rollback procedures
  - Monitor deployment success

### Quality Assurance Agents

Quality assurance agents ensure code quality, security, and performance.

#### Linting Agent

- **Purpose**: Enforce code style and catch potential issues
- **Tools**: ESLint, Prettier
- **Configuration**: `.eslintrc`, `.prettierrc`
- **Usage**: Run before committing code
- **Best Practices**:
  - Fix all linting errors before committing
  - Use auto-fix where available
  - Configure IDE integration

#### Type Checking Agent

- **Purpose**: Ensure TypeScript type safety
- **Tools**: TypeScript compiler
- **Configuration**: `tsconfig.json`
- **Usage**: Run during development and CI/CD
- **Best Practices**:
  - Use strict type checking
  - Avoid `any` types when possible
  - Implement proper type definitions

#### Security Scanning Agent

- **Purpose**: Identify security vulnerabilities
- **Tools**: npm audit, dependency scanning
- **Usage**: Run during CI/CD pipeline
- **Best Practices**:
  - Keep dependencies up to date
  - Address high and critical vulnerabilities immediately
  - Use security-focused development practices

### Documentation Agents

Documentation agents help maintain and generate project documentation.

#### API Documentation Agent

- **Purpose**: Generate and maintain API documentation
- **Tools**: Custom documentation generation
- **Usage**: Update when API changes occur
- **Best Practices**:
  - Keep documentation in sync with code
  - Use clear, descriptive examples
  - Include error handling documentation

#### Code Comment Agent

- **Purpose**: Generate and maintain code comments
- **Usage**: Use for complex algorithms and business logic
- **Best Practices**:
  - Write clear, concise comments
  - Update comments when code changes
  - Focus on "why" rather than "what"

## Setup & Configuration

### Prerequisites

- Node.js 20+
- Bun package manager
- PostgreSQL database
- Docker (for containerized development)

### Environment Setup

1. **Install Dependencies**:

   ```bash
   # Frontend
   cd client && bun install

   # Backend
   cd server && bun install
   ```

2. **Database Setup**:

   ```bash
   # Start PostgreSQL with Docker
   docker compose up -d

   # Run migrations
   cd server && bun run prisma migrate dev
   ```

3. **Environment Variables**:
   - Copy `.env_example` to `.env` in both client and server directories
   - Configure database connection strings
   - Set up authentication secrets

### Agent Configuration

Each agent type has specific configuration requirements:

#### Development Agent Configuration

- Configure IDE extensions for AI assistance
- Set up code templates and snippets
- Configure project-specific patterns

#### Infrastructure Agent Configuration

- Set up GitHub Actions secrets
- Configure deployment environments
- Set up monitoring and alerting

#### Quality Assurance Agent Configuration

- Configure linting rules in `.eslintrc`
- Set up Prettier formatting rules
- Configure TypeScript strict mode

## Development Rules

### Core Operational Constraints

- **Git Operations**: Agents must never perform git push, pull, or any other git operations that modify the repository state
- **Package Management**: Always use bun for package management instead of npm
- **Code Quality**: Functions must not exceed 150 lines of code
- **Testing**: All generated code must include appropriate tests

### Security Constraints

- Never commit sensitive information
- Always validate user inputs
- Use secure coding practices
- Implement proper authentication and authorization

### Code Style Requirements

- Maintain consistent formatting using project linting rules
- Use meaningful variable and function names
- Follow TypeScript strict mode requirements
- Document complex logic and business rules

## Usage Guidelines

### General Guidelines

1. **Agent Selection**: Choose the appropriate agent for the task at hand
2. **Code Review**: Always review agent-generated code
3. **Testing**: Ensure all changes are properly tested
4. **Documentation**: Update documentation when using agents
5. **Git Operations**: Never perform git operations - these must be done manually by developers
6. **Package Management**: Use bun exclusively for all package operations (install, update, run scripts)
7. **Function Length**: Keep all functions under 150 lines for maintainability

### Development Workflow

1. **Planning**: Use agents for brainstorming and planning
2. **Implementation**: Use development agents for coding tasks, ensuring functions stay under 150 lines
3. **Testing**: Use QA agents for quality assurance
4. **Deployment**: Use infrastructure agents for deployment
5. **Package Management**: Always use bun commands (e.g., `bun install`, `bun run dev`) instead of npm equivalents

### Best Practices

- **Security First**: Always prioritize security when using agents
- **Code Quality**: Maintain high code quality standards, keeping functions under 150 lines
- **Performance**: Consider performance implications of agent-generated code
- **Maintainability**: Ensure code remains maintainable and readable
- **Package Management**: Use bun for all dependency management to ensure consistency with project setup
- **Git Safety**: Never automate git operations to prevent unintended repository changes

## Project-Specific Agents

### Next.js Development Agents

#### Component Generation

- **Purpose**: Generate React components with proper TypeScript types
- **Usage**: Use for creating new UI components
- **Example**:

  ```typescript
  // Generated component structure
  interface ComponentProps {
    // TypeScript interface
  }

  export default function ComponentName({}: ComponentProps) {
    // Component implementation
  }
  ```

#### API Route Generation

- **Purpose**: Generate Next.js API routes
- **Usage**: Use for creating new API endpoints
- **Best Practices**:
  - Follow RESTful conventions
  - Implement proper error handling
  - Use TypeScript for type safety

### Prisma Database Agents

#### Schema Generation

- **Purpose**: Generate and update database schemas
- **Usage**: Use when adding new entities or modifying existing ones
- **Example**:
  ```prisma
  model User {
    id        Int      @id @default(autoincrement())
    email     String   @unique
    name      String?
    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt
  }
  ```

#### Migration Management

- **Purpose**: Create and manage database migrations
- **Usage**: Use when schema changes are needed
- **Best Practices**:
  - Always backup data before migrations
  - Test migrations in development environment
  - Document migration purpose and impact

### Authentication Agents

#### JWT Token Management

- **Purpose**: Handle JWT token creation and validation
- **Usage**: Use for implementing authentication features
- **Security Considerations**:
  - Use secure token expiration
  - Implement proper token refresh
  - Store secrets securely

#### Email Verification

- **Purpose**: Handle email verification workflows
- **Usage**: Use for user registration and security features
- **Best Practices**:
  - Use secure email templates
  - Implement proper token expiration
  - Handle verification errors gracefully

### Testing Agents

#### Unit Test Generation

- **Purpose**: Generate unit tests for components and functions
- **Usage**: Use for maintaining test coverage
- **Tools**: Vitest for frontend, custom setup for backend
- **Best Practices**:
  - Write meaningful test names
  - Test edge cases
  - Mock external dependencies

#### Integration Test Generation

- **Purpose**: Generate integration tests for API endpoints
- **Usage**: Use for testing API functionality
- **Best Practices**:
  - Test real database interactions
  - Use test databases
  - Clean up test data

## Troubleshooting

### Common Issues

#### Agent Not Responding

- **Solution**: Check agent configuration and dependencies
- **Debug Steps**:
  1. Verify agent is properly installed
  2. Check configuration files
  3. Review error logs

#### Code Generation Errors

- **Solution**: Review generated code for syntax and logic errors
- **Debug Steps**:
  1. Check TypeScript compilation
  2. Run linting tools
  3. Test generated functionality

#### CI/CD Failures

- **Solution**: Review GitHub Actions logs and configuration
- **Debug Steps**:
  1. Check workflow configuration
  2. Review dependency installation
  3. Verify environment variables

### Performance Issues

#### Slow Agent Response

- **Cause**: Large codebase or complex requests
- **Solution**: Optimize agent configuration and requests
- **Best Practices**:
  - Use specific, focused requests
  - Implement caching where appropriate
  - Monitor agent performance

#### Memory Usage

- **Cause**: Large file processing or complex operations
- **Solution**: Optimize memory usage and implement streaming
- **Best Practices**:
  - Process files in chunks
  - Use efficient data structures
  - Monitor memory usage

### Security Issues

#### Vulnerable Dependencies

- **Solution**: Update dependencies and implement security scanning
- **Prevention**:
  - Use automated security scanning
  - Keep dependencies up to date
  - Review security advisories

#### Code Injection

- **Solution**: Implement input validation and sanitization
- **Prevention**:
  - Use parameterized queries
  - Validate all user input
  - Implement proper authentication

## Contributing

### Adding New Agents

1. **Agent Design**:
   - Define agent purpose and scope
   - Design agent interface and configuration
   - Plan integration with existing toolchain

2. **Implementation**:
   - Implement agent functionality
   - Add proper error handling
   - Include comprehensive testing

3. **Documentation**:
   - Update this AGENTS.md file
   - Add usage examples
   - Document configuration options

4. **Testing**:
   - Test agent in development environment
   - Verify integration with existing agents
   - Test error scenarios

### Agent Development Guidelines

- **Code Quality**: Follow project coding standards, keeping all functions under 150 lines
- **Security**: Implement security best practices, never commit sensitive information
- **Performance**: Optimize for performance and scalability
- **Documentation**: Provide clear documentation and examples
- **Package Management**: Use bun exclusively for all dependency management operations
- **Git Safety**: Never perform automated git operations (push, pull, commit, etc.)
- **Function Length**: Ensure all generated functions remain under 150 lines for maintainability

### Review Process

1. **Code Review**: All agent changes require code review
2. **Testing**: Ensure comprehensive test coverage
3. **Documentation**: Verify documentation is up to date
4. **Integration**: Test integration with existing systems

## Support

For questions or issues related to agents:

1. **Documentation**: Check this AGENTS.md file first
2. **Issues**: Create GitHub issues for bugs or feature requests
3. **Discussions**: Use GitHub Discussions for questions and feedback
4. **Team**: Contact the development team for urgent issues

## Version History

- **v1.0.0**: Initial agent documentation
- **v1.1.0**: Added project-specific agent examples
- **v1.2.0**: Enhanced troubleshooting section
- **v1.3.0**: Added contributing guidelines

## License

This documentation is part of the tarpit2.0 project and follows the same license terms.
