# Fixmate - Server

FixMate server is the back-end API of the role-based repair service platform built with Next.js, Express, MongoDB, BetterAuth, JWT, and Stripe.

Verified Technicians list the repair services they offer (smartphone screen replacement, laptop servicing, AC servicing, refrigerator, TV, washing machine, electrical wiring, etc.). Customers browse those services, send a repair request with a problem description, track the job step by step, and pay online only after the job is completed.

Admins approve service listings, manage users, monitor all repair jobs, and track Stripe revenue.

## Live API & Repositories

- **Live API:** [your-server-url](https://fixmate-server-shariul.vercel.app/api)
- **Server Repository:** [shariult/fixmate-server](https://github.com/shariult/fixmate-server)
- **Client Repository:** [shariult/fixmate-client](https://github.com/shariult/fixmate-client)

## Features

- RESTful API built with **Express 5** and the official **MongoDB** driver, using four collections: `users`, `services`, `bookings`, and `payments`.
- **JWT verification** with custom role-based middlewares: `verifyToken`, `verifyCustomer`, `verifyTechnician`, and `verifyAdmin`. A request without a valid token gets `401 Unauthorized`, and a valid user with the wrong role gets `403 Forbidden`.
- Ownership checks, so users can only reach their own data (customers see only their bookings, technicians only the bookings assigned to them).
- **Server-side search, filter, and sort** on public services (by title or category, category and service mode filters, price and newest sorting), all done in MongoDB.
- **Server-enforced job status pipeline**: `requested → accepted → in-progress → completed`, with `rejected` and `cancelled` branching off from `requested`. Any other transition is rejected.
- Payment gate: payment is only possible for a `completed` and `unpaid` booking owned by the logged-in customer, and the same payment is never saved twice.
- Business rules enforced on the server:
  - A customer cannot have two active requests for the same service.
  - Technicians and admins cannot send repair requests.
  - New and edited services go back to `pending` until an admin approves them.
  - Only `approved` and available services appear on public routes.
- Admin APIs for managing users and roles, approving or rejecting services, and monitoring all bookings and payments.
- Request validation with **Joi** and protection against NoSQL injection with **express-mongo-sanitize**.
- CORS configured with an allow-list of trusted client origins.
- Secrets and credentials kept in environment variables.

## API Endpoints

| Access             | Middlewares                       | Endpoints                                                                                                                                                 |
| ------------------ | --------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Public             | None                              | `GET /api/services`, `GET /api/services/:id`                                                                                                              |
| Any logged-in user | `verifyToken`                     | `PATCH /api/users/profile`                                                                                                                                |
| Customer           | `verifyToken`, `verifyCustomer`   | `POST /api/bookings`, `GET /api/bookings/my`, `PATCH /api/bookings/:id/cancel`                                                                            |
| Technician         | `verifyToken`, `verifyTechnician` | `POST /api/services`, `PATCH /api/services/:id`, `DELETE /api/services/:id`, `GET /api/bookings/technician`, `PATCH /api/bookings/:id/status`             |
| Admin              | `verifyToken`, `verifyAdmin`      | `GET /api/admin/users`, `PATCH /api/admin/users/:id/role`, `PATCH /api/admin/services/:id/approval`, `GET /api/admin/bookings`, `GET /api/admin/payments` |

## Technologies Used

- **Runtime:** Node.js (ES Modules)
- **Framework:** Express.js
- **Database:** MongoDB
- **Authentication:** JWT verification with `jose`, role-based access control
- **Validation & Security:** Joi, express-mongo-sanitize, CORS
- **Payments:** Stripe (test mode)
- **Package Manager:** pnpm

## Project Dependencies

### Dependencies

- `express` – web framework for building the REST API
- `mongodb` – official MongoDB driver
- `cors` – controls which client origins can call the API
- `jose` – JWT signing and verification
- `joi` – request body and query validation
- `express-mongo-sanitize` – strips MongoDB operators from user input to prevent NoSQL injection
- `slugify` – generates URL-friendly slugs

### Dev Dependencies

- `nodemon` – restarts the server automatically during development
- `dotenv` – loads environment variables from the `.env` file
- `@faker-js/faker` – generates realistic seed data

## Running Locally

### Prerequisites

- [Node.js](https://nodejs.org/) (v20 or later)
- [pnpm](https://pnpm.io/)
- A [MongoDB](https://www.mongodb.com/) database (local or MongoDB Atlas)
- The [FixMate client](https://github.com/shariult/fixmate-client) running locally or deployed

### 1. Clone the repository

```bash
git clone https://github.com/shariult/fixmate-server.git
cd fixmate-server
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Set up environment variables

Create a `.env` file in the project root:

```env
# Server
PORT=5000

# Database
MONGODB_URI=your_mongodb_connection_string

# JWT (must match the secret used by the client auth setup)
JWT_SECRET=your_random_secret

# CORS (client origin)
CLIENT_URL=http://localhost:3000
```

Generate a secret with:

```bash
openssl rand -base64 32
```

### 4. Start the development server

```bash
pnpm dev
```

The API runs at [http://localhost:5000](http://localhost:5000).

### Other scripts

```bash
pnpm start   # Run the server with Node
```

### Deployment notes

- Add your production client domain to the server's CORS allowed origins and to the BetterAuth trusted origins on the client.
- Keep all credentials in environment variables and never commit the `.env` file.

## 📬 Let's Connect & Collaborate!

I am currently open to freelance projects, remote positions, and collaborative opportunities.

[<img src="https://img.shields.io/badge/Website-shariul.com-blue?style=for-the-badge&logo=google-chrome&logoColor=white" />](https://shariul.com) [<img src="https://img.shields.io/badge/LinkedIn-shariul-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white" />](https://www.linkedin.com/in/shariul/) [<img src="https://img.shields.io/badge/Discord-%235865F2.svg?style=for-the-badge&logo=discord&logoColor=white" />](https://discord.gg/9q5GRgVS2)
