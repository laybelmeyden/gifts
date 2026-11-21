import { routes } from '@shared/config';
import { HomePage } from '@pages/home';
import { getSessionUser } from '@server/auth';
import { redirect } from 'next/navigation';

export default async function HomeRoute() {
  if (await getSessionUser()) redirect(routes.myList);
  return <HomePage />;
}
