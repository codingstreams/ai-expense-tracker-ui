'use client'

import { loginWithEmailAndPwd } from "@/api/login";
import AuthFormContainer from "@/components/auth/AuthFormContainer"
import { useAuth } from "@/context/AuthContext";
import { LoginInput, LoginOutput, loginSchema } from "@/validation/auth";
import { Mail, LockIcon, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const LoginPage = () => {
  // const [formData, setFormData] = useState<AuthFormData>({ email: "", password: "" })

  const { register, handleSubmit, formState: { errors } } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) })

  const { login } = useAuth()
  const router = useRouter()

  const handleLogin = async (data: LoginOutput) => {
    const authResponse = await loginWithEmailAndPwd(data.email, data.password)

    login(authResponse.accessToken)

    router.push("/dashboard")
  };

  return (
    <>
      <AuthFormContainer title={"AI Expense Tracker"} subtitle={"Sign in to manage your expenses"} footerText={"Don't have an account?"} footerAction={"Register Now"} footerLink={"/register"}>
        <form className="my-2" onSubmit={handleSubmit(handleLogin)}>
          <div className="my-2">
            <label className="text-sm font-medium text-slate-400 ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input {...register('email')}
                placeholder="user@example.com" className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 pl-12 pr-4 text-white outline-none focus:border-purple-500 transition-all" />
              {errors.email?.message && <p>{errors.email?.message}</p>}
            </div>
            <div className="my-2">
              <label className="text-sm font-medium text-slate-400">Password</label>
              <div className="relative">
                <LockIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input {...register('password')} type="password"
                  placeholder="•••••••" className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 pl-12 pr-4 text-white outline-none focus:border-purple-500 transition-all" />
              </div>
            </div>
            <button className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20 transition-all" type="submit">
              Sign In <ArrowRight size={18} />
            </button>
          </div>
        </form>
      </AuthFormContainer>
    </>
  )
}

export default LoginPage;
