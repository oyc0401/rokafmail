import { auth } from "src/app/api/auth/auth";
import { User } from "src/db";

import { notFound } from "next/navigation";

export default function RootLayout({ children }) {
  return (
    <>
      <div className="flex justify-center gap-2 mb-4">
        <a
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          href="/admin/control"
        >
          Control Main
        </a>
        <a
          className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          href="/admin/control/user"
        >
          Control User
        </a>
        <a
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          href="/admin/control/post"
        >
          Control Post
        </a>

        <a
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          href="/admin/control/postQueue"
        >
          Control Post Queue
        </a>
      </div>
      {children}
    </>
  );
}
