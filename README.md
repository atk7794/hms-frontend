# Hospital Management System – Frontend

A modern and role-based **Hospital Management System frontend** built with **Angular** and **Tailwind CSS**, designed to work seamlessly with a Spring Boot REST API backend.

This application provides separate dashboards and features for **Admin**, **Doctor**, and **Patient** roles, with secure authentication, authorization guards, and real-world hospital workflows.

---

## 🏥 Project Overview

The Hospital Management System (HMS) is a full-stack web application that enables hospitals or clinics to manage:

- Patients and doctors
- Appointments
- Medical records
- Prescriptions
- User activity & audit logs
- Email notifications

This repository contains the **frontend (Angular)** part of the system.

👉 Backend repository: **Spring Boot + PostgreSQL**

---

## 🚀 Features

### 🔐 Authentication & Authorization
- JWT-based authentication
- Role-based access control (Admin / Doctor / Patient)
- Angular Route Guards
- HTTP Interceptor for token handling

### 🧑‍⚕️ Role-Based Dashboards
- **Admin Dashboard**
  - Manage doctors & patients
  - View system activity logs
  - Monitor user actions
- **Doctor Dashboard**
  - View appointments
  - Manage medical records
  - Create prescriptions
- **Patient Dashboard**
  - Book appointments
  - View medical history
  - Access prescriptions

### 📊 System Logs
- User activity tracking
- Email log listing
- Action history for audit purposes

### 🎨 UI & UX
- Responsive design with Tailwind CSS
- Clean and modern dashboard layout
- Reusable Angular components
- Form validation and user-friendly feedback

---

## 🛠️ Tech Stack

### Frontend
- Angular 16
- TypeScript
- Tailwind CSS
- RxJS
- Angular Router
- HTTP Client

### Backend (separate repository)
- Spring Boot
- Spring Security + JWT
- PostgreSQL
- JPA / Hibernate
- Docker

---

## 📁 Project Structure (Simplified)

```text
src/
 ├── app/
 │   ├── components/      # Reusable UI components
 │   ├── pages/           # Page-level components
 │   ├── services/        # API communication
 │   ├── models/          # Interfaces & DTOs
 │   ├── guards/          # Auth & role guards
 │   ├── interceptors/    # JWT interceptor
 │   └── app.routes.ts
 └── environments/
```

---

## ⚙️ Environment Configuration

Create the following environment files:

### environment.ts
```ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api'
};
```

### environment.prod.ts
```ts
export const environment = {
  production: true,
  apiUrl: 'BACKEND_PRODUCTION_URL'
};
```

---

## ▶️ Running the Project Locally
- npm install
- ng serve

---

## Navigate to:
👉 http://localhost:4200

---

## 🔗 Deployment

- Frontend: Vercel (planned / in progress)
- Backend: Render / Docker-based deployment
- Database: PostgreSQL

Live demo links will be added after deployment.

---

## 🎯 Purpose of This Project

This project was developed to demonstrate:

- Real-world full-stack architecture
- Secure authentication & authorization
- Clean Angular project structure
- Scalable and maintainable frontend design
- Enterprise-style backend–frontend integration

---

## 👨‍💻 Author

**Tuncay Köse**  
Computer Engineer  
GitHub: https://github.com/atk7794

---

📌 This project is actively maintained and open for further improvements.
