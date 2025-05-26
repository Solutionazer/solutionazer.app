import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1748243163022 implements MigrationInterface {
    name = 'Migrations1748243163022'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "data_collector" ADD "clonedFromUuid" uuid`);
        await queryRunner.query(`ALTER TABLE "drop_down_config" ALTER COLUMN "options" SET DEFAULT ARRAY[]::text[]`);
        await queryRunner.query(`ALTER TABLE "file_upload_config" ALTER COLUMN "allowFileType" SET DEFAULT ARRAY['application/pdf','image/jpeg']::text[]`);
        await queryRunner.query(`ALTER TABLE "multiple_choice_config" ALTER COLUMN "options" SET DEFAULT ARRAY[]::text[]`);
        await queryRunner.query(`ALTER TABLE "picture_choice_config" ALTER COLUMN "options" SET DEFAULT ARRAY[]::text[]`);
        await queryRunner.query(`ALTER TABLE "scale_config" ALTER COLUMN "labels" SET DEFAULT ARRAY[]::text[]`);
        await queryRunner.query(`ALTER TABLE "data_collector" ADD CONSTRAINT "FK_d8acab1722fadf586845a2ddb82" FOREIGN KEY ("clonedFromUuid") REFERENCES "data_collector"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "data_collector" DROP CONSTRAINT "FK_d8acab1722fadf586845a2ddb82"`);
        await queryRunner.query(`ALTER TABLE "scale_config" ALTER COLUMN "labels" SET DEFAULT ARRAY[]`);
        await queryRunner.query(`ALTER TABLE "picture_choice_config" ALTER COLUMN "options" SET DEFAULT ARRAY[]`);
        await queryRunner.query(`ALTER TABLE "multiple_choice_config" ALTER COLUMN "options" SET DEFAULT ARRAY[]`);
        await queryRunner.query(`ALTER TABLE "file_upload_config" ALTER COLUMN "allowFileType" SET DEFAULT ARRAY['application/pdf', 'image/jpeg'`);
        await queryRunner.query(`ALTER TABLE "drop_down_config" ALTER COLUMN "options" SET DEFAULT ARRAY[]`);
        await queryRunner.query(`ALTER TABLE "data_collector" DROP COLUMN "clonedFromUuid"`);
    }

}
