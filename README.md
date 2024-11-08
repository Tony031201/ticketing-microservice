
# Ticketing Microservices System

## Overview

This project is a microservices-based application built with **Node.js**, **Next.js**, **Docker**, and **Kubernetes**. It focuses on ticket management, providing core functionalities such as order creation, purchasing, selling, ticket expiration, user authentication, and payment processing.

Each microservice is independently developed and deployed, with inter-service communication handled via an event bus. The system leverages containerization to ensure flexibility, scalability, and high availability.

## Tech Stack

- **Node.js**: Backend services.
- **Next.js**: Server-side rendering and client-side interactions.
- **Docker**: Containerization for consistent environments.
- **Kubernetes**: Orchestration of containerized applications with load balancing and auto-scaling.
- **MongoDB**: Database for persistent data storage.
- **NATS Streaming**: Event bus for communication between microservices.

## Features

### Auth Service
- Handles user registration, login, and authentication.
- Provides JWT-based authentication and authorization.

### Ticket Service
- Manages ticket creation, updates, and deletion.
- Allows users to sell tickets.

### Order Service
- Manages order creation and status tracking.
- Handles order expiration events.

### Payment Service
- Processes payment requests and integrates with third-party payment providers.
- Updates order payment status.

### Event Bus
- Uses **NATS Streaming** to facilitate event-driven communication across services, ensuring data consistency.

## Directory Structure

```plaintext
.
├── auth               # Auth Service
├── tickets            # Ticket Service
├── orders             # Order Service
├── payments           # Payment Service
├── common             # Shared modules
├── client             # Frontend with Next.js
├── infra              # Kubernetes configuration files
├── docker-compose.yml # Docker Compose configuration
└── README.md          # Project documentation

