const { sql } = require("@vercel/postgres");
const fs = require("fs").promises;
const path = require("path");

async function runMigrations() {
  const migrationsDir = path.join(__dirname, "..", "migrations");
  const files = await fs.readdir(migrationsDir);

  for (const file of files) {
    if (file.endsWith(".sql")) {
      const filePath = path.join(migrationsDir, file);
      const sqlContent = await fs.readFile(filePath, "utf-8");
      console.log(`Running migration: ${file}`);
      await sql.query(sqlContent);
    }
  }
}

runMigrations().catch(console.error);
