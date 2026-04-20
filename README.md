# LiveCore

A live broadcast system using laravel & inertia

## Development

Clone the repo and ``cd`` into the directory.

```bash
# install npm dependence
npm install

# install composer dependence
composer install

# prepare .env file
cp .env.example .env
```

Prepare database, update the ``.env`` file's ``DB`` & ``REVERB`` configuration:

```dotenv

DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=livecore
DB_USERNAME=root
DB_PASSWORD=


REVERB_APP_ID=your-app-id
REVERB_APP_KEY=your-app-key
REVERB_APP_SECRET=your-app-secret

```

Run develop script

```bash
composer run dev
```

## License

The LiveCore is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
