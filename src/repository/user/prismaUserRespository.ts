import prisma from "src/db/prisma";
import { InputUser, RokafProfile, UserRepository } from "./userRepository";


export class PrismaUserRepository implements UserRepository {

  insert = (data: InputUser) => prisma.user.create({ data });

  findById = (id: number) =>
    prisma.user.findUnique({ where: { id }, });


  updateRokafProfile = (id: number, rokafProfile: RokafProfile) =>
    prisma.user.update({
      where: { id },
      data: {
        memberSeq: rokafProfile.memberSeq,
        sodae: rokafProfile.sodae,
        connect: true
      },
    });
}
