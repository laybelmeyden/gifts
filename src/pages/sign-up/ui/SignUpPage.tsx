import { AuthPanel } from '@features/auth';
import { HeroScene } from '@widgets/hero-scene';

export function SignUpPage() {
  return <AuthPanel mode="sign-up" art={<HeroScene quote />} />;
}
