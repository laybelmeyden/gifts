import { AuthPanel } from '@features/auth';
import { HeroScene } from '@widgets/hero-scene';

export function SignInPage() {
  return <AuthPanel mode="sign-in" art={<HeroScene quote />} />;
}
