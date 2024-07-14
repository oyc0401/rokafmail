import { auth } from "src/auth";
import CredentialPage from "./credential/CredentialPage";


export default async function Register() {
  const session = await auth();
  console.log(session);
  

  return <CredentialPage></CredentialPage>
}
