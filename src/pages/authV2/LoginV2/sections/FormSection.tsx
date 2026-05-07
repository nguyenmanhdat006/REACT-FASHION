import { FormEvent, useId, useState, type JSX } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook, FaApple } from 'react-icons/fa';
import HeaderSection from './HeaderSection';
import SocialProviders from './SocialProviders';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

const sectionClass = 'flex flex-1 flex-col items-center h-full justify-center gap-10 py-12 px-6 sm:px-12 md:px-20 lg:px-[120px] bg-cover bg-center overflow-y-auto';
const formWrapper = 'flex flex-col items-center justify-center gap-6 relative w-full max-w-xl';
const inputsWrapper = 'flex flex-col items-center gap-5 relative self-stretch w-full';
const labelClass = 'text-black text-base font-normal';
const inputClass = 'h-14 rounded-2xl border-secondary-900 px-4 text-base placeholder:text-gray-500 w-full';

export default function FormSection(): JSX.Element {
  const emailId = useId();
  const passwordId = useId();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // handle login
  };

  return (
    <section className={sectionClass}>
      <HeaderSection />

      <form onSubmit={handleSubmit} className={formWrapper}>
        <div className={inputsWrapper}>
          <div className="flex flex-col items-start gap-2 relative self-stretch w-full">
            <Label htmlFor={emailId} className={labelClass}>Email</Label>
            <Input id={emailId} name="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" className={inputClass} />
          </div>

          <div className="flex flex-col items-start gap-2 relative self-stretch w-full">
            <Label htmlFor={passwordId} className={labelClass}>Password</Label>
            <div className="relative w-full">
              <Input id={passwordId} name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" className={cn(inputClass, 'pl-4 pr-12')} />

              <Button type="button" variant="ghost" size="icon" aria-label={showPassword ? 'Hide password' : 'Show password'} aria-pressed={showPassword} onClick={() => setShowPassword(v => !v)} className="absolute right-2 top-1/2 -translate-y-1/2 hover:bg-transparent text-gray-500 hover:text-black">
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          <div className="relative self-stretch text-right">
            <button type="button" className="text-black text-sm font-medium hover:underline transition-all">Forgot your password?</button>
          </div>
        </div>

        <Button type="submit" className="w-full h-12 rounded-[32px] bg-primary hover:bg-primary/90 text-white text-base font-medium">Login</Button>
      </form>

      <div className="flex items-center justify-center gap-2 relative self-stretch w-full" aria-label="Alternative login methods">
        <div className="flex-1 h-px bg-gray-300 max-w-[200px]" />
        <span className="text-black text-body-regular px-2">OR</span>
        <div className="flex-1 h-px bg-gray-300 max-w-[200px]" />
      </div>

      <SocialProviders>
        <button type="button" aria-label="Continue with Google" className="flex items-center justify-center p-4 bg-slate-50 hover:bg-slate-100 transition-colors rounded-2xl border border-gray-100"><FcGoogle className="w-6 h-6"/></button>
        <button type="button" aria-label="Continue with Facebook" className="flex items-center justify-center p-4 bg-slate-50 hover:bg-slate-100 transition-colors rounded-2xl border border-gray-100"><FaFacebook className="w-6 h-6 text-[#1877F2]"/></button>
        <button type="button" aria-label="Continue with Apple" className="flex items-center justify-center p-4 bg-slate-50 hover:bg-slate-100 transition-colors rounded-2xl border border-gray-100"><FaApple className="w-6 h-6 text-black"/></button>
      </SocialProviders>

      <div className="flex items-center justify-center gap-1 relative mt-2 text-base">
        <span className="text-body-regular">Don&apos;t have account?</span>
        <button type="button" className="text-primary-900 text-body-regular hover:underline">Register now</button>
      </div>
    </section>
  );
}
