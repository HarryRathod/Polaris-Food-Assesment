Project Title
--------------
Food Delivery Backend (Node.js + Sequelize + MySQL + Redis)


Overview
---------
This project is a backend system for a food delivery platform. It supports user authentication, restaurant management, menu handling, and order placement with rider assignment using Redis-based queues.
The system is designed with a modular architecture using controllers, services, and repositories.


Tech Stack
-----------
Node.js
Express.js
Sequelize ORM
MySQL
Redis
Bull / BullMQ (Queue system)
JWT Authentication

Features
----------
Authentication
- User and Rider registration
- Login with JWT token
- Role-based structure (user, rider)
Restaurant
- Create restaurant linked to user
- Uses user name and phone automatically
Menu
- Add menu items to restaurant
- Categorization (veg / non-veg)
- Availability tracking
Orders
- Place order with multiple items
- Auto-calculates total amount
- Stores item summary in itemName
- Tracks order status
Rider Assignment
- Redis used for storing rider locations
- Background worker assigns nearest rider
- Queue-based async processing


Setup Instructions
------------------
1. Run the MySQL & Redis Containers
docker-compose up -d

2. Install dependencies
npm Install

3. Configure environment variables
Create .env file:

PORT=8081
JWT_SECRET=
DB_NAME=
DB_USER=root
DB_PASSWORD=
DB_HOST=
REDIS_HOST=
REDIS_PORT=6379

4. Run migrations / sync
sequelize.sync()

5. Start server
npm start

6. Start worker
node ./src/queues/worker.js

7. Swagger Docs
http://localhost:8081/docs/#/


API Endpoints:
=============
Auth
-------
POST /auth/register
POST /auth/login

Restaurant
-----------
POST /restaurants

Menu
----
POST /menus

Orders
------
POST /orders → Place order
GET /orders → Get user orders
GET /orders/:id → Get single order
PATCH /orders/:id/status → Update order status


Order of Flow
=============
- User sends order request
- System validates menu items
- Total amount is calculated
- Order is saved in database
- Job pushed to queue
- Worker picks job
- Nearest rider fetched from Redis
- Rider assigned to order


Redis Usage
===========
- Stores rider locations using GEO features
- Used for fast nearest rider lookup
- Used as queue backend


