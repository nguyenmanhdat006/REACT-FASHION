import { JSX } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook, FaApple } from 'react-icons/fa';
import SocialProviders from './SocialProviders';

export default function SocialAuthSection(): JSX.Element {
  return (
    <>
      <div className="flex items-center justify-center gap-2 relative self-stretch w-full" aria-label="Alternative login methods">
        <div className="flex-1 h-px bg-gray-300 max-w-[200px]" />
        <span className="text-black text-body-regular px-2">OR</span>
        <div className="flex-1 h-px bg-gray-300 max-w-[200px]" />
      </div>

      <SocialProviders>
        <button type="button" aria-label="Continue with Google" className="flex items-center justify-center p-4 bg-slate-50 hover:bg-slate-100 transition-colors rounded-2xl border border-gray-100"><FcGoogle className="w-6 h-6" /></button>
        <button type="button" aria-label="Continue with Facebook" className="flex items-center justify-center p-4 bg-slate-50 hover:bg-slate-100 transition-colors rounded-2xl border border-gray-100"><FaFacebook className="w-6 h-6 text-[#1877F2]" /></button>
        <button type="button" aria-label="Continue with Apple" className="flex items-center justify-center p-4 bg-slate-50 hover:bg-slate-100 transition-colors rounded-2xl border border-gray-100"><FaApple className="w-6 h-6 text-black" /></button>
      </SocialProviders>
    </>
  );
}
