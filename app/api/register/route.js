const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

export async function POST(request) {

  const body = await request.json();
  let user = {
    userName: body.userName,
    password: body.password,
    name: body.name,
    birth: body.birth,
    generation: body.generation,
  }


  const createUser = await prisma.user.create({ data: user })
}
// use `prisma` in your application to read and write data in your DB