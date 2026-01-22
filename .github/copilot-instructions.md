# 🚢 Kapal Trip Booking System - Complete Developer Guide

> **Enterprise-grade ship ticket booking system with modern tech stack, advanced concurrency control, and production-ready architecture.**

[![Laravel](https://img.shields.io/badge/Laravel-12.x-FF2D20?style=flat&logo=laravel)](https://laravel.com)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=flat&logo=react)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat&logo=typescript)](https://typescriptlang.org)
[![Inertia.js](https://img.shields.io/badge/Inertia.js-2.x-9553E9?style=flat)](https://inertiajs.com)
[![Redis](https://img.shields.io/badge/Redis-7.x-DC382D?style=flat&logo=redis)](https://redis.io)

---

## 📑 Table of Contents

- [Project Overview](#-project-overview)
- [Tech Stack Breakdown](#-tech-stack-breakdown)
- [Package Dependencies](#-package-dependencies)
- [UI/UX Design System](#-uiux-design-system)
- [Feature Specifications](#-feature-specifications)
- [Flow Diagrams](#-flow-diagrams)
- [Database Architecture](#-database-architecture)
- [API Documentation](#-api-documentation)
- [Installation Guide](#-installation-guide)
- [Development Workflow](#-development-workflow)
- [Testing Strategy](#-testing-strategy)
- [Deployment Guide](#-deployment-guide)
- [Performance Benchmarks](#-performance-benchmarks)

---

## 🎯 Project Overview

### What is Kapal Trip?

**Kapal Trip Booking System** adalah aplikasi web enterprise untuk manajemen pemesanan tiket kapal wisata dengan **4 cabang operasional** (Kendari, Palu, Manado, Labengki). Sistem ini dirancang untuk menangani **ribuan transaksi concurrent** dengan zero data loss dan optimal performance.

### Core Business Model

```
┌─────────────────────────────────────────────────────────┐
│                    BUSINESS MODEL                        │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  🏢 4 Branch Locations                                   │
│     ├─ Kendari                                           │
│     ├─ Palu                                              │
│     ├─ Manado                                            │
│     └─ Labengki                                          │
│                                                           │
│  🚢 Multiple Ships per Branch                            │
│     └─ Each ship operates on internal routes             │
│        (3-4 hour trips with multiple stops)              │
│                                                           │
│  🎫 Dual Pricing Model                                   │
│     ├─ PUBLIC: Walk-in customers (standard price)        │
│     └─ EVENT: Corporate/group bookings (special price)   │
│                                                           │
│  👥 3 User Roles                                         │
│     ├─ ADMIN: Full system access                         │
│     ├─ OPERATOR: QR scanning only                        │
│     └─ CUSTOMER: Booking portal                          │
│                                                           │
│  💰 Payment Integration                                  │
│     └─ Xendit (E-wallet, VA, QRIS, Retail outlets)      │
│                                                           │
│  🎁 Flexible Promotion System                            │
│     ├─ Buy X Get Y (e.g., Buy 10 Get 1 Free)            │
│     ├─ Percentage Discount                               │
│     └─ Fixed Amount Discount                             │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

### Key Statistics & Scale

- **Users**: Designed for 10,000+ concurrent users
- **Transactions**: 100,000+ bookings/month capacity
- **Response Time**: <100ms average (P95: <200ms)
- **Uptime**: 99.9% SLA target
- **Data Integrity**: Zero data loss guarantee

---

## 🛠 Tech Stack Breakdown

### Backend Technologies

#### 1. **Laravel 12.x**

**Why Laravel 12?**

- Latest stable release with PHP 8.3 support
- Enhanced performance (20% faster than Laravel 11)
- Built-in support for modern features (readonly properties, enums)
- Strong ecosystem with 15,000+ packages

**Core Features Used:**

```php
// Eloquent ORM with advanced features
- Global Scopes (automatic query filtering)
- Model States (state machine pattern)
- Observer pattern (audit logging)
- Soft Deletes (data preservation)
- Eager loading (N+1 prevention)

// Fortify (Headless Authentication)
- Custom LoginResponse per role
- Two-factor authentication ready
- Email verification
- Password reset with secure tokens

// Queue System
- Multiple queue drivers (Redis, Database)
- Job chaining and batching
- Rate limiting
- Retry with exponential backoff

// Cache System
- Redis-backed caching
- Cache tags for grouped invalidation
- Remember pattern for query caching
- Lock mechanism for concurrency control
```

**Configuration:**

```php
// config/app.php
'timezone' => 'Asia/Makassar', // Sulawesi timezone
'locale' => 'id',              // Indonesian
'fallback_locale' => 'en',

// config/database.php
'mysql' => [
    'strict' => true,
    'engine' => 'InnoDB',
    'charset' => 'utf8mb4',
    'collation' => 'utf8mb4_unicode_ci',
],

// config/queue.php
'default' => 'redis',
'connections' => [
    'redis' => [
        'driver' => 'redis',
        'connection' => 'default',
        'queue' => env('REDIS_QUEUE', 'default'),
        'retry_after' => 90,
        'block_for' => 5,
    ],
],
```

---

#### 2. **MySQL 8.0+**

**Why MySQL 8?**

- JSON column support (for waypoints, metadata)
- Window functions (advanced analytics)
- CTE support (complex queries)
- Performance Schema (query optimization)

**Schema Design Patterns:**

```sql
-- Polymorphic relationships
-- Soft deletes pattern
-- Audit trails with JSON columns
-- UUID support for distributed systems
-- Full-text search indexes
-- Composite indexes for performance
```

**Performance Optimizations:**

```sql
-- Query cache enabled
SET GLOBAL query_cache_size = 268435456; -- 256MB

-- InnoDB buffer pool (70% of RAM)
SET GLOBAL innodb_buffer_pool_size = 4294967296; -- 4GB

-- Connection pooling
SET GLOBAL max_connections = 500;
SET GLOBAL max_user_connections = 450;
```

---

#### 3. **Redis 7.x**

**Why Redis?**

- In-memory speed (sub-millisecond latency)
- Atomic operations (concurrency control)
- Pub/Sub for real-time features (future)
- Distributed locking
- Session storage

**Usage Patterns:**

```redis
# 1. Distributed Locking (prevent overbooking)
SETNX booking:schedule:123 1 EX 10  # Lock for 10 seconds

# 2. Rate Limiting (API protection)
INCR api:rate:user:456
EXPIRE api:rate:user:456 60  # 60 requests per minute

# 3. Scan Prevention
SET scan:ticket:TKT-001 "scanned" EX 86400  # 24 hours

# 4. Cache Strategy
# - Cache aside pattern
# - Write-through caching
# - TTL-based invalidation
SET cache:schedules:2024-01-15 "{...}" EX 3600  # 1 hour

# 5. Session Storage
SET session:abc123xyz "{user_data}" EX 7200  # 2 hours
```

**Redis Configuration:**

```conf
# redis.conf
maxmemory 2gb
maxmemory-policy allkeys-lru  # Evict least recently used
save 900 1                     # Snapshot every 15min if 1+ keys changed
save 300 10                    # Snapshot every 5min if 10+ keys changed
save 60 10000                  # Snapshot every 1min if 10000+ keys changed
```

---

### Frontend Technologies

#### 1. **React 18.x + TypeScript 5.x**

**Why React + TypeScript?**

- **React 18**: Concurrent rendering, automatic batching
- **TypeScript**: Type safety, IntelliSense, refactoring confidence
- Component reusability
- Virtual DOM performance
- Rich ecosystem

**Project Structure:**

```typescript
// Component Architecture: Atomic Design Pattern
resources/js/
├── components/
│   ├── ui/              // Atoms (shadcn/ui primitives)
│   ├── shared/          // Molecules (reusable composites)
│   ├── booking/         // Organisms (feature-specific)
│   └── layout/          // Templates (page layouts)
├── pages/               // Pages (full routes)
├── hooks/               // Custom React hooks
├── lib/                 // Utilities
└── types/               // TypeScript definitions

// Type Safety Example
interface Schedule {
  id: number;
  departure_date: string;
  departure_time: string;
  available_seats: number;
  ship: {
    name: string;
    capacity: number;
  };
  route: {
    name: string;
    waypoints: Waypoint[];
  };
}

// Props validation at compile time
type ScheduleCardProps = {
  schedule: Schedule;
  onBook: (scheduleId: number) => void;
};
```

---

#### 2. **Inertia.js 2.x**

**Why Inertia?**

- **Server-Side Rendering**: SEO-friendly, fast initial load
- **No API needed**: Direct controller → component data flow
- **SPA experience**: No full page reloads
- **Type-safe props**: PHP DTOs → TypeScript interfaces

**Architecture Pattern:**

```typescript
// Traditional SPA (Complex)
Frontend (React) ←→ REST API ←→ Backend (Laravel)
   ↓                  ↓              ↓
State Mgmt         Serialization   Controllers
API calls          Validation      Services
Error handling     Auth tokens     Database

// Inertia (Simple)
Frontend (React) ←────────────→ Backend (Laravel)
   ↓                                  ↓
Props (auto-typed)              Controllers → Inertia::render()
                                Services → DTOs
                                Database

// Example Flow
// Backend: app/Http/Controllers/ScheduleController.php
public function index(Request $request)
{
    $schedules = Schedule::query()
        ->with(['ship', 'route', 'tripType'])
        ->where('departure_date', '>=', now())
        ->paginate(15);

    return Inertia::render('customer/schedules/index', [
        'schedules' => ScheduleData::collection($schedules),
        'filters' => $request->only(['date', 'branch_id']),
    ]);
}

// Frontend: resources/js/pages/customer/schedules/index.tsx
import { Head } from '@inertiajs/react';
import { Schedule } from '@/types';

interface Props {
  schedules: PaginatedData<Schedule>;
  filters: { date?: string; branch_id?: number };
}

export default function ScheduleIndex({ schedules, filters }: Props) {
  return (
    <>
      <Head title="Jadwal Keberangkatan" />
      <ScheduleList schedules={schedules.data} />
      <Pagination links={schedules.links} />
    </>
  );
}
```

**Inertia Features Used:**

```typescript
// 1. Partial Reloads (performance optimization)
router.reload({
  only: ['schedules'],           // Only reload schedules prop
  preserveScroll: true,          // Keep scroll position
  preserveState: true,           // Keep form state
});

// 2. Form Handling
const { data, setData, post, processing, errors } = useForm({
  schedule_id: 1,
  passengers: [],
});

post(route('bookings.store'), {
  onSuccess: () => toast.success('Booking created!'),
  onError: (errors) => toast.error(errors.schedule_id),
});

// 3. Shared Data (available in all pages)
// app/Http/Middleware/HandleInertiaRequests.php
public function share(Request $request): array
{
    return [
        ...parent::share($request),
        'auth' => [
            'user' => $request->user(),
            'permissions' => $request->user()?->permissions,
        ],
        'flash' => [
            'success' => $request->session()->get('success'),
            'error' => $request->session()->get('error'),
        ],
    ];
}

// Access in any component
const { auth, flash } = usePage().props;
```

---

#### 3. **Tailwind CSS 4.x + shadcn/ui**

**Why This Combination?**

- **Tailwind**: Utility-first, no CSS files, purge unused styles
- **shadcn/ui**: Accessible, customizable, copy-paste components
- **Radix UI**: Headless primitives (keyboard nav, ARIA)
- **Class Variance Authority**: Type-safe component variants

**shadcn/ui Components Used:**

```typescript
// components.json configuration
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "css": "resources/css/app.css",
    "baseColor": "slate",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}

// Installed Components (30+ components)
├── ui/
│   ├── button.tsx           // Primary actions
│   ├── card.tsx             // Content containers
│   ├── dialog.tsx           // Modals
│   ├── alert-dialog.tsx     // Confirmation dialogs
│   ├── accordion.tsx        // Expandable sections
│   ├── form.tsx             // Form wrapper (React Hook Form)
│   ├── input.tsx            // Text inputs
│   ├── label.tsx            // Form labels
│   ├── select.tsx           // Dropdowns
│   ├── table.tsx            // Data tables
│   ├── badge.tsx            // Status badges
│   ├── alert.tsx            // Notifications
│   ├── dropdown-menu.tsx    // Context menus
│   ├── sheet.tsx            // Slide-in panels
│   ├── tabs.tsx             // Tab navigation
│   ├── calendar.tsx         // Date picker
│   ├── popover.tsx          // Popovers
│   ├── tooltip.tsx          // Tooltips
│   ├── skeleton.tsx         // Loading states
│   ├── separator.tsx        // Visual separators
│   ├── switch.tsx           // Toggle switches
│   ├── checkbox.tsx         // Checkboxes
│   ├── radio-group.tsx      // Radio buttons
│   ├── textarea.tsx         // Multi-line inputs
│   ├── slider.tsx           // Range sliders
│   ├── avatar.tsx           // User avatars
│   ├── progress.tsx         // Progress bars
│   ├── scroll-area.tsx      // Custom scrollbars
│   ├── command.tsx          // Command palette
│   ├── sidebar.tsx          // Sidebar navigation
│   └── data-table.tsx       // Advanced tables

// Example Usage with Variants
import { Button } from '@/components/ui/button';

// Variant system (type-safe)
<Button variant="default">Default</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Cancel</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

// Size variants
<Button size="default">Default</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button size="icon"><Icon /></Button>
```

---

#### 4. **React Hook Form + Zod**

**Why This Combination?**

- **Performance**: Minimal re-renders
- **Type Safety**: Zod schemas → TypeScript types
- **Validation**: Client-side + server-side sync
- **Developer Experience**: Excellent IntelliSense

**Form Architecture:**

```typescript
// 1. Define Zod Schema
import { z } from 'zod';

const bookingSchema = z.object({
  schedule_id: z.number().positive(),
  booking_type: z.enum(['INDIVIDUAL', 'GROUP']),
  passengers: z.array(
    z.object({
      full_name: z.string().min(3).max(255),
      id_card_number: z.string().length(16),
      phone: z.string().regex(/^08[0-9]{9,11}$/),
      email: z.string().email(),
      age: z.number().min(1).max(120),
      gender: z.enum(['MALE', 'FEMALE']),
    })
  ).min(1).max(50),
  promotion_code: z.string().optional(),
});

// 2. Infer TypeScript Type
type BookingFormData = z.infer<typeof bookingSchema>;

// 3. Use in Component
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

export default function BookingForm({ schedule }: Props) {
  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      schedule_id: schedule.id,
      booking_type: 'INDIVIDUAL',
      passengers: [],
    },
  });

  const onSubmit = (data: BookingFormData) => {
    router.post(route('bookings.store'), data, {
      onSuccess: () => {
        toast.success('Booking berhasil dibuat!');
      },
      onError: (errors) => {
        // Display server-side errors
        Object.entries(errors).forEach(([field, message]) => {
          form.setError(field as any, { message: message as string });
        });
      },
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="passengers.0.full_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Lengkap</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? 'Processing...' : 'Book Now'}
        </Button>
      </form>
    </Form>
  );
}
```

**Benefits:**

```typescript
// ✅ Type Safety
// Autocomplete for all fields
form.watch('passengers.0.full_name'); // ✓ TypeScript knows this exists

// ✅ Performance
// Only re-render changed fields
const fullName = form.watch('passengers.0.full_name'); // Doesn't re-render entire form

// ✅ Validation
// Client-side instant feedback
// Server-side as final check

// ✅ Accessibility
// ARIA labels automatically
// Keyboard navigation
// Screen reader support
```

---

#### 5. **Ziggy (Laravel Routes in JavaScript)**

**Why Ziggy?**

- Type-safe routing in frontend
- No hardcoded URLs
- Auto-sync with Laravel routes
- IntelliSense support

**Usage:**

```typescript
// Instead of hardcoded URLs
// ❌ Bad
<Link href="/admin/bookings/123">View</Link>

// ✅ Good (type-safe)
import { route } from 'ziggy-js';

<Link href={route('admin.bookings.show', booking.id)}>View</Link>

// With parameters
route('customer.schedules.index', {
  date: '2024-01-15',
  branch_id: 1,
});
// Output: /customer/schedules?date=2024-01-15&branch_id=1

// Check if route exists
route().has('admin.dashboard'); // true/false

// Current route check
route().current('admin.bookings.index'); // true/false
```

---

## 📦 Package Dependencies

### Backend Packages (composer.json)

```json
{
    "require": {
        "php": "^8.3",
        "laravel/framework": "^12.0",
        "laravel/fortify": "^1.20",
        "laravel/sanctum": "^4.0",
        "laravel/telescope": "^5.0",
        "inertiajs/inertia-laravel": "^1.3",

        "spatie/laravel-data": "^4.0",
        "spatie/laravel-model-states": "^2.7",
        "spatie/laravel-query-builder": "^6.0",
        "spatie/laravel-permission": "^6.0",
        "spatie/laravel-activitylog": "^4.8",
        "spatie/laravel-pdf": "^1.5",

        "brick/money": "^0.9",
        "maatwebsite/excel": "^3.1",
        "simplesoftwareio/simple-qrcode": "^4.2",
        "firebase/php-jwt": "^6.10",

        "xendit/xendit-php": "^3.0",
        "predis/predis": "^2.2",

        "sentry/sentry-laravel": "^4.0",
        "barryvdh/laravel-debugbar": "^3.13"
    },
    "require-dev": {
        "laravel/pint": "^1.13",
        "pestphp/pest": "^2.34",
        "pestphp/pest-plugin-laravel": "^2.3",
        "mockery/mockery": "^1.6",
        "nunomaduro/collision": "^8.1"
    }
}
```

**Package Explanations:**

#### 1. **spatie/laravel-data (^4.0)**

```php
// Purpose: Type-safe Data Transfer Objects

// Before (arrays - no type safety)
return [
    'booking_code' => $booking->booking_code,
    'total_amount' => $booking->total_amount,
    'passengers' => $booking->passengers->toArray(),
];

// After (DTOs - fully typed)
return BookingData::from($booking);

// Auto-generate TypeScript types
php artisan typescript:transform

// Generated TypeScript
export type BookingData = {
    booking_code: string;
    total_amount: number;
    passengers: PassengerData[];
};
```

#### 2. **spatie/laravel-model-states (^2.7)**

```php
// Purpose: State Machine Pattern

// Prevent invalid state transitions
$booking->status = 'BOARDED'; // ❌ Unsafe

$booking->status->transitionTo(Boarded::class); // ✅ Validated

// State classes
abstract class BookingStatus extends State {
    abstract public function canTransitionTo(State $state): bool;
}

class Pending extends BookingStatus {
    public function canTransitionTo(State $state): bool {
        return $state instanceof Paid || $state instanceof Cancelled;
    }
}

// Transition hooks
protected function onTransitionTo(State $newState): void {
    if ($newState instanceof Paid) {
        $this->sendPaymentConfirmation();
    }
}
```

#### 3. **spatie/laravel-query-builder (^6.0)**

```php
// Purpose: Advanced API filtering/sorting

// GET /api/bookings?filter[payment_status]=PAID&sort=-created_at&include=user,schedule

use Spatie\QueryBuilder\QueryBuilder;

$bookings = QueryBuilder::for(Booking::class)
    ->allowedFilters([
        'booking_code',
        'payment_status',
        AllowedFilter::exact('user_id'),
        AllowedFilter::scope('date_range'),
    ])
    ->allowedSorts([
        'booking_date',
        'total_amount',
        'created_at',
    ])
    ->allowedIncludes([
        'user',
        'schedule.route',
        'passengers',
    ])
    ->paginate(15);
```

#### 4. **spatie/laravel-permission (^6.0)**

```php
// Purpose: RBAC (Role-Based Access Control)

// Assign roles
$user->assignRole('admin');

// Check permissions
if ($user->can('manage_branches')) {
    // Allow action
}

// Middleware
Route::middleware(['permission:scan_tickets'])->group(function() {
    Route::get('/scan', [ScanController::class, 'index']);
});

// react component usage
import { Can } from '@/components/permissions';
<Can permission="create_bookings">
    <Button>Create Booking</Button>
</Can>
```

#### 5. **spatie/laravel-activitylog (^4.8)**

```php
// Purpose: Audit Trail

// Automatic logging
use Spatie\Activitylog\Traits\LogsActivity;

class Booking extends Model {
    use LogsActivity;

    protected static $logAttributes = ['*'];
    protected static $logOnlyDirty = true;
}

// Query logs
activity()
    ->causedBy($user)
    ->performedOn($booking)
    ->withProperties(['ip' => request()->ip()])
    ->log('Booking modified');

// Retrieve logs
$activities = Activity::all(); // All logs
$userLogs = Activity::causedBy($user)->get(); // User-specific
```

#### 6. **brick/money (^0.9)**

```php
// Purpose: Precise Money Calculations

// Problem with float
$price = 150000.50;
$discount = $price * 0.20; // 30000.099999999996 (WRONG!)

// Solution with Money
use Brick\Money\Money;

$price = Money::of(150000, 'IDR');
$discount = $price->multipliedBy('0.20', RoundingMode::HALF_UP);
$total = $price->minus($discount);

echo $total->getAmount(); // "120000" (exact!)
```

#### 7. **maatwebsite/excel (^3.1)**

```php
// Purpose: Excel Export with Queue

use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\ShouldQueue;

class SalesReportExport implements FromQuery, ShouldQueue {
    public function query() {
        return Booking::query()
            ->whereBetween('booking_date', [$this->start, $this->end]);
    }
}

// Queue export (non-blocking)
Excel::queue(new SalesReportExport, 'sales.xlsx');
```

#### 8. **firebase/php-jwt (^6.10)**

```php
// Purpose: JWT-Signed QR Codes

use Firebase\JWT\JWT;

$payload = [
    'ticket_number' => 'TKT-001',
    'exp' => time() + (7 * 24 * 60 * 60), // 7 days
];

$jwt = JWT::encode($payload, config('app.key'), 'HS256');

// Verify
$decoded = JWT::decode($jwt, new Key(config('app.key'), 'HS256'));
```

#### 9. **xendit/xendit-php (^3.0)**

```php
// Purpose: Payment Gateway Integration

use Xendit\Invoice;

Invoice::setApiKey(config('xendit.secret_key'));

$invoice = Invoice::create([
    'external_id' => 'BKG-123',
    'amount' => 150000,
    'payer_email' => 'customer@example.com',
    'description' => 'Booking Tiket Kapal',
]);

// webhook handling
$callbackToken = $request->header('X-CALLBACK-TOKEN');
// Verify and process
```

---

### Frontend Packages (package.json)

```json
{
  "dependencies": {
    "@inertiajs/react": "^1.0.15",
    "@radix-ui/react-avatar": "^1.0.4",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-dropdown-menu": "^2.0.6",
    "@radix-ui/react-label": "^2.0.2",
    "@radix-ui/react-popover": "^1.0.7",
    "@radix-ui/react-select": "^2.0.0",
    "@radix-ui/react-slot": "^1.0.2",
    "@radix-ui/react-toast": "^1.1.5",

    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-hook-form": "^7.49.3",
    "@hookform/resolvers": "^3.3.4",
    "zod": "^3
```

===

<laravel-boost-guidelines>
=== foundation rules ===

# Laravel Boost Guidelines

The Laravel Boost guidelines are specifically curated by Laravel maintainers for this application. These guidelines should be followed closely to enhance the user's satisfaction building Laravel applications.

## Foundational Context
This application is a Laravel application and its main Laravel ecosystems package & versions are below. You are an expert with them all. Ensure you abide by these specific packages & versions.

- php - 8.4.15
- inertiajs/inertia-laravel (INERTIA) - v2
- laravel/fortify (FORTIFY) - v1
- laravel/framework (LARAVEL) - v12
- laravel/prompts (PROMPTS) - v0
- laravel/reverb (REVERB) - v1
- laravel/sanctum (SANCTUM) - v4
- laravel/wayfinder (WAYFINDER) - v0
- tightenco/ziggy (ZIGGY) - v2
- laravel/mcp (MCP) - v0
- laravel/pint (PINT) - v1
- laravel/sail (SAIL) - v1
- pestphp/pest (PEST) - v4
- phpunit/phpunit (PHPUNIT) - v12
- @inertiajs/react (INERTIA) - v2
- react (REACT) - v19
- tailwindcss (TAILWINDCSS) - v4
- @laravel/vite-plugin-wayfinder (WAYFINDER) - v0
- eslint (ESLINT) - v9
- laravel-echo (ECHO) - v2
- prettier (PRETTIER) - v3

## Conventions
- You must follow all existing code conventions used in this application. When creating or editing a file, check sibling files for the correct structure, approach, and naming.
- Use descriptive names for variables and methods. For example, `isRegisteredForDiscounts`, not `discount()`.
- Check for existing components to reuse before writing a new one.

## Verification Scripts
- Do not create verification scripts or tinker when tests cover that functionality and prove it works. Unit and feature tests are more important.

## Application Structure & Architecture
- Stick to existing directory structure; don't create new base folders without approval.
- Do not change the application's dependencies without approval.

## Frontend Bundling
- If the user doesn't see a frontend change reflected in the UI, it could mean they need to run `npm run build`, `npm run dev`, or `composer run dev`. Ask them.

## Replies
- Be concise in your explanations - focus on what's important rather than explaining obvious details.

## Documentation Files
- You must only create documentation files if explicitly requested by the user.

=== boost rules ===

## Laravel Boost
- Laravel Boost is an MCP server that comes with powerful tools designed specifically for this application. Use them.

## Artisan
- Use the `list-artisan-commands` tool when you need to call an Artisan command to double-check the available parameters.

## URLs
- Whenever you share a project URL with the user, you should use the `get-absolute-url` tool to ensure you're using the correct scheme, domain/IP, and port.

## Tinker / Debugging
- You should use the `tinker` tool when you need to execute PHP to debug code or query Eloquent models directly.
- Use the `database-query` tool when you only need to read from the database.

## Reading Browser Logs With the `browser-logs` Tool
- You can read browser logs, errors, and exceptions using the `browser-logs` tool from Boost.
- Only recent browser logs will be useful - ignore old logs.

## Searching Documentation (Critically Important)
- Boost comes with a powerful `search-docs` tool you should use before any other approaches when dealing with Laravel or Laravel ecosystem packages. This tool automatically passes a list of installed packages and their versions to the remote Boost API, so it returns only version-specific documentation for the user's circumstance. You should pass an array of packages to filter on if you know you need docs for particular packages.
- The `search-docs` tool is perfect for all Laravel-related packages, including Laravel, Inertia, Livewire, Filament, Tailwind, Pest, Nova, Nightwatch, etc.
- You must use this tool to search for Laravel ecosystem documentation before falling back to other approaches.
- Search the documentation before making code changes to ensure we are taking the correct approach.
- Use multiple, broad, simple, topic-based queries to start. For example: `['rate limiting', 'routing rate limiting', 'routing']`.
- Do not add package names to queries; package information is already shared. For example, use `test resource table`, not `filament 4 test resource table`.

### Available Search Syntax
- You can and should pass multiple queries at once. The most relevant results will be returned first.

1. Simple Word Searches with auto-stemming - query=authentication - finds 'authenticate' and 'auth'.
2. Multiple Words (AND Logic) - query=rate limit - finds knowledge containing both "rate" AND "limit".
3. Quoted Phrases (Exact Position) - query="infinite scroll" - words must be adjacent and in that order.
4. Mixed Queries - query=middleware "rate limit" - "middleware" AND exact phrase "rate limit".
5. Multiple Queries - queries=["authentication", "middleware"] - ANY of these terms.

=== php rules ===

## PHP

- Always use curly braces for control structures, even if it has one line.

### Constructors
- Use PHP 8 constructor property promotion in `__construct()`.
    - <code-snippet>public function __construct(public GitHub $github) { }</code-snippet>
- Do not allow empty `__construct()` methods with zero parameters unless the constructor is private.

### Type Declarations
- Always use explicit return type declarations for methods and functions.
- Use appropriate PHP type hints for method parameters.

<code-snippet name="Explicit Return Types and Method Params" lang="php">
protected function isAccessible(User $user, ?string $path = null): bool
{
    ...
}
</code-snippet>

## Comments
- Prefer PHPDoc blocks over inline comments. Never use comments within the code itself unless there is something very complex going on.

## PHPDoc Blocks
- Add useful array shape type definitions for arrays when appropriate.

## Enums
- Typically, keys in an Enum should be TitleCase. For example: `FavoritePerson`, `BestLake`, `Monthly`.

=== tests rules ===

## Test Enforcement

- Every change must be programmatically tested. Write a new test or update an existing test, then run the affected tests to make sure they pass.
- Run the minimum number of tests needed to ensure code quality and speed. Use `php artisan test --compact` with a specific filename or filter.

=== inertia-laravel/core rules ===

## Inertia

- Inertia.js components should be placed in the `resources/js/Pages` directory unless specified differently in the JS bundler (`vite.config.js`).
- Use `Inertia::render()` for server-side routing instead of traditional Blade views.
- Use the `search-docs` tool for accurate guidance on all things Inertia.

<code-snippet name="Inertia Render Example" lang="php">
// routes/web.php example
Route::get('/users', function () {
    return Inertia::render('Users/Index', [
        'users' => User::all()
    ]);
});
</code-snippet>

=== inertia-laravel/v2 rules ===

## Inertia v2

- Make use of all Inertia features from v1 and v2. Check the documentation before making any changes to ensure we are taking the correct approach.

### Inertia v2 New Features
- Deferred props.
- Infinite scrolling using merging props and `WhenVisible`.
- Lazy loading data on scroll.
- Polling.
- Prefetching.

### Deferred Props & Empty States
- When using deferred props on the frontend, you should add a nice empty state with pulsing/animated skeleton.

### Inertia Form General Guidance
- The recommended way to build forms when using Inertia is with the `<Form>` component - a useful example is below. Use the `search-docs` tool with a query of `form component` for guidance.
- Forms can also be built using the `useForm` helper for more programmatic control, or to follow existing conventions. Use the `search-docs` tool with a query of `useForm helper` for guidance.
- `resetOnError`, `resetOnSuccess`, and `setDefaultsOnSuccess` are available on the `<Form>` component. Use the `search-docs` tool with a query of `form component resetting` for guidance.

=== laravel/core rules ===

## Do Things the Laravel Way

- Use `php artisan make:` commands to create new files (i.e. migrations, controllers, models, etc.). You can list available Artisan commands using the `list-artisan-commands` tool.
- If you're creating a generic PHP class, use `php artisan make:class`.
- Pass `--no-interaction` to all Artisan commands to ensure they work without user input. You should also pass the correct `--options` to ensure correct behavior.

### Database
- Always use proper Eloquent relationship methods with return type hints. Prefer relationship methods over raw queries or manual joins.
- Use Eloquent models and relationships before suggesting raw database queries.
- Avoid `DB::`; prefer `Model::query()`. Generate code that leverages Laravel's ORM capabilities rather than bypassing them.
- Generate code that prevents N+1 query problems by using eager loading.
- Use Laravel's query builder for very complex database operations.

### Model Creation
- When creating new models, create useful factories and seeders for them too. Ask the user if they need any other things, using `list-artisan-commands` to check the available options to `php artisan make:model`.

### APIs & Eloquent Resources
- For APIs, default to using Eloquent API Resources and API versioning unless existing API routes do not, then you should follow existing application convention.

### Controllers & Validation
- Always create Form Request classes for validation rather than inline validation in controllers. Include both validation rules and custom error messages.
- Check sibling Form Requests to see if the application uses array or string based validation rules.

### Queues
- Use queued jobs for time-consuming operations with the `ShouldQueue` interface.

### Authentication & Authorization
- Use Laravel's built-in authentication and authorization features (gates, policies, Sanctum, etc.).

### URL Generation
- When generating links to other pages, prefer named routes and the `route()` function.

### Configuration
- Use environment variables only in configuration files - never use the `env()` function directly outside of config files. Always use `config('app.name')`, not `env('APP_NAME')`.

### Testing
- When creating models for tests, use the factories for the models. Check if the factory has custom states that can be used before manually setting up the model.
- Faker: Use methods such as `$this->faker->word()` or `fake()->randomDigit()`. Follow existing conventions whether to use `$this->faker` or `fake()`.
- When creating tests, make use of `php artisan make:test [options] {name}` to create a feature test, and pass `--unit` to create a unit test. Most tests should be feature tests.

### Vite Error
- If you receive an "Illuminate\Foundation\ViteException: Unable to locate file in Vite manifest" error, you can run `npm run build` or ask the user to run `npm run dev` or `composer run dev`.

=== laravel/v12 rules ===

## Laravel 12

- Use the `search-docs` tool to get version-specific documentation.
- Since Laravel 11, Laravel has a new streamlined file structure which this project uses.

### Laravel 12 Structure
- In Laravel 12, middleware are no longer registered in `app/Http/Kernel.php`.
- Middleware are configured declaratively in `bootstrap/app.php` using `Application::configure()->withMiddleware()`.
- `bootstrap/app.php` is the file to register middleware, exceptions, and routing files.
- `bootstrap/providers.php` contains application specific service providers.
- The `app\Console\Kernel.php` file no longer exists; use `bootstrap/app.php` or `routes/console.php` for console configuration.
- Console commands in `app/Console/Commands/` are automatically available and do not require manual registration.

### Database
- When modifying a column, the migration must include all of the attributes that were previously defined on the column. Otherwise, they will be dropped and lost.
- Laravel 12 allows limiting eagerly loaded records natively, without external packages: `$query->latest()->limit(10);`.

### Models
- Casts can and likely should be set in a `casts()` method on a model rather than the `$casts` property. Follow existing conventions from other models.

=== wayfinder/core rules ===

## Laravel Wayfinder

Wayfinder generates TypeScript functions and types for Laravel controllers and routes which you can import into your client-side code. It provides type safety and automatic synchronization between backend routes and frontend code.

### Development Guidelines
- Always use the `search-docs` tool to check Wayfinder correct usage before implementing any features.
- Always prefer named imports for tree-shaking (e.g., `import { show } from '@/actions/...'`).
- Avoid default controller imports (prevents tree-shaking).
- Run `php artisan wayfinder:generate` after route changes if Vite plugin isn't installed.

### Feature Overview
- Form Support: Use `.form()` with `--with-form` flag for HTML form attributes — `<form {...store.form()}>` → `action="/posts" method="post"`.
- HTTP Methods: Call `.get()`, `.post()`, `.patch()`, `.put()`, `.delete()` for specific methods — `show.head(1)` → `{ url: "/posts/1", method: "head" }`.
- Invokable Controllers: Import and invoke directly as functions. For example, `import StorePost from '@/actions/.../StorePostController'; StorePost()`.
- Named Routes: Import from `@/routes/` for non-controller routes. For example, `import { show } from '@/routes/post'; show(1)` for route name `post.show`.
- Parameter Binding: Detects route keys (e.g., `{post:slug}`) and accepts matching object properties — `show("my-post")` or `show({ slug: "my-post" })`.
- Query Merging: Use `mergeQuery` to merge with `window.location.search`, set values to `null` to remove — `show(1, { mergeQuery: { page: 2, sort: null } })`.
- Query Parameters: Pass `{ query: {...} }` in options to append params — `show(1, { query: { page: 1 } })` → `"/posts/1?page=1"`.
- Route Objects: Functions return `{ url, method }` shaped objects — `show(1)` → `{ url: "/posts/1", method: "get" }`.
- URL Extraction: Use `.url()` to get URL string — `show.url(1)` → `"/posts/1"`.

### Example Usage

<code-snippet name="Wayfinder Basic Usage" lang="typescript">
    // Import controller methods (tree-shakable)...
    import { show, store, update } from '@/actions/App/Http/Controllers/PostController'

    // Get route object with URL and method...
    show(1) // { url: "/posts/1", method: "get" }

    // Get just the URL...
    show.url(1) // "/posts/1"

    // Use specific HTTP methods...
    show.get(1) // { url: "/posts/1", method: "get" }
    show.head(1) // { url: "/posts/1", method: "head" }

    // Import named routes...
    import { show as postShow } from '@/routes/post' // For route name 'post.show'
    postShow(1) // { url: "/posts/1", method: "get" }
</code-snippet>

### Wayfinder + Inertia
If your application uses the `<Form>` component from Inertia, you can use Wayfinder to generate form action and method automatically.
<code-snippet name="Wayfinder Form Component (React)" lang="typescript">

<Form {...store.form()}><input name="title" /></Form>

</code-snippet>

=== pint/core rules ===

## Laravel Pint Code Formatter

- You must run `vendor/bin/pint --dirty` before finalizing changes to ensure your code matches the project's expected style.
- Do not run `vendor/bin/pint --test`, simply run `vendor/bin/pint` to fix any formatting issues.

=== pest/core rules ===

## Pest
### Testing
- If you need to verify a feature is working, write or update a Unit / Feature test.

### Pest Tests
- All tests must be written using Pest. Use `php artisan make:test --pest {name}`.
- You must not remove any tests or test files from the tests directory without approval. These are not temporary or helper files - these are core to the application.
- Tests should test all of the happy paths, failure paths, and weird paths.
- Tests live in the `tests/Feature` and `tests/Unit` directories.
- Pest tests look and behave like this:
<code-snippet name="Basic Pest Test Example" lang="php">
it('is true', function () {
    expect(true)->toBeTrue();
});
</code-snippet>

### Running Tests
- Run the minimal number of tests using an appropriate filter before finalizing code edits.
- To run all tests: `php artisan test --compact`.
- To run all tests in a file: `php artisan test --compact tests/Feature/ExampleTest.php`.
- To filter on a particular test name: `php artisan test --compact --filter=testName` (recommended after making a change to a related file).
- When the tests relating to your changes are passing, ask the user if they would like to run the entire test suite to ensure everything is still passing.

### Pest Assertions
- When asserting status codes on a response, use the specific method like `assertForbidden` and `assertNotFound` instead of using `assertStatus(403)` or similar, e.g.:
<code-snippet name="Pest Example Asserting postJson Response" lang="php">
it('returns all', function () {
    $response = $this->postJson('/api/docs', []);

    $response->assertSuccessful();
});
</code-snippet>

### Mocking
- Mocking can be very helpful when appropriate.
- When mocking, you can use the `Pest\Laravel\mock` Pest function, but always import it via `use function Pest\Laravel\mock;` before using it. Alternatively, you can use `$this->mock()` if existing tests do.
- You can also create partial mocks using the same import or self method.

### Datasets
- Use datasets in Pest to simplify tests that have a lot of duplicated data. This is often the case when testing validation rules, so consider this solution when writing tests for validation rules.

<code-snippet name="Pest Dataset Example" lang="php">
it('has emails', function (string $email) {
    expect($email)->not->toBeEmpty();
})->with([
    'james' => 'james@laravel.com',
    'taylor' => 'taylor@laravel.com',
]);
</code-snippet>

=== pest/v4 rules ===

## Pest 4

- Pest 4 is a huge upgrade to Pest and offers: browser testing, smoke testing, visual regression testing, test sharding, and faster type coverage.
- Browser testing is incredibly powerful and useful for this project.
- Browser tests should live in `tests/Browser/`.
- Use the `search-docs` tool for detailed guidance on utilizing these features.

### Browser Testing
- You can use Laravel features like `Event::fake()`, `assertAuthenticated()`, and model factories within Pest 4 browser tests, as well as `RefreshDatabase` (when needed) to ensure a clean state for each test.
- Interact with the page (click, type, scroll, select, submit, drag-and-drop, touch gestures, etc.) when appropriate to complete the test.
- If requested, test on multiple browsers (Chrome, Firefox, Safari).
- If requested, test on different devices and viewports (like iPhone 14 Pro, tablets, or custom breakpoints).
- Switch color schemes (light/dark mode) when appropriate.
- Take screenshots or pause tests for debugging when appropriate.

### Example Tests

<code-snippet name="Pest Browser Test Example" lang="php">
it('may reset the password', function () {
    Notification::fake();

    $this->actingAs(User::factory()->create());

    $page = visit('/sign-in'); // Visit on a real browser...

    $page->assertSee('Sign In')
        ->assertNoJavascriptErrors() // or ->assertNoConsoleLogs()
        ->click('Forgot Password?')
        ->fill('email', 'nuno@laravel.com')
        ->click('Send Reset Link')
        ->assertSee('We have emailed your password reset link!')

    Notification::assertSent(ResetPassword::class);
});
</code-snippet>

<code-snippet name="Pest Smoke Testing Example" lang="php">
$pages = visit(['/', '/about', '/contact']);

$pages->assertNoJavascriptErrors()->assertNoConsoleLogs();
</code-snippet>

=== inertia-react/core rules ===

## Inertia + React

- Use `router.visit()` or `<Link>` for navigation instead of traditional links.

<code-snippet name="Inertia Client Navigation" lang="react">

import { Link } from '@inertiajs/react'
<Link href="/">Home</Link>

</code-snippet>

=== inertia-react/v2/forms rules ===

## Inertia v2 + React Forms

<code-snippet name="`<Form>` Component Example" lang="react">

import { Form } from '@inertiajs/react'

export default () => (
    <Form action="/users" method="post">
        {({
            errors,
            hasErrors,
            processing,
            wasSuccessful,
            recentlySuccessful,
            clearErrors,
            resetAndClearErrors,
            defaults
        }) => (
        <>
        <input type="text" name="name" />

        {errors.name && <div>{errors.name}</div>}

        <button type="submit" disabled={processing}>
            {processing ? 'Creating...' : 'Create User'}
        </button>

        {wasSuccessful && <div>User created successfully!</div>}
        </>
    )}
    </Form>
)

</code-snippet>

=== tailwindcss/core rules ===

## Tailwind CSS

- Use Tailwind CSS classes to style HTML; check and use existing Tailwind conventions within the project before writing your own.
- Offer to extract repeated patterns into components that match the project's conventions (i.e. Blade, JSX, Vue, etc.).
- Think through class placement, order, priority, and defaults. Remove redundant classes, add classes to parent or child carefully to limit repetition, and group elements logically.
- You can use the `search-docs` tool to get exact examples from the official documentation when needed.

### Spacing
- When listing items, use gap utilities for spacing; don't use margins.

<code-snippet name="Valid Flex Gap Spacing Example" lang="html">
    <div class="flex gap-8">
        <div>Superior</div>
        <div>Michigan</div>
        <div>Erie</div>
    </div>
</code-snippet>

### Dark Mode
- If existing pages and components support dark mode, new pages and components must support dark mode in a similar way, typically using `dark:`.

=== tailwindcss/v4 rules ===

## Tailwind CSS 4

- Always use Tailwind CSS v4; do not use the deprecated utilities.
- `corePlugins` is not supported in Tailwind v4.
- In Tailwind v4, configuration is CSS-first using the `@theme` directive — no separate `tailwind.config.js` file is needed.

<code-snippet name="Extending Theme in CSS" lang="css">
@theme {
  --color-brand: oklch(0.72 0.11 178);
}
</code-snippet>

- In Tailwind v4, you import Tailwind using a regular CSS `@import` statement, not using the `@tailwind` directives used in v3:

<code-snippet name="Tailwind v4 Import Tailwind Diff" lang="diff">
   - @tailwind base;
   - @tailwind components;
   - @tailwind utilities;
   + @import "tailwindcss";
</code-snippet>

### Replaced Utilities
- Tailwind v4 removed deprecated utilities. Do not use the deprecated option; use the replacement.
- Opacity values are still numeric.

| Deprecated |	Replacement |
|------------+--------------|
| bg-opacity-* | bg-black/* |
| text-opacity-* | text-black/* |
| border-opacity-* | border-black/* |
| divide-opacity-* | divide-black/* |
| ring-opacity-* | ring-black/* |
| placeholder-opacity-* | placeholder-black/* |
| flex-shrink-* | shrink-* |
| flex-grow-* | grow-* |
| overflow-ellipsis | text-ellipsis |
| decoration-slice | box-decoration-slice |
| decoration-clone | box-decoration-clone |
</laravel-boost-guidelines>
