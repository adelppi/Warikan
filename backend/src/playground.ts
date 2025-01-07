import { prismaClient } from "./prisma";

const playground = async () => {
   await prismaClient.user.create({
      data: {
         email: "a@a.com",
         password: "hashedPassword",
         username: "a",
      },
   });
};

playground();
