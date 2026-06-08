import Link from "next/link";
import Logo from "../Logo";

interface AuthFormContainerProps {
  children: React.ReactNode,
  title: string,
  subtitle: string,
  footerText: string,
  footerAction: string,
  footerLink: string
}
const AuthFormContainer = ({ title, subtitle, footerText, footerAction, footerLink, children }: AuthFormContainerProps) => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#030712] relative overflow-hidden py-12">

      {/* // Header */}
      <div className="w-full max-w-md z-10 px-6">
        <Logo />
        <div className="w-full text-center">
          <h1 className="text-3xl font-bold text-white tracking-tight">{title}</h1>
          <p className="text-slate-500 mt-2">{subtitle}</p>
        </div>

        <div className="bg-slate-900/40 border border-slate-800 backdrop-blur-xl p-8 rounded-3xl shadow-2xl mt-4">
          {children}
        </div>

        {/* // Footer */}
        <p className="text-center text-slate-500 text-sm mt-8">
          {footerText} <Link href={footerLink} className="text-purple-400 hover:underline font-semibold">{footerAction}</Link>
        </p>
      </div>
    </div>
  )
}

export default AuthFormContainer;