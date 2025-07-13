import { getDb } from "~/lib/db";

async function main() {
    const db = getDb()

    const ID = ""


    const checkin = await db.table("ml-checkins-new").getLast(ID)
    if (!checkin) return;

    checkin.endTime = new Date()
    checkin.rating = "3"
    await db.table("ml-checkins-new").updateLast(ID, checkin)
}

await main()