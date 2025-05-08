import { getDb } from "~/lib/db";

const db = getDb();
const person = await db.table("people-new").get("603305586849391");
console.log(person)
