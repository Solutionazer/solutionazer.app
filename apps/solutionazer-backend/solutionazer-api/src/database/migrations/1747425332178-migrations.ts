import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1747425332178 implements MigrationInterface {
    name = 'Migrations1747425332178'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "drop_down_config" ALTER COLUMN "options" SET DEFAULT ARRAY[]::text[]`);
        await queryRunner.query(`ALTER TABLE "file_upload_config" ALTER COLUMN "allowFileType" SET DEFAULT ARRAY['application/pdf','image/jpeg']::text[]`);
        await queryRunner.query(`ALTER TABLE "multiple_choice_config" ALTER COLUMN "options" SET DEFAULT ARRAY[]::text[]`);
        await queryRunner.query(`ALTER TABLE "picture_choice_config" ALTER COLUMN "options" SET DEFAULT ARRAY[]::text[]`);
        await queryRunner.query(`ALTER TABLE "scale_config" ALTER COLUMN "labels" SET DEFAULT ARRAY[]::text[]`);
        await queryRunner.query(`ALTER TABLE "stats" ALTER COLUMN "completedResponses" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "stats" ALTER COLUMN "partialResponses" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "stats" ALTER COLUMN "averageTime" SET DEFAULT '00:00:00'`);
        await queryRunner.query(`ALTER TABLE "stats" ALTER COLUMN "completionRate" SET DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stats" ALTER COLUMN "completionRate" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "stats" ALTER COLUMN "averageTime" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "stats" ALTER COLUMN "partialResponses" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "stats" ALTER COLUMN "completedResponses" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "scale_config" ALTER COLUMN "labels" SET DEFAULT ARRAY[]`);
        await queryRunner.query(`ALTER TABLE "picture_choice_config" ALTER COLUMN "options" SET DEFAULT ARRAY[]`);
        await queryRunner.query(`ALTER TABLE "multiple_choice_config" ALTER COLUMN "options" SET DEFAULT ARRAY[]`);
        await queryRunner.query(`ALTER TABLE "file_upload_config" ALTER COLUMN "allowFileType" SET DEFAULT ARRAY['application/pdf', 'image/jpeg'`);
        await queryRunner.query(`ALTER TABLE "drop_down_config" ALTER COLUMN "options" SET DEFAULT ARRAY[]`);
    }

}
