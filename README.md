 # Task Manager

 A full-stack task management application built with React, TypeScript, NestJS, PostgreSQL, Prisma, and Firebase Authentication.

 ## URL

 https://task-management-app-1738.web.app

 ## Features

 - User registration and login
- Firebase authentication
- Create, view, edit, and delete tasks
- Mark tasks as completed
- Task status management
- Optional due dates
- User-specific tasks
- Backend validation
- Responsive UI

 ## Tech Stack

 ### Frontend

 - React
- TypeScript
- Vite
- Firebase

 ### Backend

 - NestJS
- TypeScript
- Prisma
- PostgreSQL
- Firebase Admin SDK
- class-validator

 ## Getting Started

 ### 1\. Clone the repository

 git clone \<https://github.com/sij-ey/task-management-app\>\
 cd task-manager

 ### 2\. Frontend

 cd frontend\
 npm install\
 npm run dev

 Create a `.env` file using `.env.example` and add your Firebase configuration.

 Frontend runs on:

 http://localhost:5173

 ### 3\. Backend

 cd backend\
 npm install\
 npx prisma migrate dev\
 npm run start:dev

 Make sure PostgreSQL is running and the backend `.env` file is configured.

 Backend runs on:

 http://localhost:3000

 ## Authentication

 The frontend uses Firebase Authentication.

 The Firebase ID token is sent to the NestJS backend, where it is verified using Firebase Admin SDK before protected routes can be accessed.

 ## API Endpoints

 | Method | Endpoint | Description |
| --- | --- | --- |
| GET | /tasks | Get user's tasks |
| POST | /tasks | Create a task |
| PATCH | /tasks/:id | Update a task |
| DELETE | /tasks/:id | Delete a task |

 ## Task Statuses

 - TODO
- IN\_PROGRESS
- COMPLETED

 ## Future Improvements

 - Automated tests
- Search and filtering
- Pagination
- Password reset
- Email verification
- Task priorities
- Deployment
- CI/CD
