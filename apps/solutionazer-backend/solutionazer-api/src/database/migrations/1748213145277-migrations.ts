import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1748213145277 implements MigrationInterface {
    name = 'Migrations1748213145277'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "reset_password_token" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "token" character varying NOT NULL, "userUuid" uuid NOT NULL, "expiresAt" TIMESTAMP NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_46a5fb999846e73d74d08fff789" PRIMARY KEY ("uuid"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_609174ec22ebfd1b8dd71f867a" ON "reset_password_token" ("token") `);
        await queryRunner.query(`ALTER TABLE "drop_down_config" ALTER COLUMN "options" SET DEFAULT ARRAY[]::text[]`);
        await queryRunner.query(`ALTER TABLE "file_upload_config" ALTER COLUMN "allowFileType" SET DEFAULT ARRAY['application/pdf','image/jpeg']::text[]`);
        await queryRunner.query(`ALTER TABLE "multiple_choice_config" ALTER COLUMN "options" SET DEFAULT ARRAY[]::text[]`);
        await queryRunner.query(`ALTER TABLE "picture_choice_config" ALTER COLUMN "options" SET DEFAULT ARRAY[]::text[]`);
        await queryRunner.query(`ALTER TABLE "scale_config" ALTER COLUMN "labels" SET DEFAULT ARRAY[]::text[]`);
        await queryRunner.query(`ALTER TABLE "reset_password_token" ADD CONSTRAINT "FK_19738bec12a1f8046aba4185377" FOREIGN KEY ("userUuid") REFERENCES "user"("uuid") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reset_password_token" DROP CONSTRAINT "FK_19738bec12a1f8046aba4185377"`);
        await queryRunner.query(`ALTER TABLE "scale_config" ALTER COLUMN "labels" SET DEFAULT ARRAY[]`);
        await queryRunner.query(`ALTER TABLE "picture_choice_config" ALTER COLUMN "options" SET DEFAULT ARRAY[]`);
        await queryRunner.query(`ALTER TABLE "multiple_choice_config" ALTER COLUMN "options" SET DEFAULT ARRAY[]`);
        await queryRunner.query(`ALTER TABLE "file_upload_config" ALTER COLUMN "allowFileType" SET DEFAULT ARRAY['application/pdf', 'image/jpeg'`);
        await queryRunner.query(`ALTER TABLE "drop_down_config" ALTER COLUMN "options" SET DEFAULT ARRAY[]`);
        await queryRunner.query(`DROP INDEX "public"."IDX_609174ec22ebfd1b8dd71f867a"`);
        await queryRunner.query(`DROP TABLE "reset_password_token"`);
    }

}
