import { debug } from "console";

export class DbDateTimeUtil {

  /**
   * Get the start time of last year in UTC timezone.
   * @returns {string} in format of 'YYYY-MM-DD HH:mm:ss.SSS'
   */
  getUTCStartOfLastYear(): string {
    const fullYear: number = new Date().getUTCFullYear() - 1;
    return this.getUTCStartOfYear(fullYear);
  }

  /**
   * Get the end time of last year in UTC timezone.
   * @returns {string} in format of 'YYYY-MM-DD HH:mm:ss.SSS'
   */
  getUTCEndOfLastYear(): string {
    const fullYear: number = new Date().getUTCFullYear() - 1;
    return this.getUTCEndOfYear(fullYear);
  }

  /**
   * Get the start time of this year in UTC timezone.
   * @returns {string} in format of 'YYYY-MM-DD HH:mm:ss.SSS'
   */
    getUTCStartOfThisYear(): string {
    const fullYear: number = new Date().getUTCFullYear();
    return this.getUTCStartOfYear(fullYear);
  }

  /**
   * Get the end time of this year in UTC timezone.
   * @returns {string} in format of 'YYYY-MM-DD HH:mm:ss.SSS'
   */
  getUTCEndOfThisYear(): string {
    const fullYear: number = new Date().getUTCFullYear();
    return this.getUTCEndOfYear(fullYear);
  }

  /**
   * Get the start time of a year in UTC timezone.
   * @param {number} fullYear - the year to get the start of, e.g. 2019
   * @returns {string} in format of 'YYYY-MM-DD HH:mm:ss.SSS'
   */
  getUTCStartOfYear(fullYear: number): string {
    return fullYear.toString().concat('-01-01 00:00:00.000');
  }

  /**
   * Get the end time of a year in UTC timezone.
   * @param {number} fullYear - the year to get the end of, e.g. 2019
   * @returns {string} in format of 'YYYY-MM-DD HH:mm:ss.SSS'
   */
  getUTCEndOfYear(fullYear: number): string {
    return fullYear.toString().concat('-12-31 23:59:59.999');
  }

  /**
   * Convert a date to a UTC date string in format of 'YYYY-MM-DD HH:mm:ss.SSS'
   * @param date the date to convert
   * @returns {string} in format of 'YYYY-MM-DD HH:mm:ss.SSS'
   */
  fromDate(date: Date): string {
    if (date == null) return null;
    return this.fromISOString(date.toISOString());
  }

  /**
   * Convert a ISO date string to a UTC date string in format of 'YYYY-MM-DD HH:mm:ss.SSS'
   * @param isoString a date string in ISO format (YYYY-MM-DDTHH:mm:ss.SSSZ)
   * @returns {string} in format of 'YYYY-MM-DD HH:mm:ss.SSS'
   */
  fromISOString(isoString: string): string {
    if (isoString == null || isoString.length === 0) return isoString;
    return isoString.replace('T', ' ').replace('Z', '');
  }

  /**
   * Convert a UTC datetime string in format of 'YYYY-MM-DD HH:mm:ss.SSS' to a date object
   * @param datetime a datetime string in format of 'YYYY-MM-DD HH:mm:ss.SSS'
   * @returns {Date} a date object
   */
  toDate(datetime: string): Date {
    const date = datetime.split(' ')[0];
    const time = datetime.split(' ')[1].split('.')[0];
    const year = parseInt(date.split('-')[0], 10);
    const month = parseInt(date.split('-')[1], 10);
    const day = parseInt(date.split('-')[2], 10);
    const hour = parseInt(time.split(':')[0], 10);
    const minute = parseInt(time.split(':')[1], 10);
    const second = parseInt(time.split(':')[2], 10);
    const milliseconds = parseInt(datetime.split(' ')[1].split('.')[1], 10);
    return new Date(Date.UTC(year, month - 1, day, hour, minute, second, milliseconds));
  }
}

export const dbDateTimeUtil = new DbDateTimeUtil();