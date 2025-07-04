# Fitt.FF

A full-stack fitness tracking web application designed to help users manage and monitor their personal health journey through structured data logging and progress visualization.

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [Authentication & Authorization](#-authentication--authorization)
- [Database Schema & Models](#-database-schema--models)
- [Features & Functionality](#-features--functionality)
- [GraphQL API](#-graphql-api)
- [REST API Routes](#-rest-api-routes)
- [Frontend UI/UX](#-frontend-uiux)
- [Testing Strategy](#-testing-strategy)
- [Weather API Integration](#-weather-api-integration)
- [Project Setup & Run Instructions](#-project-setup--run-instructions)

## 🧱 Project Overview

**Fitt.FF** is a comprehensive fitness tracking platform that provides a seamless interface for users to log daily workouts and meals, set fitness goals, assign personal trainers, and even view real-time weather data to plan outdoor activities better.

Built with modern technologies and a clean, responsive UI, the app offers both REST and GraphQL interfaces for flexibility and scalability. Whether you're a fitness enthusiast or a beginner trying to stay consistent, Fitt.FF provides an organized, user-friendly ecosystem to support health-conscious lifestyles.

### Key Highlights

- ✅ Secure user registration and login via JWT authentication
- 🏋️ Workout tracking with type, duration, and date
- 🥗 Meal logging with calorie breakdown and meal timing
- 🎯 Fitness goal setting (target weight and target date)
- 🧑‍🏫 Trainer management and user-trainer assignments
- 🌤️ Weather forecast integration via OpenWeatherMap
- 🔁 Dual support for RESTful and GraphQL APIs
- 📊 Responsive dashboard built using React, TypeScript, Tailwind, and ShadCN

## 🛠️ Tech Stack

### Frontend

| Technology | Purpose |
|------------|---------|
| **React (v18)** | Component-based UI for the SPA (Single Page Application) |
| **TypeScript** | Adds static typing to JavaScript for safer, more predictable code |
| **Vite** | Lightning-fast development server and bundler |
| **Tailwind CSS** | Utility-first CSS framework for responsive design |
| **ShadCN UI** | Beautiful, accessible UI components built with Radix and Tailwind |
| **React Router DOM (v7)** | Client-side routing with nested layout support |
| **Apollo Client** | Handles GraphQL queries and caching on the frontend |
| **Zod + React Hook Form** | Form validation and handling in a type-safe way |
| **Radix UI + Lucide Icons** | For headless UI components and icons, enhancing user experience |

### Backend

| Technology | Purpose |
|------------|---------|
| **Node.js + Express** | Core server runtime and HTTP handling |
| **Sequelize (ORM)** | Object-relational mapping for MySQL |
| **MySQL** | Primary relational database |
| **GraphQL (graphql, graphql-http)** | Flexible querying interface alongside REST |
| **JWT (jsonwebtoken)** | Secure stateless authentication mechanism |
| **bcryptjs** | Password hashing for security |
| **CORS** | Handles cross-origin requests between frontend and backend |
| **Axios** | HTTP client used for external API integration (weather) |
| **Dotenv** | Secure environment variable management |
| **Winston** | Structured logging with file and console outputs |

### Testing

| Tool | Purpose |
|------|---------|
| **Jest** | Unit and integration testing framework |
| **Supertest** | HTTP assertions for Express API endpoints |
| **SQLite** (for testing) | In-memory database used in test environment for speed and isolation |

### Third-Party Integration

| Service | Purpose |
|---------|---------|
| **OpenWeatherMap API** | Real-time weather data via GraphQL |
| **GraphiQL (via Ruru)** | GraphQL playground for query testing |

## 🧩 System Architecture

The **Fitt.FF** application follows a **modular, full-stack architecture** that cleanly separates concerns between the frontend, backend, and database layers.

### High-Level Overview

```
          ┌──────────────────────┐
          │     Client (SPA)     │
          │ React + Vite + TS    │
          │ Tailwind + ShadCN UI │
          └─────────┬────────────┘
                    │
        REST/GraphQL (HTTP Requests)
                    │
          ┌─────────▼────────────┐
          │     Node.js Server   │
          │   Express + GraphQL  │
          └─────────┬────────────┘
                    │
         Sequelize ORM (Model Layer)
                    │
          ┌─────────▼────────────┐
          │      MySQL DB        │
          └──────────────────────┘
```

### Data Flow

#### User Interaction Flow (Frontend to Backend)

1. **React UI** sends API calls via Axios or Apollo Client
2. API calls hit:
   - `/api/*` for **REST routes**, or
   - `/graphql` endpoint for **GraphQL**
3. **Express Server** routes the request to the correct controller (REST) or resolver (GraphQL)
4. **Sequelize** ORM handles data operations with the **MySQL** database
5. Server responds with JSON (REST) or GraphQL response

### Backend Structure

```
backend/
├── index.js              # App entry point
├── config/               # Database connection config
├── models/               # Sequelize models (User, Workout, etc.)
├── routes/               # REST API route handlers
├── graphql/              # GraphQL schema + resolvers
├── utils/                # Logger, weather API helper
├── tests/                # Jest + Supertest tests
```

### Frontend Structure

```
frontend/
├── src/
│   ├── pages/           # Route-based views (e.g., HomePage, GoalsPage)
│   ├── components/      # Reusable UI + layout components
│   ├── context/         # Auth context (global state)
│   ├── api/             # Axios wrapper for REST APIs
│   ├── lib/             # Utility functions
│   └── App.tsx          # Routing + ProtectedRoute wrapper
```

### API Strategy

- **REST API**: Used for CRUD operations (`/users`, `/workouts`, etc.)
- **GraphQL API**: Used for advanced querying, nested data (e.g., `user -> workouts`), and external integrations like weather

Having both REST and GraphQL provides **flexibility**, enabling simple frontend pages to use REST while complex data joins and external APIs use GraphQL.

## 🔐 Authentication & Authorization

Fitt.FF implements a **secure, token-based authentication system** using **JWT (JSON Web Tokens)** for stateless user sessions, along with **bcryptjs** for strong password hashing.

### Backend (Express + JWT)

#### Signup Flow

1. **User submits** `name`, `email`, and `password` via POST `/auth/signup`
2. Backend:
   - Checks if the email is already registered
   - Password is **hashed using `bcryptjs`** with a salt before being stored
   - A new user is created in the `User` table
3. Response: `{ message: 'User created successfully' }`

#### Login Flow

1. **User submits** email and password via POST `/auth/login`
2. Backend:
   - Looks up the user by email
   - Validates the password using `bcrypt.compare`
   - If successful, **generates a JWT token**:
     ```js
     jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1d' });
     ```
3. Response:
   ```json
   {
     "token": "<JWT_TOKEN>",
     "user": { "id": 1, "name": "John Doe", "email": "john@example.com" }
   }
   ```

### Frontend (React + AuthContext)

#### Auth State Management

- A **global context** (`AuthContext.tsx`) handles login/logout and persists user state
- The token is stored client-side
- Components use the custom `useAuth()` hook to access:
  - `isAuthenticated`
  - `user`
  - `login()`, `logout()` methods

#### ProtectedRoute Component

- Guards all routes under `/dashboard` from unauthenticated access
- If `!isAuthenticated`, it redirects the user to `/login`

Example:
```tsx
<Route
  path="/"
  element={
    <ProtectedRoute>
      <RootLayout />
    </ProtectedRoute>
  }
/>
```

### Security Practices

- Passwords are never stored in plain text
- Tokens include an expiration (`1 day`) to reduce risks of token leakage
- Auth routes handle error responses properly (e.g., invalid credentials, duplicate emails)

## 🧬 Database Schema & Models

Fitt.FF uses **Sequelize ORM** to manage a **MySQL relational database**. The schema is designed around a **user-centric fitness system**, supporting relationships between users, workouts, meals, goals, and trainers.

### Entity-Relationship Diagram (ERD)

```
        ┌────────────┐        ┌─────────────┐        ┌──────────┐
        │   Trainer  │◄──────►│ UserTrainer │◄──────►│   User   │
        └────────────┘        └─────────────┘        └──────────┘
                                                       ▲   ▲   ▲
                                                       │   │   │
                                          ┌────────────┘   │   └───────────┐
                                          │                │               │
                                     ┌────┴───┐       ┌────┴───┐       ┌───┴────┐
                                     │ Workout│       │  Meal  │       │  Goal  │
                                     └────────┘       └────────┘       └────────┘
```

### Model Descriptions

#### 👤 User

| Field | Type | Details |
|-------|------|---------|
| `name` | String | User's full name |
| `email` | String | Unique, required |
| `password` | String | Hashed with bcrypt before save |

**Associations:**
- `hasMany` Workouts, Meals
- `hasOne` Goal
- `belongsToMany` Trainers (via `UserTrainer`)

#### 🏋️ Workout

| Field | Type | Details |
|-------|------|---------|
| `type` | String | e.g., Cardio, Strength |
| `duration` | Integer | Duration in minutes |
| `date` | Date | Workout date (YYYY-MM-DD) |
| `UserId` | Integer | Foreign key to `User` |

**Associations:** `belongsTo` User

#### 🥗 Meal

| Field | Type | Details |
|-------|------|---------|
| `name` | String | e.g., Breakfast, Lunch |
| `calories` | Integer | Total calories |
| `time` | String | Meal time (e.g., 08:00 AM) |
| `UserId` | Integer | Foreign key to `User` |

**Associations:** `belongsTo` User

#### 🎯 Goal

| Field | Type | Details |
|-------|------|---------|
| `targetWeight` | Float | Goal weight in kg |
| `targetDate` | Date | Target completion date |
| `UserId` | Integer | Foreign key to `User` |

**Associations:**
- `belongsTo` User
- User `hasOne` Goal

#### 🧑‍🏫 Trainer

| Field | Type | Details |
|-------|------|---------|
| `name` | String | Trainer name |
| `specialization` | String | e.g., Strength, Yoga |

**Associations:** `belongsToMany` Users via `UserTrainer`

#### 🔁 UserTrainer (Join Table)

| Field | Type | Details |
|-------|------|---------|
| `UserId` | Integer | Foreign key to `User` |
| `TrainerId` | Integer | Foreign key to `Trainer` |

**Associations:**
- Many-to-Many between `User` and `Trainer`
- Uses `through: UserTrainer` via Sequelize

### Sequelize Relationship Summary

```js
// User and Workout
User.hasMany(Workout);
Workout.belongsTo(User);

// User and Meal
User.hasMany(Meal);
Meal.belongsTo(User);

// User and Goal
User.hasOne(Goal);
Goal.belongsTo(User);

// User and Trainer (Many-to-Many)
User.belongsToMany(Trainer, { through: UserTrainer });
Trainer.belongsToMany(User, { through: UserTrainer });
```

## 🚀 Features & Functionality

**Fitt.FF** provides a comprehensive suite of fitness tracking tools and user management capabilities that together form a full-fledged personal health dashboard.

### 1. User Authentication
- **Signup**: Register with name, email, and password
- **Login**: Authenticates using JWT; credentials are verified via bcrypt
- **Protected Routes**: Dashboard and inner pages require a valid token
- **Logout**: Clears auth state from the frontend

### 2. Workout Tracking
- **Add New Workout**: Choose type (e.g., Cardio, Strength), duration (in minutes), and date
- **Edit/Delete Workouts**: Update workout logs or remove outdated entries
- **View All Workouts**: Paginated or list view for user-specific workouts
- **Workout Model Fields**: `type`, `duration`, `date`, `UserId`

### 3. Meal Logging
- **Track Meals**: Log meal name (Breakfast, Lunch, etc.), calorie count, and time
- **Edit/Delete**: Modify calorie values or update time
- **Meal Model Fields**: `name`, `calories`, `time`, `UserId`

### 4. Goal Setting
- **Set Target Weight**: Users can set a fitness goal with a deadline
- **Update/Modify**: Adjust the target weight or date as needed
- **Goal Model Fields**: `targetWeight`, `targetDate`, `UserId`

### 5. Trainer Management
- **Trainer Directory**: List of available trainers with their specialization
- **Assign Trainers to Users**: Many-to-many relation managed via a join table (`UserTrainer`)
- **Trainer Model Fields**: `name`, `specialization`

### 6. Weather Integration
- **Search by City**: Users can search weather for a city
- **Get Forecast**: Uses OpenWeatherMap API to fetch temperature, weather description, humidity, and wind speed
- **GraphQL Powered**: Fetched using the GraphQL `weather(city: String!)` query

### 7. User Management
- **List All Users**: Admin dashboard displays all users
- **CRUD Operations**: Create, edit, and delete users from the system
- Passwords are hashed and not exposed

### 8. Route Protection (Frontend)
- **ProtectedRoute Component**: Blocks unauthenticated access to main pages
- **Context-based Auth**: `AuthContext` handles login state across the app

### 9. Dual API Support
- **REST API**: For CRUD on meals, workouts, goals, users, trainers
- **GraphQL API**: For nested queries and external weather fetches

### 10. Responsive Dashboard UI
- Mobile-friendly layout with collapsible sidebar
- Pages: `/` (Dashboard), `/users`, `/workouts`, `/meals`, `/goals`, `/trainers`, `/weather`
- Built with Tailwind, ShadCN, and Radix for smooth UI/UX

## ⚡ GraphQL API

Fitt.FF exposes a powerful GraphQL layer alongside REST, enabling flexible querying, nested data access, and integration with external services like weather.

### Schema Overview

Defined in `backend/graphql/schema.js`, the schema consists of:
- **Types**: `User`, `Workout`, `Meal`, `Goal`, `Trainer`, `Weather`
- **RootQuery**: Main entry point for all data queries
- **No Mutations** implemented (read-only operations only)

### Type Definitions

#### User
Fields:
- `id`, `name`, `email`
- `workouts`: List of user workouts (resolved via foreign key)
- `meals`: List of meals logged by user
- `goal`: Associated goal (1-to-1)

#### Workout, Meal, Goal
Each has:
- Primitive fields (`type`, `duration`, etc.)
- A `user` field (resolved with `User.findByPk(UserId)`)

#### Trainer
- `id`, `name`, `specialization`

#### Weather
- `city`, `temperature`, `description`, `humidity`, `windSpeed`

### Root Queries

```graphql
# User Queries
users: [User]
user(id: ID): User

# Workout Queries
workouts: [Workout]
workout(id: ID): Workout

# Meal Queries
meals: [Meal]
meal(id: ID): Meal

# Goal Queries
goals: [Goal]
goal(id: ID): Goal

# Trainer Queries
trainers: [Trainer]
trainer(id: ID): Trainer

# Weather (external API)
weather(city: String!): Weather
```

### Weather Query Example

```graphql
query {
  weather(city: "Kolkata") {
    city
    temperature
    description
    humidity
    windSpeed
  }
}
```

### Playground
- GraphiQL UI available at `/graphiql`
- Server endpoint: `/graphql`
- Used for testing queries and visual exploration of schema

## 🌐 REST API Routes

The REST API in Fitt.FF follows resource-centric design, built using **Express**. All routes are prefixed with `/api/`.

### User Routes – `/api/users`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users` | Get all users |
| GET | `/users/:id` | Get user by ID |
| POST | `/users` | Create new user |
| PUT | `/users/:id` | Update user by ID |
| DELETE | `/users/:id` | Delete user by ID |

### Auth Routes – `/api/auth`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/signup` | Register a new user |
| POST | `/login` | Login and receive JWT token |

Response:
```json
{
  "token": "JWT_TOKEN",
  "user": { "id": 1, "name": "John", "email": "john@example.com" }
}
```

### Workout Routes – `/api/workouts`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/workouts` | Get all workouts |
| GET | `/workouts/:id` | Get workout by ID |
| POST | `/workouts` | Create a new workout |
| PUT | `/workouts/:id` | Update workout |
| DELETE | `/workouts/:id` | Delete workout |

### Meal Routes – `/api/meals`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/meals` | Get all meals |
| GET | `/meals/:id` | Get meal by ID |
| POST | `/meals` | Create a new meal |
| PUT | `/meals/:id` | Update meal |
| DELETE | `/meals/:id` | Delete meal |

### Goal Routes – `/api/goals`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/goals` | Get all goals |
| GET | `/goals/:id` | Get goal by ID |
| POST | `/goals` | Create a new goal |
| PUT | `/goals/:id` | Update goal |
| DELETE | `/goals/:id` | Delete goal |

### Trainer Routes – `/api/trainers`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/trainers` | Get all trainers |
| GET | `/trainers/:id` | Get trainer by ID |
| POST | `/trainers` | Create new trainer |
| PUT | `/trainers/:id` | Update trainer |
| DELETE | `/trainers/:id` | Delete trainer |

### User-Trainer Relationship – `/api/userTrainers`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/userTrainers` | Assign a trainer to a user |

Payload:
```json
{
  "UserId": 1,
  "TrainerId": 2
}
```

## 🎨 Frontend UI/UX

The frontend of Fitt.FF is a **Single Page Application (SPA)** built using **React 18 + TypeScript** with **Tailwind CSS** and **ShadCN UI**.

### Structure Overview

```
frontend/
├── src/
│   ├── pages/         → Page-level views (WorkoutsPage, MealsPage, etc.)
│   ├── components/    → UI + reusable widgets (Sidebar, WeatherCard, etc.)
│   ├── layout/        → Dashboard layout, Navbar, Drawer
│   ├── context/       → AuthContext (global auth state)
│   ├── api/           → Axios functions for REST calls
│   ├── lib/           → Utility functions, constants
│   └── App.tsx        → Route definitions using React Router v7
```

### Routing

Uses `react-router-dom v7` with **nested layouts**. All dashboard routes are wrapped under a **ProtectedRoute** and the `RootLayout` dashboard shell.

Example:
```tsx
<Route
  path="/"
  element={
    <ProtectedRoute>
      <RootLayout />
    </ProtectedRoute>
  }
>
  <Route index element={<Dashboard />} />
  <Route path="meals" element={<MealsPage />} />
</Route>
```

### Authentication Context

`AuthContext.tsx` manages:
- `user`: Logged-in user info
- `token`: JWT token from backend
- `login()` / `logout()`: Functions to authenticate user

### UI Components

Built using:
- **Tailwind CSS**: Utility-first styling, dark/light mode supported
- **ShadCN UI**: Accessible, styled base components (buttons, modals, inputs)
- **Radix UI**: Underlying primitives (popover, dialog, drawer)
- **Lucide Icons**: Icon set used across buttons and nav items

### Pages Included

| Path | Description |
|------|-------------|
| `/login` | Login form with validation |
| `/signup` | Registration form |
| `/` | Dashboard landing page |
| `/workouts` | Log, view, update, delete workouts |
| `/meals` | Meal logging interface |
| `/goals` | Goal tracking dashboard |
| `/trainers` | Trainer directory + assign trainer |
| `/weather` | Weather by city using GraphQL |
| `/users` | Admin view of all registered users |

### Forms & Validation

- Uses `react-hook-form` for controlled inputs
- `zod` schema validation enforces structure on form submission

### Responsiveness

- Sidebar collapses on smaller screens
- Uses Tailwind's mobile-first design
- Drawer menu opens on mobile instead of sidebar

## 🧪 Testing Strategy

Fitt.FF includes a backend test suite focused on verifying database operations, API behavior, and controller logic using **Jest** and **Supertest**.

### Testing Tools

| Tool | Purpose |
|------|---------|
| **Jest** | Test runner and assertion library |
| **Supertest** | HTTP assertions for Express routes |
| **SQLite (memory)** | Lightweight DB for tests |

### Backend Tests (Located in `/tests/`)

Each domain module has its own test file:

- **`user.test.js`**: Creates new user, tests duplicate email handling, validates password hashing
- **`goal.test.js`**: Links goal to user, verifies relationships, checks CRUD operations
- **`workout.test.js`**: Creates workout for user, tests GET/PUT/DELETE operations
- **`meal.test.js`**: Similar to workouts with create/update/delete functionality
- **`trainer.test.js`**: Creates trainers, assigns to users, tests many-to-many relationships
- **`auth.test.js`**: Signup/login tests, verifies JWT generation, tests invalid credentials
- **`weather.test.js`**: Mocks OpenWeatherMap API, verifies GraphQL query structure
- **`healthcheck.test.js`**: Verifies root route returns proper JSON response

### Test Environment

- `NODE_ENV=test` enables SQLite memory usage
- Sequelize initialized with `sqlite::memory:` in test config
- All models are synced before each test block

### Coverage Summary

| Area | Covered |
|------|---------|
| Models | ✅ |
| Controllers | ✅ |
| Routes | ✅ |
| Auth Flow | ✅ |
| GraphQL | ✅ (Weather) |
| UI/Frontend | ❌ (Not implemented) |

### Test Execution

```bash
cd backend
npm run test
```

## 🌦️ Weather API Integration

The Fitt.FF app includes a real-time weather feature powered by the **OpenWeatherMap API**, accessible via a **GraphQL endpoint**.

### API Used

- **OpenWeatherMap Current Weather Data API**
- Endpoint: `https://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}&units=metric`
- Integrated via **Axios** in a custom utility module (`utils/weather.js`)

### Implementation Flow

1. **User Input**: City name is submitted from the frontend form (`/weather` page)
2. **GraphQL Query**: Sent to `/graphql` endpoint:
   ```graphql
   query {
     weather(city: "Kolkata") {
       city
       temperature
       description
       humidity
       windSpeed
     }
   }
   ```
3. **Resolver**: Calls `fetchWeatherByCity(city)` from `utils/weather.js`
4. **GraphQL Response**: Sends formatted data to frontend for display

### Type Definition

```graphql
type Weather {
  city: String!
  temperature: Float!
  description: String!
  humidity: Int!
  windSpeed: Float!
}
```

### Frontend UI

- **Page**: `/weather`
- **Component**: `<WeatherCard />`
- Renders temperature, description, humidity, and wind speed
- Uses Tailwind styling for layout and design

### Testing

- **`weather.test.js`** mocks Axios to avoid real HTTP calls
- Validates structure and content of returned data from the query

## 📦 Project Setup & Run Instructions

Fitt.FF is split into two folders: `frontend/` and `backend/`. Both must be configured and run separately.

### Prerequisites

| Tool | Version (Suggested) |
|------|---------------------|
| **Node.js** | ≥ 18.x |
| **npm** | ≥ 9.x |
| **MySQL** | ≥ 8.x |

### Environment Variables

#### Backend `.env` file

Create a `.env` file in the `backend/` directory:

```env
PORT=8080
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=fittff
JWT_SECRET=your_jwt_secret
WEATHER_API_KEY=your_openweathermap_api_key
```

> Replace all values accordingly, especially `DB_PASSWORD`, `JWT_SECRET`, and `WEATHER_API_KEY`.

### Backend Setup

```bash
cd backend
npm install
```

#### Start Backend Server

```bash
npm start
```

- Express server runs at `http://localhost:8080`
- GraphQL endpoint available at: `http://localhost:8080/graphql`
- GraphiQL UI: `http://localhost:8080/graphiql`

> Automatically creates and syncs Sequelize models with MySQL on first run.

#### Run Backend Tests

```bash
npm test
```

### Frontend Setup

```bash
cd frontend
npm install
```

#### Start Frontend Dev Server

```bash
npm run dev
```

- Vite server runs at: `http://localhost:5173`
- Connects to backend via Axios/GraphQL

### Frontend–Backend Connection

- Axios base URL is configured to point to `http://localhost:8080/api/`
- GraphQL requests are sent to `http://localhost:8080/graphql`

Ensure both servers are running concurrently for the app to work correctly.

### Directory Summary

```
fittff/
├── backend/
│   ├── models/         → Sequelize models
│   ├── routes/         → REST API routes
│   ├── graphql/        → GraphQL schema + resolvers
│   ├── utils/          → Weather + logging helpers
│   └── tests/          → Jest + Supertest test files
├── frontend/
│   ├── pages/          → React views
│   ├── components/     → UI components
│   └── context/        → Auth management
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [OpenWeatherMap API](https://openweathermap.org/) for weather data
- [ShadCN UI](https://github.com/shadcn-ui/ui) for beautiful components
- [Tailwind CSS](https://github.com/tailwindlabs/tailwindcss) for styling
- All the amazing open-source libraries that made this project possible

---

**Built with ❤️ by Deeptangshu Dutta**
