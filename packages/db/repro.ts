// for debugging purposes a reproducible file to check if prisma client generates properly or not.
import { prisma } from './src/index';

async function main() {
    console.log('Prisma instance:', prisma);
}

main().catch(e => console.error(e));
