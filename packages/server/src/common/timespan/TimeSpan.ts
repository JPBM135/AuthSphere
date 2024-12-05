import { TIMES_IN_MILLISECONDS } from './constants.js';

/**
 * Represents a time span.
 */
export class TimeSpan {
	private readonly _milliseconds: number;

	private constructor(milliseconds: number) {
		this._milliseconds = milliseconds;
	}

	/**
	 * Creates a TimeSpan from milliseconds.
	 *
	 * @param milliseconds - The number of milliseconds.
	 * @returns A TimeSpan instance.
	 */
	public static fromMilliseconds(milliseconds: number): TimeSpan {
		return new TimeSpan(milliseconds);
	}

	/**
	 * Creates a TimeSpan from seconds.
	 *
	 * @param seconds - The number of seconds.
	 * @returns A TimeSpan instance.
	 */
	public static fromSeconds(seconds: number): TimeSpan {
		return new TimeSpan(seconds * TIMES_IN_MILLISECONDS.SECOND);
	}

	/**
	 * Creates a TimeSpan from minutes.
	 *
	 * @param minutes - The number of minutes.
	 * @returns A TimeSpan instance.
	 */
	public static fromMinutes(minutes: number): TimeSpan {
		return new TimeSpan(minutes * TIMES_IN_MILLISECONDS.MINUTE);
	}

	/**
	 * Creates a TimeSpan from hours.
	 *
	 * @param hours - The number of hours.
	 * @returns A TimeSpan instance.
	 */
	public static fromHours(hours: number): TimeSpan {
		return new TimeSpan(hours * TIMES_IN_MILLISECONDS.HOUR);
	}

	/**
	 * Creates a TimeSpan from days.
	 *
	 * @param days - The number of days.
	 * @returns A TimeSpan instance.
	 */
	public static fromDays(days: number): TimeSpan {
		return new TimeSpan(days * TIMES_IN_MILLISECONDS.DAY);
	}

	/**
	 * Gets the total milliseconds in the TimeSpan.
	 *
	 * @returns The total milliseconds.
	 */
	public milliseconds(): number {
		return this._milliseconds;
	}

	/**
	 * Gets the total seconds in the TimeSpan.
	 *
	 * @returns The total seconds.
	 */
	public seconds(): number {
		return this._milliseconds / TIMES_IN_MILLISECONDS.SECOND;
	}

	/**
	 * Gets the total minutes in the TimeSpan.
	 *
	 * @returns The total minutes.
	 */
	public minutes(): number {
		return this._milliseconds / TIMES_IN_MILLISECONDS.MINUTE;
	}

	/**
	 * Gets the total hours in the TimeSpan.
	 *
	 * @returns The total hours.
	 */
	public hours(): number {
		return this._milliseconds / TIMES_IN_MILLISECONDS.HOUR;
	}

	/**
	 * Gets the total days in the TimeSpan.
	 *
	 * @returns The total days.
	 */
	public days(): number {
		return this._milliseconds / TIMES_IN_MILLISECONDS.DAY;
	}

	/**
	 * Adds another TimeSpan to this TimeSpan.
	 *
	 * @param other - The other TimeSpan.
	 * @returns A new TimeSpan representing the sum.
	 */
	public add(other: TimeSpan): TimeSpan {
		return TimeSpan.fromMilliseconds(this._milliseconds + other._milliseconds);
	}

	/**
	 * Subtracts another TimeSpan from this TimeSpan.
	 *
	 * @param other - The other TimeSpan.
	 * @returns A new TimeSpan representing the difference.
	 */
	public subtract(other: TimeSpan): TimeSpan {
		return TimeSpan.fromMilliseconds(this._milliseconds - other._milliseconds);
	}

	/**
	 * Multiplies this TimeSpan by a factor.
	 *
	 * @param factor - The factor to multiply by.
	 * @returns A new TimeSpan representing the product.
	 */
	public multiply(factor: number): TimeSpan {
		return TimeSpan.fromMilliseconds(this._milliseconds * factor);
	}

	/**
	 * Divides this TimeSpan by a divisor.
	 *
	 * @param divisor - The divisor to divide by.
	 * @returns A new TimeSpan representing the quotient.
	 */
	public divide(divisor: number): TimeSpan {
		return TimeSpan.fromMilliseconds(this._milliseconds / divisor);
	}

	/**
	 * Checks if this TimeSpan is equal to another TimeSpan.
	 *
	 * @param other - The other TimeSpan.
	 * @returns True if the TimeSpans are equal, otherwise false.
	 */
	public equals(other: TimeSpan): boolean {
		return this._milliseconds === other._milliseconds;
	}

	/**
	 * Checks if this TimeSpan is less than another TimeSpan.
	 *
	 * @param other - The other TimeSpan.
	 * @returns True if this TimeSpan is less, otherwise false.
	 */
	public lessThan(other: TimeSpan): boolean {
		return this._milliseconds < other._milliseconds;
	}

	/**
	 * Checks if this TimeSpan is less than or equal to another TimeSpan.
	 *
	 * @param other - The other TimeSpan.
	 * @returns True if this TimeSpan is less than or equal, otherwise false.
	 */
	public lessThanOrEqual(other: TimeSpan): boolean {
		return this._milliseconds <= other._milliseconds;
	}

	/**
	 * Checks if this TimeSpan is greater than another TimeSpan.
	 *
	 * @param other - The other TimeSpan.
	 * @returns True if this TimeSpan is greater, otherwise false.
	 */
	public greaterThan(other: TimeSpan): boolean {
		return this._milliseconds > other._milliseconds;
	}

	/**
	 * Checks if this TimeSpan is greater than or equal to another TimeSpan.
	 *
	 * @param other - The other TimeSpan.
	 * @returns True if this TimeSpan is greater than or equal, otherwise false.
	 */
	public greaterThanOrEqual(other: TimeSpan): boolean {
		return this._milliseconds >= other._milliseconds;
	}
}
