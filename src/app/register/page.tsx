import { auth } from "src/auth";
import CredentialRegister from "./credential/CredentialRegister";
import GoogleRegister from "./google/GoogleRegister";
import { redirect } from "next/navigation";


export default async function Register() {
  const session = await auth();

  console.log(session);

  if (session?.user.username) {
    redirect(`/mail/${session?.user.username}`);
  }

  if (session?.user.provider == 'google') {
    return <GoogleRegister />
  }


  return <CredentialRegister></CredentialRegister>
}
