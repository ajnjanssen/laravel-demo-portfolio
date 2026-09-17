# Portfolio Website

This is a portfolio website built with Laravel 11, featuring an editorial/brutalist design powered by Tailwind CSS & Vite, and a Content Management System (CMS) for content administration.

## Features
- **Laravel 11 & PHP 8.2:** Core framework upgraded for optimal performance and modern features.
- **Vite & Tailwind CSS:** Modern frontend build tooling with Hot Module Replacement (HMR) for fast development.
- **Content Management System (CMS):** Internal dashboard to manage projects, skills, educations, and work experiences.
- **Blade Templating:** Clean separation of concerns with dynamic Blade views.
- **Docker Integration:** Fully containerized setup including PHP-CLI, Node.js, and MySQL.

## Requirements

- Docker Desktop or Docker Engine with the Docker Compose plugin
- Host ports `8000` (Laravel), `5173` (Vite HMR), and `3306` (MySQL) available

## Setup With Docker

Clone the repository and build the containers:

```bash
docker compose up -d --build
```
The application container automatically creates the Laravel app key, links public storage, and executes database migrations. The website is available at http://localhost:8000.

Frontend Asset Development (Vite)
To enable Vite Hot Module Replacement (HMR) and compile Tailwind CSS while developing:

Install frontend dependencies inside the container (first time only):

```Bash
docker compose exec app npm install
```
Start the Vite development server:


```Bash

docker compose exec app npm run dev
```
To build production-ready assets manually:

```Bash

docker compose exec app npm run build
```

## Architecture & Development Workflow
The application follows the standard Laravel MVC pattern. Public pages and CMS dashboard pages are configured in routes/web.php. The CMS dashboard is accessible at http://localhost:8000/console.

View active Routes:
```Bash
docker compose exec app php artisan route:list
```

Create a new controller:
```Bash
docker compose exec app php artisan make:controller ExampleController
```

Create Model, Migration & Controller:
```bash
docker compose exec app php artisan make:model Example -mc
```
>Views are stored in resources/views/ under their respective domain folders (console/, projects/, skills/, etc.).

## API Endpoints
The API is available at http://localhost:8000/api, including endpoints for:
- /projects

- /types

- /skills

- /educations

- /jobs

## CMS Login
The application automatically creates a default administrator upon running initial database migrations. Access http://localhost:8000/console/login using:

> Email: admin@example.com

> Password: change-this-password

To use custom credentials, update these values in docker-compose.yml prior to initial setup:

```YAML
ADMIN_EMAIL: you@example.com
ADMIN_PASSWORD: your-secure-password
ADMIN_FIRST: Your
ADMIN_LAST: Name
Seeding Development Data
```
To seed sample data and demo users, run:

```Bash
docker compose exec app php artisan db:seed
To execute database migrations manually:
```
```Bash
docker compose exec app php artisan migrate
```

# Database Access
The MySQL database is accessible on the host:
> Host: localhost

> Port: 3306

> Database: portfolio

> Username: portfolio

> Password: portfolio

Or connect directly via the MySQL CLI:

```Bash
docker compose exec db mysql -uportfolio -pportfolio portfolio
```
Stop all active containers:

```Bash
docker compose down
```
> (Add -v to also remove persistent database volumes).