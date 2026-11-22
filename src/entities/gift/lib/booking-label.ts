import type { GiftBooking } from '@contracts/gift';
import { t } from '@contracts/i18n';

export function bookingLabel(booking: GiftBooking) {
  return booking.name ? t.gift.bookedBy(booking.name) : t.gift.bookedAnonymous;
}
