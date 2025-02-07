import LoginForm from "@/app/components/auth/LoginForm";
import AuthLayout from "@/app/components/auth/AuthLayout";

export default function LoginPage() {
  return (
    <AuthLayout 
      title="Sign in to your account" 
      subtitle="Access your documentation hub"
    >
      <LoginForm />
    </AuthLayout>
  );
}