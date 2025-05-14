import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1746957400207 implements MigrationInterface {
    name = 'Migrations1746957400207'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "drop_down_config" ALTER COLUMN "options" SET DEFAULT ARRAY[]::text[]`);
        await queryRunner.query(`ALTER TABLE "file_upload_config" ALTER COLUMN "allowFileType" SET DEFAULT ARRAY['application/pdf','image/jpeg']::text[]`);
        await queryRunner.query(`ALTER TABLE "multiple_choice_config" ALTER COLUMN "options" SET DEFAULT ARRAY[]::text[]`);
        await queryRunner.query(`ALTER TABLE "scale_config" ALTER COLUMN "labels" SET DEFAULT ARRAY[]::text[]`);
        await queryRunner.query(`ALTER TABLE "question" ALTER COLUMN "text" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "question" ALTER COLUMN "text" SET DEFAULT 'What...?'`);
        await queryRunner.query(`ALTER TABLE "question" ALTER COLUMN "required" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "question" ALTER COLUMN "required" SET DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "question" ALTER COLUMN "required" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "question" ALTER COLUMN "required" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "question" ALTER COLUMN "text" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "question" ALTER COLUMN "text" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "scale_config" ALTER COLUMN "labels" SET DEFAULT ARRAY[]`);
        await queryRunner.query(`ALTER TABLE "multiple_choice_config" ALTER COLUMN "options" SET DEFAULT ARRAY[]`);
        await queryRunner.query(`ALTER TABLE "file_upload_config" ALTER COLUMN "allowFileType" SET DEFAULT ARRAY['application/pdf', 'image/jpeg'`);
        await queryRunner.query(`ALTER TABLE "drop_down_config" ALTER COLUMN "options" SET DEFAULT ARRAY[]`);
    }

}
