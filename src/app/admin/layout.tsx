import { auth } from "src/app/api/auth/auth";
import { User } from "src/db";

import { notFound } from "next/navigation";



export default async function RootLayout({ children }) {
  const session = await auth();
  if (!session || !session.user || !session.user.email) {
    notFound();
  }
  const username = session.user.email;

  const user = await User.findByUsername(username);
  if (!user)  notFound();

  if (username!='oyc0401') {
    notFound();
  } 
  
  return (
    <>
      <div className="container mx-auto pt-8">

        <div className="flex flex justify-between mb-4">
          <a className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" href="/admin">
            Home
          </a>
          <a className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" href="/profile">
            My Profile
          </a>

        </div>
        {children}
      </div>
   
    </>
  
  );
}
