import { useId, type JSX } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FormField } from '../../../../components/FormField';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/auth/useAuth';

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

const formWrapper = 'flex flex-col items-center justify-center gap-6 relative w-full max-w-xl';
const inputsWrapper = 'flex flex-col items-center gap-5 relative self-stretch w-full';

export default function FormSection(): JSX.Element {
  const emailId = useId();
  const { forgotPassword, isLoading } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    await forgotPassword({ email: data.email });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={formWrapper}>
      <div className={inputsWrapper}>
        <FormField
          id={emailId}
          label="Email"
          type="email"
          placeholder="Enter your email"
          register={register('email')}
          error={errors.email}
          autoComplete="email"
        />
      </div>

      <Button
        type="submit"
        isLoading={isLoading}
        loadingText="Sending..."
        className="w-full h-12 rounded-[32px] bg-primary hover:bg-primary/90 text-white text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Reset
      </Button>
    </form>
  );
}

