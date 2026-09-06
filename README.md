Task Manager

A full-stack task management application built with React, TypeScript, NestJS, PostgreSQL, Prisma, and Firebase Authentication.

Description

Task Manager is a full-stack application that allows authenticated users to create, manage, update, complete, and delete their personal tasks.

The application uses Firebase Authentication for user authentication, a NestJS backend for the API, Prisma for database access, and PostgreSQL for persistent task storage.

Each user's tasks are isolated and protected by Firebase ID token verification on the backend.

Features
User registration and login with Firebase Authentication
Protected backend API using Firebase ID token verification
User-specific task management
Create tasks
View tasks
Edit tasks
Complete tasks
Delete tasks
Task status management
Optional due dates
Backend DTO validation
Responsive React interface
Loading, empty, and error states
Persistent task storage with PostgreSQL
Tech Stack
Frontend
React
TypeScript
Vite
Firebase JavaScript SDK
Backend
NestJS
TypeScript
Prisma
PostgreSQL
Firebase Admin SDK
class-validator
Authentication

Firebase Authentication is used by the frontend for user registration and login.

After authentication, the frontend obtains a Firebase ID token and sends it to the NestJS backend using the Authorization header:

Authorization: Bearer <Firebase ID token>


The NestJS backend verifies the token using Firebase Admin SDK before allowing access to protected task routes.

Project Structure

The project is organized into separate frontend and backend applications:

task-manager/
├── frontend/
│   ├── src/
│   ├── public/
│   ├── .env.example
│   └── package.json
│
├── backend/
│   ├── src/
│   ├── prisma/
│   ├── .env.example
│   └── package.json
│
└── README.md

Project Setup
Prerequisites

Make sure the following are installed and configured:

Node.js
npm
PostgreSQL
A Firebase project
Frontend

Navigate to the frontend directory:

cd frontend


Install dependencies:

npm install


Create a .env file based on .env.example:

VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

VITE_API_URL=http://localhost:3000


Start the development server:

npm run dev


The frontend normally runs on:

http://localhost:5173

Backend

Navigate to the backend directory:

cd backend


Install dependencies:

npm install


Configure the backend environment variables according to the backend .env.example.

Make sure PostgreSQL is running.

Run Prisma migrations:

npx prisma migrate dev


Start the backend in development mode:

npm run start:dev


The API normally runs on:

http://localhost:3000

Authentication Flow

Authentication follows this flow:

React
  ↓
Firebase Authentication
  ↓
Firebase ID Token
  ↓
Authorization: Bearer <token>
  ↓
NestJS
  ↓
Firebase Admin verification
  ↓
Protected task endpoint
  ↓
Prisma
  ↓
PostgreSQL


Firebase handles user authentication on the frontend, while Firebase Admin SDK verifies authentication tokens on the backend.

Firebase Admin private credentials are kept exclusively on the backend and are never exposed to the frontend.

API Endpoints
Method	Endpoint	Description
GET	/tasks	Get the authenticated user's tasks
POST	/tasks	Create a task
PATCH	/tasks/:id	Update a task
DELETE	/tasks/:id	Delete a task

All task endpoints require Firebase authentication.

Task Statuses

Tasks support the following statuses:

TODO
IN_PROGRESS
COMPLETED

Validation

The backend validates incoming task data using NestJS DTO validation and class-validator.

Invalid requests are rejected with appropriate HTTP errors instead of being persisted to the database.

Security

The application uses Firebase Authentication and Firebase Admin SDK to protect authenticated resources.

Firebase Authentication handles user credentials.
Firebase Admin verifies Firebase ID tokens on the backend.
Protected task routes require authentication.
Tasks are associated with the authenticated user's identity.
Users can only access their own tasks.
Firebase Admin private credentials are never exposed to the frontend.
Environment files containing secrets are excluded from Git.
Testing the Application

A basic manual test flow is:

Register a new account.
Log out.
Log back in.
Create a task.
Edit the task.
Change its status.
Complete the task.
Delete the task.
Refresh the page.
Confirm authentication and task persistence behave correctly.

Automated frontend and backend tests can be added as the application evolves.

Production Build

To verify the frontend production build:

cd frontend
npm run build


For the backend, use the NestJS production build and start commands:

npm run build
npm run start:prod


Before deploying to production, make sure PostgreSQL, Firebase credentials, environment variables, and the backend configuration are properly configured.

Deployment

The frontend and backend can be deployed independently to their respective hosting environments.

A production deployment should provide:

A production PostgreSQL database
Secure Firebase configuration
Backend Firebase Admin credentials
Production frontend and API environment variables
HTTPS
Database migrations
Appropriate CORS configuration
Future Improvements

Potential future improvements include:

Automated frontend and backend tests
Task filtering and sorting
Task search
Pagination
Password reset UI
Email verification
Task categories
Task priorities
Improved task organization
CI/CD
Production deployment
Enhanced observability and monitoring
Resources

For more information about the technologies used in this project:

React documentation
Vite documentation
NestJS documentation
Prisma documentation
PostgreSQL documentation
Firebase documentation
Support

If you encounter an issue while running the application, verify that PostgreSQL is running, the required environment variables are configured, Firebase is correctly set up, and the backend migrations have been applied.

License
