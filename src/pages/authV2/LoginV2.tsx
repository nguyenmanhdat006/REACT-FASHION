import { useState, useId } from "react";
import { Eye, EyeOff } from "lucide-react";

// SVG Icons for OAuth providers
const GoogleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const FacebookIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="#1877F2"/>
  </svg>
);

const AppleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
  </svg>
);

// Shopping illustration placeholder
const ShoppingIllustration = () => (
  <svg width="400" height="400" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Background circles */}
    <circle cx="200" cy="200" r="180" fill="#E8E5F5" opacity="0.4"/>
    <circle cx="80" cy="120" r="40" fill="#C5C0E8" opacity="0.3"/>
    <circle cx="320" cy="100" r="35" fill="#C5C0E8" opacity="0.3"/>
    
    {/* Shopping bags */}
    <rect x="60" y="160" width="60" height="80" rx="6" fill="#A89DD4"/>
    <path d="M70 160 Q90 140 110 160" stroke="#8B7FC7" strokeWidth="4" fill="none"/>
    <rect x="130" y="140" width="70" height="100" rx="6" fill="#6B5FA8"/>
    <path d="M142 140 Q165 115 193 140" stroke="#5A4F97" strokeWidth="4" fill="none"/>
    <rect x="220" y="155" width="55" height="85" rx="6" fill="#C5A3D4"/>
    <path d="M230 155 Q247 138 270 155" stroke="#B592C3" strokeWidth="4" fill="none"/>
    
    {/* Person */}
    <circle cx="210" cy="110" r="22" fill="#FFB8A0"/>
    <rect x="188" y="130" width="45" height="70" rx="8" fill="#5B7BE8"/>
    <rect x="175" y="132" width="20" height="55" rx="6" fill="#5B7BE8"/>
    <rect x="230" y="132" width="20" height="55" rx="6" fill="#5B7BE8"/>
    <rect x="190" y="198" width="20" height="45" rx="6" fill="#3D5BD9"/>
    <rect x="214" y="198" width="20" height="45" rx="6" fill="#3D5BD9"/>
    
    {/* Cart */}
    <path d="M155 220 L165 270 L265 270 L275 220 Z" fill="#FFB347" opacity="0.9"/>
    <circle cx="185" cy="285" r="12" fill="#666"/>
    <circle cx="245" cy="285" r="12" fill="#666"/>
    <path d="M140 210 L155 220" stroke="#888" strokeWidth="4" strokeLinecap="round"/>
    
    {/* Gear icons */}
    <circle cx="55" cy="200" r="18" fill="none" stroke="#B0A8D4" strokeWidth="4"/>
    <circle cx="55" cy="200" r="7" fill="#B0A8D4"/>
    <circle cx="320" cy="200" r="14" fill="none" stroke="#B0A8D4" strokeWidth="3"/>
    <circle cx="320" cy="200" r="5" fill="#B0A8D4"/>
    
    {/* Small decorative elements */}
    <circle cx="100" cy="300" r="6" fill="#C5C0E8"/>
    <circle cx="300" cy="320" r="8" fill="#C5C0E8"/>
    <circle cx="350" cy="160" r="5" fill="#A89DD4"/>
  </svg>
);

// Brand logo placeholder
const BrandLogo = () => (
  <div className="relative">
    <svg width="80" height="74" viewBox="0 0 80 74" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Simple shopping/mail hybrid icon */}
      <rect x="10" y="20" width="60" height="44" rx="6" fill="#B8B0E8" opacity="0.9"/>
      <path d="M10 28 L40 46 L70 28" stroke="white" strokeWidth="3" fill="none"/>
      {/* Small person on top */}
      <circle cx="58" cy="14" r="8" fill="#FF8A80"/>
      <rect x="52" y="20" width="12" height="16" rx="3" fill="#5B7BE8"/>
      {/* Bag */}
      <rect x="64" y="10" width="10" height="14" rx="2" fill="#A89DD4"/>
      <path d="M65 10 Q69 6 73 10" stroke="#8B7FC7" strokeWidth="2" fill="none"/>
    </svg>
  </div>
);

const socialProviders = [
  { id: "google", label: "Continue with Google", icon: <GoogleIcon /> },
  { id: "facebook", label: "Continue with Facebook", icon: <FacebookIcon /> },
  { id: "apple", label: "Continue with Apple", icon: <AppleIcon /> },
];

export default function Login() {
  const emailId = useId();
  const passwordId = useId();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-white">
      <div className="flex w-full max-w-[1512px] min-h-screen md:min-h-0 md:h-[982px] items-center justify-center relative bg-white">
        
        {/* Left panel - illustration */}
        <section
          aria-label="Promotional illustration"
          className="hidden md:flex flex-col items-center justify-center gap-2.5 p-9 relative flex-1 self-stretch"
        >
          <div className="flex flex-col items-center justify-between px-10 py-[120px] relative flex-1 self-stretch w-full bg-[#F0EEF8] rounded-[32px]">
            <div className="flex items-center justify-center w-full flex-1">
              <ShoppingIllustration />
            </div>
            <div className="flex flex-col items-center justify-center gap-3 relative self-stretch w-full mt-8">
              <div
                aria-label="Slide indicator"
                className="inline-flex items-center gap-1.5"
              >
                <div className="relative h-2 w-2 rounded-[20px] bg-[#C5C0E8]" />
                <div className="relative h-2 w-2 rounded-[20px] bg-[#C5C0E8]" />
                <div className="relative h-2 w-5 rounded-[20px] bg-[#3D3D3D]" />
              </div>
              <p className="text-black text-lg font-normal text-center leading-relaxed">
                Everything you need, all in one place
              </p>
            </div>
          </div>
        </section>

        {/* Right panel - login form */}
        <section className="flex flex-col w-full md:w-[728px] items-center justify-center gap-8 md:gap-10 pt-16 pb-20 md:pt-20 md:pb-[120px] px-6 sm:px-12 md:px-[120px] relative self-stretch bg-white">
          
          {/* Header */}
          <header className="inline-flex flex-col items-center gap-4">
            <BrandLogo />
            <div className="inline-flex flex-col items-center justify-center">
              <h1 className="text-3xl md:text-4xl font-semibold text-black tracking-tight leading-tight whitespace-nowrap">
                Welcome Back!
              </h1>
              <p className="text-base font-normal text-black mt-1">
                The world at your fingertips
              </p>
            </div>
          </header>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="flex flex-col items-center justify-center gap-6 w-full"
          >
            <div className="flex flex-col items-center gap-4 w-full">
              
              {/* Email field */}
              <div className="flex flex-col items-start gap-2 w-full">
                <label
                  htmlFor={emailId}
                  className="text-black text-base font-normal"
                >
                  Email
                </label>
                <div className="flex items-center gap-2.5 p-4 w-full bg-white rounded-2xl border border-[#9B8FD4]">
                  <input
                    id={emailId}
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="w-full text-base text-black placeholder:text-[#666666] outline-none bg-transparent"
                  />
                </div>
              </div>

              {/* Password field */}
              <div className="flex flex-col items-start gap-2 w-full">
                <label
                  htmlFor={passwordId}
                  className="text-black text-base font-normal"
                >
                  Password
                </label>
                <div className="flex items-center justify-between p-4 w-full bg-white rounded-2xl border border-[#9B8FD4]">
                  <input
                    id={passwordId}
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full text-base text-black placeholder:text-[#666666] outline-none bg-transparent"
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    aria-pressed={showPassword}
                    onClick={() => setShowPassword((v) => !v)}
                    className="ml-3 inline-flex h-6 w-6 shrink-0 items-center justify-center text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Forgot password */}
              <div className="relative self-stretch text-right">
                <button
                  type="button"
                  className="text-base font-normal text-black hover:underline"
                >
                  Forgot your password?
                </button>
              </div>
            </div>

            {/* Login button */}
            <button
              type="submit"
              className="flex items-center justify-center gap-2.5 px-8 py-3 w-full bg-[#C5B8E8] hover:bg-[#B5A8D8] transition-colors rounded-[32px] overflow-hidden cursor-pointer border-0"
            >
              <span className="text-base font-normal text-white whitespace-nowrap">
                Login
              </span>
            </button>
          </form>

          {/* OR divider */}
          <div
            className="flex items-center justify-center gap-2 w-full"
            aria-label="Alternative login methods"
          >
            <div className="flex-1 h-px border-t border-[#666666] opacity-50" />
            <span className="text-base font-normal text-black px-2">OR</span>
            <div className="flex-1 h-px border-t border-[#666666] opacity-50" />
          </div>

          {/* Social login buttons */}
          <div className="inline-flex items-center gap-8 md:gap-[42px]">
            {socialProviders.map((provider) => (
              <button
                key={provider.id}
                type="button"
                aria-label={provider.label}
                className="inline-flex items-center justify-center gap-2.5 p-4 bg-[#F0EEF8] hover:bg-[#E5E2F3] transition-colors rounded-2xl overflow-hidden border-0 cursor-pointer"
              >
                {provider.icon}
              </button>
            ))}
          </div>

          {/* Register link */}
          <div className="inline-flex items-center gap-1">
            <p className="text-base font-normal text-black whitespace-nowrap">
              Don&#39;t have account?
            </p>
            <button
              type="button"
              className="text-base font-normal text-[#7B6BC4] hover:underline whitespace-nowrap border-0 bg-transparent cursor-pointer"
            >
              Register now
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}