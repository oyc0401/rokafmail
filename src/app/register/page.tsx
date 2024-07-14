import { auth } from "src/auth";
import CredentialRegister from "./credential/CredentialRegister";


export default async function Register() {
  const session = await auth();
  console.log(session);

  if (session?.user.provider == 'Google') {


  }


  return <CredentialRegister></CredentialRegister>
}
