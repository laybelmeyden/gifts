import { AuthPanel } from '@features/auth';
import { HeroScene } from '@widgets/hero-scene';

/** `next` - куда вернуть после входа (например, к подарку, который хотели забронировать). */
export function SignInPage({ next }: { next: string | null }) {
  return <AuthPanel mode="sign-in" next={next} art={<HeroScene quote />} />;
}
