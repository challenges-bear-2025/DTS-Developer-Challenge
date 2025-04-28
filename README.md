# DTS-Developer-Challenge

## Description

This is a full-stack web application built using **React.js**, **Spring Boot (Java)**, and **PostgreSQL**. The application provides a task management system for HMCTS case workers. It allows users to interact with the frontend built in React, while the backend is powered by Spring Boot and communicates with a PostgreSQL database to manage and store data.

![Screenshot 2025-04-28 164238](https://github.com/user-attachments/assets/ff8a1a1e-c115-4c97-b5e7-729b9970a2f0)

## Tech Stack

- **Frontend**: React.js
- **Backend**: Java Spring Boot
- **Database**: PostgreSQL

## Documentation

- [API Documentation](#) — Comprehensive guide for all available API endpoints.
- [Project Documentation](#) - Project planning and design document.

---

## Setup Guide

To run the application locally, you'll use Docker and Docker Compose to spin up the necessary containers for both the frontend and backend, as well as the PostgreSQL database.

### Prerequisites

1. **Docker** and **Docker Compose** must be installed on your machine.
   - [Docker Installation Guide](https://docs.docker.com/get-docker/)
   - [Docker Compose Installation Guide](https://docs.docker.com/compose/install/)

2. Ensure you have **Maven** installed to build the backend project.
   - [Install Maven](https://maven.apache.org/install.html)

### Clone the Repository

Clone this repository to your local machine:

```bash
git clone https://github.com/challenges-bear-2025/DTS-Developer-Challenge.git
cd DTS-Developer-Challenge
```

### Build the Backend

From inside of the DTS-Developer-Challenge directory:

```bash
cd backend
mvn clean package
```
### Running with Docker

Run the following command inside the root of the repository to build and launch the containers:

```bash
docker-compose up --build
```

Docker compose will:
- Build the backend and frontend containers
- Set up the PostgreSQL database container

This process may take a few minutes, especially the first time as it pulls the docker images.

### Accessing the Application

Once the containers are up and running, you can access the application:

Frontend (React): http://localhost:3000

Backend (Spring Boot): http://localhost:8080

PostgreSQL Database: Running on port 5432 (I accessed using pgAdmin4).
