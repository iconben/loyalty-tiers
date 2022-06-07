import { debug } from "console";

export class DbDateTimeUtil {

  getUTCStartOfLastYear(): string {
    const fullYear: number = new Date().getUTCFullYear() - 1;
    return this.getUTCStartOfYear(fullYear);
  }

  getUTCEndOfLastYear(): string {
    const fullYear: number = new Date().getUTCFullYear() - 1;
    return this.getUTCEndOfYear(fullYear);
  }

  getUTCStartOfYear(fullYear: number): string {
    return fullYear.toString().concat('-01-01 00:00:000');
  }

  getUTCEndOfYear(fullYear: number): string {
    return fullYear.toString().concat('-12-31 59:59:999');
  }

  fromDate(date: Date): string {
    return this.fromISOString(date.toISOString());
  }

  fromISOString(isoString: string): string {
    return isoString.replace('T', ' ').replace('Z', '');
  }
}

export const dbDateTimeUtil = new DbDateTimeUtil();