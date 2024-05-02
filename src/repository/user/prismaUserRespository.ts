import prisma from "src/db/prisma";


export class PrismaUserRepository {

  insert = (data: {
    username: string;
    password: string;
    name: string;
    birth: string;
    generation: number;
    message: string;
  }) => prisma.user.create({ data });


  findById = (id: number) =>
    prisma.user.findUnique({ where: { id }, });

  update = (id: number, { memberSeq, sodae, connect }
    : { memberSeq: string; sodae: string; connect: boolean },
  ) => prisma.user.update({
    where: { id },
    data: { memberSeq, sodae, connect },
  });
}
