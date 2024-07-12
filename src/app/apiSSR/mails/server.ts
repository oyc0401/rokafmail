import { Post, User } from "src/db";
import prisma from "src/db/prisma";


const postSelect = {
  id: true,
  userId: true,
  name: true,
  relationship: true,
  title: true,
  createdAt: true,
  posted: true,
  postAt: true,
  isPublic: true,
  user: {
    select: {
      username: true,
      connect: true,
      generation: true,
    },
  },
}
const privateSelect = {
  ...postSelect,
}

const publicSelect = {
  ...postSelect,
  contents: true,
}