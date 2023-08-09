import { PrismaClient } from '@prisma/client';
import * as argon from 'argon2';
import { ConfigService } from '@nestjs/config';

import { randomUUID } from 'crypto';

const prisma = new PrismaClient();
const config = new ConfigService();

const userone_email = config.get('USER_ONE_EMAIL');
const userone_password = config.get('USER_ONE_PASSWORD');

const usertwo_email = config.get('USER_TWO_EMAIL');
const usertwo_password = config.get('USER_TWO_PASSWORD');

const userthree_email = config.get('USER_THREE_EMAIL');
const userthree_password = config.get('USER_THREE_PASSWORD');

const userfour_email = config.get('USER_FOUR_EMAIL');
const userfour_password = config.get('USER_FOUR_PASSWORD');

const project_one_name = config.get('PROJECT_ONE_NAME')
const project_two_name = config.get('PROJECT_TWO_NAME')
const project_one_description = config.get('PROJECT_ONE_DESCRIPTION')
const project_two_description = config.get('PROJECT_TWO_DESCRIPTION')

const hash = async (pass: string) => {
    return await argon.hash(pass);
};

async function main() {
   await prisma.user.upsert({
    where: { email: userone_email },
    update: {},
    create: {
        id: randomUUID(),
        email: userone_email,
        first_name: '',
        last_name: '',
        password: await hash(userone_password)
    }
});

   await prisma.user.upsert({
    where: { email: usertwo_email },
    update: {},
    create: {
        id: randomUUID(),
        email: usertwo_email,
        first_name: '',
        last_name: '',
        password: await hash(usertwo_password)
    }
});


   await prisma.user.upsert({
    where: { email: userthree_email },
    update: {},
    create: {
        id: randomUUID(),
        email: userthree_email,
        first_name: '',
        last_name: '',
        password: await hash(userthree_password)
    }
});

   await prisma.user.upsert({
    where: { email: userfour_email },
    update: {},
    create: {
        id: randomUUID(),
        email: userfour_email,
        first_name: '',
        last_name: '',
        password: await hash(userfour_password)
    }
});

   await prisma.project.upsert({
    where: { name: project_one_name },
    update: {},
    create: {
        id: randomUUID(),
        name: project_one_name,
        description: project_one_description,
    }
});

   await prisma.project.upsert({
    where: { name: project_two_name },
    update: {},
    create: {
        id: randomUUID(),
        name: project_two_name,
        description: project_two_description,
    }
});


}

main().catch((err) => err.message);
