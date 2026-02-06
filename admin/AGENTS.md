# AGENTS.md - Laravel Nova Admin Panel Guidelines

This file contains guidelines for AI coding agents working in the `admin/` directory.

## Project Overview

**Laravel Nova Admin Panel** for the bratstvousa monorepo.

- **Status**: Legacy admin panel - minimal changes expected
- **Framework**: Laravel 11.x with Laravel Nova 5.x
- **PHP Version**: 8.2+ (Docker uses 8.4)
- **Database**: PostgreSQL (shared with SvelteKit app)

## Directory Structure

| Directory              | Purpose                                       |
| ---------------------- | --------------------------------------------- |
| `app/Models/`          | Eloquent models (base classes in `Base/`)     |
| `app/Nova/`            | Nova resources (22 resources)                 |
| `app/Nova/Traits/`     | Shared field definitions (`SharedFields.php`) |
| `app/Policies/`        | Authorization policies (permission-based)     |
| `app/Providers/`       | Service providers                             |
| `app/Settings/`        | Spatie settings classes                       |
| `database/migrations/` | Database migrations                           |
| `tests/`               | PHPUnit tests (Feature/, Unit/)               |

## Build, Lint, Test Commands

All commands should be run from the `admin/` directory.

### Development

```bash
composer dev              # Start all services (server, queue, logs, vite)
php artisan serve         # Start Laravel dev server only
npm run dev               # Start Vite dev server only
```

### Testing

```bash
php artisan test                          # Run all tests
php artisan test --testsuite=Unit         # Run only unit tests
php artisan test --testsuite=Feature      # Run only feature tests

# Run a single test file
php artisan test tests/Feature/ExampleTest.php

# Run a single test method
php artisan test --filter=test_the_application_returns_a_successful_response

# Using PHPUnit directly
./vendor/bin/phpunit                      # Run all tests
./vendor/bin/phpunit tests/Unit           # Run unit tests
./vendor/bin/phpunit --filter=ClassName   # Filter by class name
```

### Code Quality

```bash
./vendor/bin/pint                         # Format code with Laravel Pint
./vendor/bin/pint --test                  # Check formatting without fixing
./vendor/bin/pint app/Models              # Format specific directory
```

### Database

```bash
php artisan migrate                       # Run migrations
php artisan migrate:rollback              # Rollback last migration
php artisan migrate:fresh --seed          # Reset DB and run seeders
php artisan db:seed                       # Run seeders
```

### Artisan Helpers

```bash
php artisan make:model ModelName -m       # Create model with migration
php artisan make:policy PolicyName        # Create policy
php artisan nova:resource ResourceName    # Create Nova resource
```

## Code Style Guidelines

### Formatting (from .editorconfig)

- **4 spaces** for indentation (not tabs)
- **UTF-8** charset
- **LF** line endings
- **Insert final newline**
- **Trim trailing whitespace**

### PHP Standards

- Follow **PSR-12** coding standard (Laravel default)
- Use **Laravel Pint** for formatting (`./vendor/bin/pint`)
- Use **typed properties** and **return types** (PHP 8.2+)

### Import Organization

Order imports in this sequence:

1. PHP built-in classes
2. Illuminate/Laravel classes
3. Third-party packages (alphabetically)
4. Application classes (`App\`)

```php
<?php

namespace App\Nova;

use Illuminate\Http\Request;
use Illuminate\Validation\Rules;
use Laravel\Nova\Fields\ID;
use Laravel\Nova\Fields\Text;
use Laravel\Nova\Http\Requests\NovaRequest;
```

### Naming Conventions

| Type             | Convention           | Example                               |
| ---------------- | -------------------- | ------------------------------------- |
| Classes          | PascalCase           | `YouthEvent`, `FormSubmission`        |
| Methods          | camelCase            | `viewAny`, `registerMediaConversions` |
| Properties       | camelCase            | `$fillable`, `$hidden`                |
| Database tables  | snake_case           | `youth_events`, `form_submissions`    |
| Database columns | snake_case           | `start_at`, `featured_image`          |
| Constants        | SCREAMING_SNAKE_CASE | `DAY_IN_MS`                           |

### Model Patterns

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class YouthEvent extends Model implements Auditable, HasMedia
{
    use \OwenIt\Auditing\Auditable;
    use InteractsWithMedia;

    protected $fillable = ['title', 'slug', 'description'];

    protected function casts(): array
    {
        return [
            'start_at' => 'datetime',
            'end_at' => 'datetime',
        ];
    }
}
```

### Nova Resource Patterns

- Extend `App\Nova\Resource` (custom base class)
- Use `SharedFields` trait for common field sets
- Always define `$model`, `$title`, `$search` static properties

```php
<?php

namespace App\Nova;

use App\Nova\Traits\SharedFields;
use Laravel\Nova\Http\Requests\NovaRequest;

class YouthEvent extends Resource
{
    public static $model = \App\Models\YouthEvent::class;
    public static $title = 'title';
    public static $search = ['id', 'title', 'slug'];

    public function fields(NovaRequest $request)
    {
        return SharedFields::eventFields();
    }
}
```

### Policy Patterns

All policies use permission-based authorization via `hasPermissionTo()`:

```php
public function viewAny(User $user): bool
{
    return $user->hasPermissionTo('view youth_events');
}
```

Permission naming: `{action} {table_name}` (e.g., `view youth_events`, `create youth_events`)

## Key Packages

| Package                       | Purpose                    |
| ----------------------------- | -------------------------- |
| `spatie/laravel-medialibrary` | Media file handling        |
| `owen-it/laravel-auditing`    | Model change auditing      |
| `pktharindu/nova-permissions` | Role/permission management |
| `spatie/laravel-settings`     | Application settings       |
| `advoor/nova-editor-js`       | EditorJS integration       |

## Error Handling

- Use Laravel's exception handling
- Log errors before returning responses
- Never expose sensitive details to users

```php
try {
    $result = $this->performOperation();
} catch (\Exception $e) {
    \Log::error('Operation failed', ['error' => $e->getMessage()]);
    throw $e;
}
```

## Git Workflow

Before committing:

1. Run `./vendor/bin/pint` to format code
2. Run `php artisan test` to ensure tests pass
3. Use clear, concise commit messages

## Integration Notes

- Database is **shared with SvelteKit app** (`app/` directory)
- Media files stored on **AWS S3** (`league/flysystem-aws-s3-v3`)
- Frontend URL configured via `FRONTEND_URL` env variable
