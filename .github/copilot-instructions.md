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
