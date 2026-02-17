import { prisma } from "src/utils/prisma"
async function main() {
  // Example: Fetch all records from a table
  // Replace 'user' with your actual model name
  const allUsers = await prisma.user.findMany()
  console.log('All users:', JSON.stringify(allUsers, null, 2))
	console.log('users length', allUsers.length)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })