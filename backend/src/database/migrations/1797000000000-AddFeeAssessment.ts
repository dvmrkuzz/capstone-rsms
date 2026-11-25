import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Adds the columns needed to assess the fees payable for a document request.
 *
 * Fee values themselves are not written here. The fee schedule is institutional
 * data maintained by the Registrar's Office and is entered through the
 * dashboard or the accompanying fee-schedule script, so that a change to a fee
 * does not require a change to the application.
 */
export class AddFeeAssessment1797000000000 implements MigrationInterface {
  name = 'AddFeeAssessment1797000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "document_types"
        ADD COLUMN IF NOT EXISTS "pages_based" boolean NOT NULL DEFAULT false,
        ADD COLUMN IF NOT EXISTS "express_fee" numeric(10,2),
        ADD COLUMN IF NOT EXISTS "documentary_stamps" smallint NOT NULL DEFAULT 0
    `);

    await queryRunner.query(`
      ALTER TABLE "service_requests"
        ADD COLUMN IF NOT EXISTS "pages" smallint,
        ADD COLUMN IF NOT EXISTS "is_express" boolean NOT NULL DEFAULT false,
        ADD COLUMN IF NOT EXISTS "assessed_fee" numeric(10,2)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "service_requests"
        DROP COLUMN IF EXISTS "assessed_fee",
        DROP COLUMN IF EXISTS "is_express",
        DROP COLUMN IF EXISTS "pages"
    `);

    await queryRunner.query(`
      ALTER TABLE "document_types"
        DROP COLUMN IF EXISTS "documentary_stamps",
        DROP COLUMN IF EXISTS "express_fee",
        DROP COLUMN IF EXISTS "pages_based"
    `);
  }
}
