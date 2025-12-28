<?php

// @formatter:off
// phpcs:ignoreFile
/**
 * A helper file for your Eloquent Models
 * Copy the phpDocs from this file to the correct Model,
 * And remove them from this file, to prevent double declarations.
 *
 * @author Barry vd. Heuvel <barryvdh@gmail.com>
 */


namespace App\Models{
/**
 * @property int $id
 * @property int|null $user_id
 * @property string $action
 * @property string|null $table_name
 * @property int|null $record_id
 * @property array<array-key, mixed>|null $old_values
 * @property array<array-key, mixed>|null $new_values
 * @property string|null $ip_address
 * @property string|null $user_agent
 * @property string|null $url
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\User|null $user
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AuditLog newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AuditLog newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AuditLog query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AuditLog whereAction($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AuditLog whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AuditLog whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AuditLog whereIpAddress($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AuditLog whereNewValues($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AuditLog whereOldValues($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AuditLog whereRecordId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AuditLog whereTableName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AuditLog whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AuditLog whereUrl($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AuditLog whereUserAgent($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AuditLog whereUserId($value)
 */
	class AuditLog extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $booking_code
 * @property int $user_id
 * @property int $schedule_id
 * @property int|null $promotion_id
 * @property numeric $subtotal
 * @property numeric $discount_amount
 * @property numeric $total_amount
 * @property int $total_passengers
 * @property string $payment_status
 * @property \Illuminate\Support\Carbon|null $paid_at
 * @property \Illuminate\Support\Carbon|null $expires_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\BookingPassenger> $passengers
 * @property-read int|null $passengers_count
 * @property-read \App\Models\Payment|null $payment
 * @property-read \App\Models\Schedule $schedule
 * @property-read \App\Models\User $user
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Booking newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Booking newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Booking onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Booking query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Booking whereBookingCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Booking whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Booking whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Booking whereDiscountAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Booking whereExpiresAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Booking whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Booking wherePaidAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Booking wherePaymentStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Booking wherePromotionId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Booking whereScheduleId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Booking whereSubtotal($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Booking whereTotalAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Booking whereTotalPassengers($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Booking whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Booking whereUserId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Booking withTrashed(bool $withTrashed = true)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Booking withoutTrashed()
 */
	class Booking extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int $booking_id
 * @property string|null $ticket_number
 * @property string $full_name
 * @property string|null $identity_number
 * @property string|null $gender
 * @property numeric $price
 * @property bool $is_free_ticket
 * @property string $scan_status
 * @property \Illuminate\Support\Carbon|null $scanned_at
 * @property int|null $scanned_by
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Booking $booking
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BookingPassenger newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BookingPassenger newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BookingPassenger query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BookingPassenger whereBookingId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BookingPassenger whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BookingPassenger whereFullName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BookingPassenger whereGender($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BookingPassenger whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BookingPassenger whereIdentityNumber($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BookingPassenger whereIsFreeTicket($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BookingPassenger wherePrice($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BookingPassenger whereScanStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BookingPassenger whereScannedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BookingPassenger whereScannedBy($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BookingPassenger whereTicketNumber($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BookingPassenger whereUpdatedAt($value)
 */
	class BookingPassenger extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $name
 * @property string $code
 * @property string|null $location_address
 * @property string $status
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Ship> $ships
 * @property-read int|null $ships_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\TripRoute> $tripRoutes
 * @property-read int|null $trip_routes_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\User> $users
 * @property-read int|null $users_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Branch newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Branch newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Branch onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Branch query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Branch whereCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Branch whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Branch whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Branch whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Branch whereLocationAddress($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Branch whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Branch whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Branch whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Branch withTrashed(bool $withTrashed = true)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Branch withoutTrashed()
 */
	class Branch extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int $branch_id
 * @property int $expense_category_id
 * @property numeric $amount
 * @property \Illuminate\Support\Carbon $expense_date
 * @property string|null $description
 * @property string|null $proof_file
 * @property string $approval_status
 * @property int $created_by
 * @property int|null $approved_by
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\User|null $approver
 * @property-read \App\Models\Branch $branch
 * @property-read \App\Models\ExpenseCategory $category
 * @property-read \App\Models\User $creator
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Expense newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Expense newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Expense query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Expense whereAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Expense whereApprovalStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Expense whereApprovedBy($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Expense whereBranchId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Expense whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Expense whereCreatedBy($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Expense whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Expense whereExpenseCategoryId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Expense whereExpenseDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Expense whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Expense whereProofFile($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Expense whereUpdatedAt($value)
 */
	class Expense extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $name
 * @property bool $is_active
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Expense> $expenses
 * @property-read int|null $expenses_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ExpenseCategory newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ExpenseCategory newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ExpenseCategory query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ExpenseCategory whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ExpenseCategory whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ExpenseCategory whereIsActive($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ExpenseCategory whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ExpenseCategory whereUpdatedAt($value)
 */
	class ExpenseCategory extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int $booking_id
 * @property string $external_id
 * @property string|null $xendit_id
 * @property string|null $checkout_url
 * @property string|null $payment_method
 * @property string $status
 * @property numeric $amount
 * @property array<array-key, mixed>|null $gateway_response
 * @property \Illuminate\Support\Carbon|null $paid_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Booking $booking
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Payment newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Payment newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Payment query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Payment whereAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Payment whereBookingId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Payment whereCheckoutUrl($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Payment whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Payment whereExternalId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Payment whereGatewayResponse($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Payment whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Payment wherePaidAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Payment wherePaymentMethod($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Payment whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Payment whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Payment whereXenditId($value)
 */
	class Payment extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int $trip_route_id
 * @property int $trip_type_id
 * @property numeric $price_public
 * @property numeric $price_event
 * @property \Illuminate\Support\Carbon|null $effective_from
 * @property \Illuminate\Support\Carbon|null $effective_until
 * @property bool $is_active
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\TripRoute $tripRoute
 * @property-read \App\Models\TripType $tripType
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pricelist newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pricelist newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pricelist query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pricelist whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pricelist whereEffectiveFrom($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pricelist whereEffectiveUntil($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pricelist whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pricelist whereIsActive($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pricelist wherePriceEvent($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pricelist wherePricePublic($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pricelist whereTripRouteId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pricelist whereTripTypeId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pricelist whereUpdatedAt($value)
 */
	class Pricelist extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $code
 * @property string $name
 * @property string $type
 * @property numeric $value
 * @property int $min_qty
 * @property \Illuminate\Support\Carbon $valid_from
 * @property \Illuminate\Support\Carbon $valid_until
 * @property bool $is_active
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Promotion newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Promotion newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Promotion query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Promotion whereCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Promotion whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Promotion whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Promotion whereIsActive($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Promotion whereMinQty($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Promotion whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Promotion whereType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Promotion whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Promotion whereValidFrom($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Promotion whereValidUntil($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Promotion whereValue($value)
 */
	class Promotion extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int $booking_passenger_id
 * @property int $operator_id
 * @property \Illuminate\Support\Carbon $scanned_at
 * @property string|null $device_info
 * @property string $scan_result
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\User $operator
 * @property-read \App\Models\BookingPassenger $passenger
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ScanLog newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ScanLog newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ScanLog query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ScanLog whereBookingPassengerId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ScanLog whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ScanLog whereDeviceInfo($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ScanLog whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ScanLog whereOperatorId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ScanLog whereScanResult($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ScanLog whereScannedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ScanLog whereUpdatedAt($value)
 */
	class ScanLog extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int $trip_route_id
 * @property int $trip_type_id
 * @property int $ship_id
 * @property \Illuminate\Support\Carbon $departure_date
 * @property \Illuminate\Support\Carbon $departure_time
 * @property int $available_seats
 * @property string $status
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property-read \App\Models\TripRoute $route
 * @property-read \App\Models\Ship $ship
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Schedule available()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Schedule newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Schedule newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Schedule onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Schedule query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Schedule whereAvailableSeats($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Schedule whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Schedule whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Schedule whereDepartureDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Schedule whereDepartureTime($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Schedule whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Schedule whereShipId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Schedule whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Schedule whereTripRouteId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Schedule whereTripTypeId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Schedule whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Schedule withTrashed(bool $withTrashed = true)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Schedule withoutTrashed()
 */
	class Schedule extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $key
 * @property string $label
 * @property string|null $value
 * @property string $type
 * @property string $group
 * @property int|null $updated_by
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read mixed $formatted_value
 * @property-read \App\Models\User|null $updatedBy
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Setting newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Setting newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Setting query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Setting whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Setting whereGroup($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Setting whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Setting whereKey($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Setting whereLabel($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Setting whereType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Setting whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Setting whereUpdatedBy($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Setting whereValue($value)
 */
	class Setting extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int $branch_id
 * @property string $name
 * @property int $capacity
 * @property string $status
 * @property string|null $description
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property-read \App\Models\Branch $branch
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Schedule> $schedules
 * @property-read int|null $schedules_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Ship newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Ship newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Ship onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Ship query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Ship whereBranchId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Ship whereCapacity($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Ship whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Ship whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Ship whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Ship whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Ship whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Ship whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Ship whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Ship withTrashed(bool $withTrashed = true)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Ship withoutTrashed()
 */
	class Ship extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int $branch_id
 * @property string $name
 * @property int|null $duration_minutes
 * @property array<array-key, mixed>|null $waypoints
 * @property string $status
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property-read \App\Models\Branch $branch
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Pricelist> $pricelists
 * @property-read int|null $pricelists_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TripRoute newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TripRoute newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TripRoute onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TripRoute query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TripRoute whereBranchId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TripRoute whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TripRoute whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TripRoute whereDurationMinutes($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TripRoute whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TripRoute whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TripRoute whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TripRoute whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TripRoute whereWaypoints($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TripRoute withTrashed(bool $withTrashed = true)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TripRoute withoutTrashed()
 */
	class TripRoute extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $name
 * @property string $code
 * @property string|null $default_start_time
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Pricelist> $pricelists
 * @property-read int|null $pricelists_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TripType newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TripType newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TripType query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TripType whereCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TripType whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TripType whereDefaultStartTime($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TripType whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TripType whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TripType whereUpdatedAt($value)
 */
	class TripType extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $name
 * @property string $email
 * @property \Illuminate\Support\Carbon|null $email_verified_at
 * @property string $password
 * @property string $role
 * @property string $account_type
 * @property int|null $branch_id
 * @property string|null $phone_number
 * @property string $status
 * @property string|null $deleted_at
 * @property string|null $remember_token
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Branch|null $branch
 * @property-read \Illuminate\Notifications\DatabaseNotificationCollection<int, \Illuminate\Notifications\DatabaseNotification> $notifications
 * @property-read int|null $notifications_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \Spatie\Permission\Models\Permission> $permissions
 * @property-read int|null $permissions_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \Spatie\Permission\Models\Role> $roles
 * @property-read int|null $roles_count
 * @method static \Database\Factories\UserFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User permission($permissions, $without = false)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User role($roles, $guard = null, $without = false)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereAccountType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereBranchId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereEmailVerifiedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User wherePassword($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User wherePhoneNumber($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereRememberToken($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereRole($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User withoutPermission($permissions)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User withoutRole($roles, $guard = null)
 */
	class User extends \Eloquent {}
}

