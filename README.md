# Gifts — список подарков

Пиксельный фиолетовый сайт, где можно собрать список подарков своей мечты и поделиться им по ссылке.

Сайт: https://gifts-plum-mu.vercel.app

## Стек

- **Next.js 16** (App Router), React 19, TypeScript
- **TanStack Query** — данные с сервера, **React Context** — сессия и интерфейс (модалки, тост)
- **Better Auth** — вход по почте и паролю
- **Postgres в Neon**, схема и миграции — **Drizzle ORM**
- **zod** — общие схемы проверки форм для фронтенда и API
- CSS Modules
- Хостинг — **Vercel**

## Структура

```
app/          маршруты Next.js: страницы, layout'ы, API (app/api/...)
pages/        пустая: без неё Next принял бы src/pages за свои маршруты
src/          фронтенд по Feature-Sliced Design
  app/          провайдеры, layout'ы, глобальные стили и шрифт
  pages/        экраны: home, sign-in, sign-up, board, recovery, reset-password, admin
  widgets/      крупные блоки экрана: header, …
  features/     действия пользователя: auth, …
  entities/     сущности: session, …
  shared/       api-клиент, ui-кит, утилиты, конфиг
server/       бэкенд: db (схема Drizzle, подключение), auth (Better Auth), сервисы
contracts/    общие типы и схемы для фронтенда и сервера
drizzle/      SQL-миграции
```

Слой FSD импортирует только из слоёв ниже, а чужой слайс — только через его `index.ts`.
Фронтенд не импортирует `server/`. Эти правила проверяет ESLint.

## Локальный запуск

Нужен Node.js 20.9 или новее.

```bash
npm install
cp .env.example .env.local   # и заполнить значения
npm run dev                  # http://localhost:3000
```

### Переменные окружения

| Переменная | Откуда |
| --- | --- |
| `DATABASE_URL` | Vercel → Storage → база Neon → `.env.local` |
| `DATABASE_URL_UNPOOLED` | там же; нужна для миграций |
| `BETTER_AUTH_SECRET` | случайная строка: `node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"` |
| `BETTER_AUTH_URL` | `http://localhost:3000` локально, адрес сайта на проде |

## Команды

| Команда | Что делает |
| --- | --- |
| `npm run dev` | сервер разработки |
| `npm run build` | продакшн-сборка |
| `npm run lint` | ESLint, включая правила слоёв FSD |
| `npm run typecheck` | проверка типов |
| `npm run db:generate` | создать миграцию по изменениям схемы в `server/db/schema` |
| `npm run db:migrate` | применить миграции к базе из `.env.local` |
| `npm run db:studio` | просмотр базы в браузере |

## Деплой

Vercel собирает проект из ветки `main` автоматически. База Neon подключена к проекту
через Vercel Marketplace, функции работают в регионе `fra1` рядом с базой.
Миграции применяются вручную: `npm run db:migrate`.
