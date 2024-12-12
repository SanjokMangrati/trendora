"use client"
import { useRouter } from "next/navigation"
import { LoginForm } from "@/components/common/LoginForm"
import { Form } from "@/components/ui/custom-form"
import { loginSchema, LoginFormValues } from "@/lib/validations/auth"
import { loginAdmin } from "@/lib/api/admin/auth/login"
import { useToast } from "@/hooks/use-toast"

export default function Login() {
  const router = useRouter()
  const { toast } = useToast();

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const response = await loginAdmin(data);

      if (response.success) {
        toast({
          title: "Login successful, redirecting..."
        });
        router.push('/admin/customers')
      } else {
        toast({
          variant: 'destructive',
          title: "Login failed"
        });
      }
    } catch (error: any) {
      console.log("Login error:", error);
      toast({
        title: error?.message || "Something went wrong, please try again."
      });
    }
  };



  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="px-8 py-6 mt-4 text-left text-background bg-foreground shadow-lg rounded-lg">
        <h3 className="text-2xl font-bold text-center mb-6">Login to your account</h3>
        <Form<LoginFormValues> onSubmit={onSubmit} schema={loginSchema} className="space-y-6">
          {(methods) => <LoginForm form={methods} />}
        </Form>
      </div>
    </div>
  )
}
