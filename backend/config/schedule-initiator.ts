import schedule from 'node-schedule';
import { debug } from 'console';
import { CustomerOrderService } from '../services/customer-order';

export class ScheduleInitiator {

  createSchedules() {
    const rule = new schedule.RecurrenceRule();
    rule.hour = 0;
    rule.minute = 0;
    rule.second = 5;
    rule.tz = 'Etc/UTC';

    const job = schedule.scheduleJob(rule, () => {
        debug('A new day has begun in the UTC timezone!');
        const now = new Date();
        if (now.getUTCMonth() === 0 && now.getUTCDate() === 1) {
          debug('It is the first day of the UTC year! Start calculating customer loyalty tiers!');
          const customerOrderService = new CustomerOrderService();
          customerOrderService.updateAllCustomerLoyaltyTiers();
        }
      });
  }
}

export const scheduleInitiator = new ScheduleInitiator();
