# Portfolio Website

This is a portfolio website built with Laravel, which includes a Content Management System (CMS) for easy content editing.

## Features
- Content Management System (CMS): The website is powered by a CMS built with Laravel, which allows you to easily add, edit, and delete content such as projects, skills, and experiences.
- Blade templates: The CMS uses blade templates to generate HTML, which provides a clean separation between the content and presentation layers.
- Responsive design: The website is designed to be responsive, adapting to different screen sizes and orientations.

## Requirements

- Docker Desktop or Docker Engine with the Docker Compose plugin
- Ports `8000` and `3306` available on the host

## Setup With Docker

Clone the repository and start the application and MySQL database:

```bash
docker compose up --build
```

The application container automatically creates the Laravel app key, links
public storage, and runs database migrations. The website is available at
`http://localhost:8000`.

The API is available under `http://localhost:8000/api`, including:

- `/projects`
- `/types`
- `/skills`
- `/educations`
- `/jobs`

Run the application in the background with `docker compose up -d --build`.

## CMS Login

The application creates the default CMS administrator automatically after the
database migrations run. Open `http://localhost:8000/console/login` and use:

- Email: `admin@example.com`
- Password: `change-this-password`

The account is created only when that email does not already exist, so restarting
the containers will not overwrite a changed password. Change the default
password before using this application in production.

To use different credentials, set these values in `docker-compose.yml` before
the first deployment:

```yaml
ADMIN_EMAIL: you@example.com
ADMIN_PASSWORD: your-secure-password
ADMIN_FIRST: Your
ADMIN_LAST: Name
```

The password is hashed automatically when the account is created.

To create sample content and users instead, run:

```bash
docker compose exec app php artisan db:seed
```

The seeder resets the existing content tables and creates random users. It is
intended for development data, not for preserving existing content.

To run migrations manually:

```bash
docker compose exec app php artisan migrate
```

## Database Access

The MySQL database is exposed for tools such as DBeaver:

- Host: `localhost`
- Port: `3306`
- Database: `portfolio`
- Username: `portfolio`
- Password: `portfolio`

You can also open a MySQL shell with:

```bash
docker compose exec db mysql -uportfolio -pportfolio portfolio
```

Stop the services with `docker compose down`. Add `-v` when you also want to
remove the MySQL data volume.

