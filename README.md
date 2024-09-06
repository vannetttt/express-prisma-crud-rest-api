# Project Name

## Introduction

This project is a REST API application built with Node.js, Express, and PostgreSQL. It uses Prisma as the ORM for database interactions and follows a modular structure for managing authors, articles, and tags. The application includes user authentication and role-based access control.

## Prerequisites

- Node.js
- PostgreSQL
- Prisma
- npm

## Project Setup

### Installation

1. Clone the repository:
    ```sh
    git clone <repository-url>
    cd <repository-directory>
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

3. Create a `.env` file in the root directory with the following content:
    ```env
    DATABASE_URL="postgresql://username:password@host:port/dbname"
    SECRET_ACCESS_TOKEN="mysecretkey"
    BYCRYPT_SALT_ROUNDS=10
    ```

4. Start the development server:
    ```sh
    npm run dev
    ```

5. Initialize the database:
    ```sh
    npx prisma migrate dev --name init
    ```

6. Seed the database with initial data:
    ```sh
    npx prisma db seed
    ```
   
## Project Architecture / Structure

The project follows a modular architecture to ensure scalability and maintainability. Below is an overview of the main directories and their purposes:

- `prisma/`: Contains the Prisma schema and migration files.

- `src/`
  - `controllers/`: Contains the logic for handling requests and responses.
  - `middleware/`: Contains middleware functions for validation, error handling, etc.
  - `routes/`: Contains the route definitions for the application.
  - `services/`: Contains the business logic and services used by the controllers.
  - `utils/`: Contains utility functions and helpers.
- `index.js`: The entry point of the application.


## Modules & Permissions

- **Author management (ADMIN)**
    - Manage authors (view, create, edit, delete)
- **Article management (ADMIN / AUTHOR)**
    - ADMIN:
        - Manage all articles (view, publish, unpublish, delete, assign to authors)
    - AUTHOR:
        - Manage own articles (view, create, edit, delete, publish, unpublish)
- **Tag management (ADMIN / AUTHOR)**
    - Manage tags (view, create, edit, delete)

## DB Structure

- **Users**: 1-many relationship with Articles
- **Tags**: many-many relationship with Articles
- **Articles**: many-many relationship with Tags
- **Roles**: Enum('ADMIN', 'AUTHOR')

## User Credentials

- **ADMIN:**
    - email: demo@gmail.com
    - password: 12345678

## Middleware

### Validation Middleware

- `src/middleware/rules/user.js`: Contains validation rules for user-related operations.
- `src/middleware/validate.js`: Middleware to validate requests using express-validator.

### Error Handling Middleware

- `src/middleware/error-exception.js`: Handles errors and sends appropriate responses.


## Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add some feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Open a pull request.

## License

This project is licensed under the MIT License.

## Acknowledgements

- [Express](https://expressjs.com/)
- [Prisma](https://www.prisma.io/)
- [PostgreSQL](https://www.postgresql.org/)