import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Replaces the two-state is_served boolean on visitor_logs with a
 * three-state queue_status, so that a visitor who was called but was
 * not present can be recorded as skipped rather than as served.
 *
 * Existing rows are preserved: is_served = true becomes 'served' and
 * is_served = false becomes 'waiting'.
 */
export class AddQueueStatus1796000000000 implements MigrationInterface {
  name = 'AddQueueStatus1796000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE "visitor_logs_queue_status_enum"
          AS ENUM ('waiting', 'skipped', 'served');
      EXCEPTION WHEN duplicate_object THEN NULL;
      END $$;
    `);

    await queryRunner.query(`
      ALTER TABLE "visitor_logs"
        ADD COLUMN IF NOT EXISTS "queue_status"
        "visitor_logs_queue_status_enum" NOT NULL DEFAULT 'waiting'
    `);

    await queryRunner.query(`
      ALTER TABLE "visitor_logs"
        ADD COLUMN IF NOT EXISTS "recall_count" smallint NOT NULL DEFAULT 0
    `);

    // carry the existing two states across
    await queryRunner.query(`
      UPDATE "visitor_logs"
         SET "queue_status" = 'served'
       WHERE "is_served" = true
    `);

    await queryRunner.query(`
      ALTER TABLE "visitor_logs" DROP COLUMN IF EXISTS "is_served"
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_visitor_logs_queue_status"
        ON "visitor_logs" ("queue_status")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "visitor_logs"
        ADD COLUMN IF NOT EXISTS "is_served" boolean NOT NULL DEFAULT false
    `);

    await queryRunner.query(`
      UPDATE "visitor_logs"
         SET "is_served" = true
       WHERE "queue_status" = 'served'
    `);

    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_visitor_logs_queue_status"`);
    await queryRunner.query(`ALTER TABLE "visitor_logs" DROP COLUMN IF EXISTS "recall_count"`);
    await queryRunner.query(`ALTER TABLE "visitor_logs" DROP COLUMN IF EXISTS "queue_status"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "visitor_logs_queue_status_enum"`);
  }
}
