import { AuthPanel } from '@features/auth';
import { HeroScene } from '@widgets/hero-scene';

/** `next` - куда вернуть после регистрации (например, к подарку, который хотели забронировать). */
export function SignUpPage({ next }: { next: string | null }) {
  return <AuthPanel mode="sign-up" next={next} art={<HeroScene quote />} />;
}
