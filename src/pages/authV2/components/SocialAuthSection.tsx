import { JSX } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook, FaApple } from 'react-icons/fa';
import SocialProviders from './SocialProviders';

export default function SocialAuthSection(): JSX.Element {

  // const handleSocialLogin = async (provider: 'google' | 'facebook'): Promise<void> => {
  //   try {
  //     setIsRedirecting(provider);

  //     const redirectUri = `${window.location.origin}/auth/callback`;

  //     if (provider === 'google') {
  //       await keycloakAuthService.loginWithGoogle(redirectUri);
  //       return;
  //     }

  //     await keycloakAuthService.loginWithFacebook(redirectUri);
  //   } catch (error) {
  //     setIsRedirecting(null);
  //     toast.error(error instanceof Error ? error.message : 'Unable to start social login');
  //   }
  // };

  return (
    <>
      <div className="flex items-center justify-center gap-2 relative self-stretch w-full" aria-label="Alternative login methods">
        <div className="flex-1 h-px bg-gray-300 max-w-[200px]" />
        <span className="text-black text-body-regular px-2">OR</span>
        <div className="flex-1 h-px bg-gray-300 max-w-[200px]" />
      </div>

      <SocialProviders>
        <button
          type="button"
          aria-label="Continue with Google"
          // onClick={() => handleSocialLogin('google')}
          // disabled={isRedirecting !== null}
          className="flex items-center justify-center p-4 bg-slate-50 hover:bg-slate-100 transition-colors rounded-2xl border border-gray-100 disabled:cursor-not-allowed disabled:opacity-70"
        >
          <FcGoogle className="w-6 h-6" />
        </button>
        <button
          type="button"
          aria-label="Continue with Facebook"
          // onClick={() => handleSocialLogin('facebook')}
          // disabled={isRedirecting !== null}
          className="flex items-center justify-center p-4 bg-slate-50 hover:bg-slate-100 transition-colors rounded-2xl border border-gray-100 disabled:cursor-not-allowed disabled:opacity-70"
        >
          <FaFacebook className="w-6 h-6 text-[#1877F2]" />
        </button>
        <button type="button" aria-label="Continue with Apple" disabled className="flex items-center justify-center p-4 bg-slate-50 rounded-2xl border border-gray-100 opacity-50 cursor-not-allowed"><FaApple className="w-6 h-6 text-black" /></button>
      </SocialProviders>
    </>
  );
}
