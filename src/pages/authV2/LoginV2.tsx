import { FormEvent, JSX, useId, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook, FaApple } from "react-icons/fa";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const group = "/icons/Group.svg";
// import stuckAtHomeMailingList from "./stuck-at-home-mailing-list.png";

const socialProviders = [
  {
    id: "google",
    label: "Continue with Google",
    icon: <FcGoogle className="w-6 h-6" />,
  },
  {
    id: "facebook",
    label: "Continue with Facebook",
    icon: <FaFacebook className="w-6 h-6 text-[#1877F2]" />,
  },
  {
    id: "apple",
    label: "Continue with Apple",
    icon: <FaApple className="w-6 h-6 text-black" />,
  },
];

const carouselDots = [
  "bg-gray-300 w-2",
  "bg-gray-300 w-2",
  "bg-black w-5",
];

export default function LoginV2(): JSX.Element {
  const emailId = useId();
  const passwordId = useId();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Xử lý logic đăng nhập
  };

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-white p-4">
      <div className="flex w-full max-w-[1512px] min-h-[982px] items-stretch justify-center relative bg-white flex-col md:flex-row overflow-hidden rounded-[32px] shadow-sm">
        
        {/* Banner Section (Ẩn trên thiết bị di động) */}
        <section
          aria-label="Promotional illustration"
          className="hidden md:flex flex-col items-center justify-center p-9 relative flex-1 self-stretch"
        >
          <div className="flex flex-col items-center justify-between px-10 py-[120px] relative flex-1 self-stretch w-full bg-slate-50 rounded-[32px]">
            <img
              className="relative w-full max-w-[540px] aspect-square object-contain"
              alt="Shopping illustration"
              src={group}
            />
            <div className="flex flex-col items-center justify-center gap-6 relative self-stretch w-full mt-8">
              <div
                aria-label="Slide indicator"
                className="inline-flex items-center gap-1.5 relative"
              >
                {carouselDots.map((dotClassName, index) => (
                  <div
                    key={index}
                    className={`relative h-2 rounded-full transition-all ${dotClassName}`}
                  />
                ))}
              </div>
              <p className="relative text-black text-xl font-medium text-center tracking-wide">
                Everything you need, all in one place
              </p>
            </div>
          </div>
        </section>

        {/* Login Form Section */}
        <section className="flex flex-col flex-1 items-center justify-center gap-10 py-12 px-6 sm:px-12 md:px-20 lg:px-[120px] relative self-stretch bg-[url(/frame-2.png)] bg-cover bg-center max-w-full md:max-w-[728px]">
          
          <header className="flex flex-col items-center gap-4 relative">
            {/* <img
              className="relative w-20 h-auto object-contain"
              alt="Stuck at home mailing list"
              src={stuckAtHomeMailingList}
            /> */}
            <div className="flex flex-col items-center justify-center relative">
              <h1 className="relative text-black text-3xl font-semibold tracking-tight text-center">
                Welcome Back!
              </h1>
              <p className="relative text-black text-base font-normal mt-1 text-center">
                The world at your fingertips
              </p>
            </div>
          </header>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col items-center justify-center gap-6 relative self-stretch w-full"
          >
            <div className="flex flex-col items-center gap-5 relative self-stretch w-full">
              
              {/* Email Input */}
              <div className="flex flex-col items-start gap-2 relative self-stretch w-full">
                <Label
                  htmlFor={emailId}
                  className="text-black text-base font-normal"
                >
                  Email
                </Label>
                <Input
                  id={emailId}
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Enter your email"
                  className="h-14 rounded-2xl border-secondary-900 px-4 text-base placeholder:text-gray-500 w-full"
                />
              </div>

              {/* Password Input */}
              <div className="flex flex-col items-start gap-2 relative self-stretch w-full">
                <Label
                  htmlFor={passwordId}
                  className="text-black text-base font-normal"
                >
                  Password
                </Label>
                <div className="relative w-full">
                  <Input
                    id={passwordId}
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter your password"
                    className="h-14 rounded-2xl border-secondary-900 pl-4 pr-12 text-base placeholder:text-gray-500 w-full"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    aria-pressed={showPassword}
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 hover:bg-transparent text-gray-500 hover:text-black"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Forgot Password Link */}
              <div className="relative self-stretch text-right">
                <button
                  type="button"
                  className="text-black text-sm font-medium hover:underline transition-all"
                >
                  Forgot your password?
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-12 rounded-[32px] bg-primary-900 hover:bg-primary-900/90 text-white text-base font-medium"
            >
              Login
            </Button>
          </form>

          {/* Divider */}
          <div
            className="flex items-center justify-center gap-2 relative self-stretch w-full"
            aria-label="Alternative login methods"
          >
            <div className="flex-1 h-px bg-gray-300" />
            <span className="text-black text-sm font-medium px-2">OR</span>
            <div className="flex-1 h-px bg-gray-300" />
          </div>

          {/* Social Providers */}
          <div className="flex items-center justify-center gap-6 sm:gap-[42px] relative w-full">
            {socialProviders.map((provider) => (
              <button
                key={provider.id}
                type="button"
                aria-label={provider.label}
                className="flex items-center justify-center p-4 bg-slate-50 hover:bg-slate-100 transition-colors rounded-2xl border border-gray-100"
              >
                {provider.icon}
              </button>
            ))}
          </div>

          {/* Register Link */}
          <div className="flex items-center justify-center gap-1 relative mt-2 text-base">
            <span className="text-black font-normal">
              Don&#39;t have account?
            </span>
            <button
              type="button"
              className="text-primary-900 font-medium hover:underline"
            >
              Register now
            </button>
          </div>
          
        </section>
      </div>
    </main>
  );
};