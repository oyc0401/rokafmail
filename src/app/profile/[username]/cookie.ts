"use server";

import { cookies } from "next/headers";

export async function setCookie(password: string, username: string) {
  cookies().set({
    name: "password",
    value: password,
    path: `/mailbox/${username}`,
  });
}

export async function deleteCookie() {
  cookies().delete("password");
}
