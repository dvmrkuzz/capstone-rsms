import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddBookings1794000000000 implements MigrationInterface {
  name = 'AddBookings1794000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE "bookings_status_enum" AS ENUM ('booked', 'completed', 'cancelled', 'no_show')
    `);
    await queryRunner.query(`
      CREATE TABLE "bookings" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "full_name" character varying NOT NULL,
        "email" character varying,
        "contact_number" character varying,
        "purpose" text NOT NULL,
        "appointment_date" date NOT NULL,
        "time_slot" character varying NOT NULL,
        "status" "bookings_status_enum" NOT NULL DEFAULT 'booked',
        "user_id" uuid,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_bookings" PRIMARY KEY ("id"),
        CONSTRAINT "FK_bookings_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "bookings"`);
    await queryRunner.query(`DROP TYPE "bookings_status_enum"`);
  }
}