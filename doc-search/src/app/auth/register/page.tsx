import RegisterForm from "@/app/components/auth/RegisterForm";
import AuthLayout from "@/app/components/auth/AuthLayout";

export default function RegisterPage() {
  return (
    <AuthLayout 
      title="Create an account" 
      subtitle="Start organizing your documentation"
    >
      <RegisterForm />
    </AuthLayout>
  );
}