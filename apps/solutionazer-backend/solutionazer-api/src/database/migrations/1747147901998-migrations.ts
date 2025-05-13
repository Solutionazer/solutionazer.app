import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1747147901998 implements MigrationInterface {
    name = 'Migrations1747147901998'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "question_response" DROP CONSTRAINT "FK_7d24bd2d14ce59affb59092a834"`);
        await queryRunner.query(`ALTER TABLE "drop_down_config" ALTER COLUMN "options" SET DEFAULT ARRAY[]::text[]`);
        await queryRunner.query(`ALTER TABLE "file_upload_config" ALTER COLUMN "allowFileType" SET DEFAULT ARRAY['application/pdf','image/jpeg']::text[]`);
        await queryRunner.query(`ALTER TABLE "multiple_choice_config" ALTER COLUMN "options" SET DEFAULT ARRAY[]::text[]`);
        await queryRunner.query(`ALTER TABLE "scale_config" ALTER COLUMN "labels" SET DEFAULT ARRAY[]::text[]`);
        await queryRunner.query(`ALTER TABLE "question_response" ADD CONSTRAINT "FK_7d24bd2d14ce59affb59092a834" FOREIGN KEY ("questionUuid") REFERENCES "question"("uuid") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "question_response" DROP CONSTRAINT "FK_7d24bd2d14ce59affb59092a834"`);
        await queryRunner.query(`ALTER TABLE "scale_config" ALTER COLUMN "labels" SET DEFAULT ARRAY[]`);
        await queryRunner.query(`ALTER TABLE "multiple_choice_config" ALTER COLUMN "options" SET DEFAULT ARRAY[]`);
        await queryRunner.query(`ALTER TABLE "file_upload_config" ALTER COLUMN "allowFileType" SET DEFAULT ARRAY['application/pdf', 'image/jpeg'`);
        await queryRunner.query(`ALTER TABLE "drop_down_config" ALTER COLUMN "options" SET DEFAULT ARRAY[]`);
        await queryRunner.query(`ALTER TABLE "question_response" ADD CONSTRAINT "FK_7d24bd2d14ce59affb59092a834" FOREIGN KEY ("questionUuid") REFERENCES "question"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
