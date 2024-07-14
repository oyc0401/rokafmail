import prisma from "src/db/prisma";
import { EditProfileProps, InputUser, RokafProfile, UserJoinAuth, UserRepository } from "./userRepository";

export class PrismaUserRepository implements UserRepository {
  insert = async (data: InputUser) => {
    const temp = await prisma.user.create({ data });
    await prisma.auth.create({
      data: {
        userId: temp.id,
        provider: 'Credential',
        password: temp.password,
      }
    })

    return temp;
  }

  findById = (id: number) =>
    prisma.user.findUnique({ where: { id }, });

  findByUsername = (username: string) =>
    prisma.user.findUnique({ where: { username }, });

  updateRokafProfile = (id: number, rokafProfile: RokafProfile) =>
    prisma.user.update({
      where: { id },
      data: {
        memberSeq: rokafProfile.memberSeq,
        sodae: rokafProfile.sodae,
        connect: true
      },
    });

  editProfile = (id: number, editProps: EditProfileProps) =>
    prisma.user.update({
      where: { id },
      data: editProps,
    });

  editPassword = async (id: number, password: string) => {
    await prisma.user.update({
      where: { id },
      data: {
        password: password,
      }
    });
    await prisma.auth.update({
      where: { userId: id },
      data: {
        password: password,
      },
    });
  }

  getAuthByUsername = async (username: string) => {
    const val = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        name: true,
        auth: true,
      }
    }) as UserJoinAuth;
    return val;
  }

}
