'use server'

import prisma from "src/db/prisma";

export async function QueueStatus() {

  const queueCount = await prisma.usersQueue.count();

  async function removeJung() {
    'use server'
    // Step 1: Fetch all records from userQueues
    const allRecords = await prisma.usersQueue.findMany();

    // Step 2: Create a map to track userIds and their corresponding record ids
    const userIdMap = {};

    allRecords.forEach(record => {
      if (!userIdMap[record.userId]) {
        userIdMap[record.userId] = [];
      }
      userIdMap[record.userId].push(record.id);
    });

    // Step 3: Identify duplicate records to delete
    const recordsToDelete: any = [];

    for (const userId in userIdMap) {
      const recordIds = userIdMap[userId];
      if (recordIds.length > 1) {
        // Add all but the first record id to the deletion list
        recordsToDelete.push(...recordIds.slice(1));
      }
    }

    console.log(`중복 개수: ${recordsToDelete.length}`);

    // Step 4: Delete duplicate records
    if (recordsToDelete.length > 0) {
      await prisma.usersQueue.deleteMany({
        where: {
          id: {
            in: recordsToDelete,
          },
        },
      });
    }

    console.log('Duplicate user queues removed successfully.');
  }

  return <>
    <div>
      유저 큐 길이: {queueCount}
      <form action={removeJung}>
        <button type="submit">중복 제거</button>
      </form>
      <br />
    </div>
  </>;
}