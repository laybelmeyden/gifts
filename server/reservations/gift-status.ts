import 'server-only';
import { sql, type SQL } from 'drizzle-orm';

/** Статус подарка для смотрящего; ожидает алиасы `g` (gifts) и `r` (left join reservations). */
export function giftStatus(viewerId: string | null): SQL {
  return sql`case
    when g."received_at" is not null then 'received'
    when r."user_id" = ${viewerId} then 'mine'
    when r."gift_id" is not null then 'booked'
    else 'free'
  end`;
}

/** Бронь для хозяина: имя дарящего прячется, если тот выбрал «Анонимно». Те же алиасы `g` и `r`. */
export const ownerBooking = sql`case
  when r."gift_id" is null then null
  else json_build_object('name', case when r."anonymous" then null else r."name" end)
end`;
