import AuthFormContainer from "@/components/auth/AuthFormContainer";

const RegisterPage = () => {
  return (
    <AuthFormContainer title={"Join Us"} subtitle={"Start your expense management journey"} footerText={"Already have an account?"} footerAction={"Log in"} footerLink={"/login"}>
      <form>

      </form>
    </AuthFormContainer>
  )
}

export default RegisterPage;