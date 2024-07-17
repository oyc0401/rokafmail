import prisma from "src/db/prisma";

export async function findUserByUidUsername(uid: string, username: string) {
  const user = await prisma.auth.findUnique({
    where: {
      uid_provider: {
        uid: uid,
        provider: 'google',
      }
    },
    include: {
      user: true,
    }
  });

  if (username == user?.user.username) {
    return {
      username: user.user.username,
      role: 'trainee',
      provider: 'google'
    }
  }

}


export async function getUserDataGoogle(uid: string) {
  const user = await prisma.auth.findUnique({
    where: {
      uid_provider: {
        uid: uid,
        provider: 'google',
      }
    },
    include: {
      user: true,
    }
  });

  if (user) {
    return {
      username: user.user.username,
      role: 'trainee',
      provider: 'google'
    }
  }

}