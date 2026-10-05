import "../paths";
import { db, closeDatabaseConnection } from "@config/database.config";
import { DatabaseExecutorType } from "@@types/database.type";
import userSeeder from "@database/seeders/user.seeder";

type SeederType = {
  name: string;
  run: (executor: DatabaseExecutorType) => Promise<void>;
};

// Urutan penting: seeder tabel master/parent harus dijalankan lebih dulu.
const seeders: SeederType[] = [userSeeder];

const run = async (): Promise<void> => {
  await db.transaction(async (tx) => {
    for (const seeder of seeders) {
      console.log(`[seed] ${seeder.name}`);
      await seeder.run(tx);
    }
  });
  console.log("[seed] done");
};

run()
  .catch((error) => {
    console.error("[seed] failed", error);
    process.exitCode = 1;
  })
  .finally(closeDatabaseConnection);
