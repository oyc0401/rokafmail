import { auth } from "src/app/api/auth/auth";
import { User } from "src/db";

import { Profile } from "./profile";
import { notFound } from "next/navigation";

export default async function Page() {
  const session = await auth();
  if (!session || !session.user || !session.user.email) {
    console.log('session error');
    console.log('session.user.email',session.user.email)
    console.log('session.user',session.user)
  

    notFound();
  }
  const username = session.user.email;

  const user = await User.findByUsername(username);
  if (!user)  notFound();

  const {  name, birth,generation, message } = user;

  return (
    <>
      <Profile
        username={username}
        name={name}
        birth={birth}
        generation={generation}
        message={message}
      ></Profile>
    </>
  );

}
