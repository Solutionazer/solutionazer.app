import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1747431268334 implements MigrationInterface {
    name = 'Migrations1747431268334'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "data_collector" DROP CONSTRAINT "FK_95d30f433fe13ab42dcac8dfce6"`);
        await queryRunner.query(`ALTER TABLE "drop_down_config" ALTER COLUMN "options" SET DEFAULT ARRAY[]::text[]`);
        await queryRunner.query(`ALTER TABLE "file_upload_config" ALTER COLUMN "allowFileType" SET DEFAULT ARRAY['application/pdf','image/jpeg']::text[]`);
        await queryRunner.query(`ALTER TABLE "multiple_choice_config" ALTER COLUMN "options" SET DEFAULT ARRAY[]::text[]`);
        await queryRunner.query(`ALTER TABLE "picture_choice_config" ALTER COLUMN "options" SET DEFAULT ARRAY[]::text[]`);
        await queryRunner.query(`ALTER TABLE "scale_config" ALTER COLUMN "labels" SET DEFAULT ARRAY[]::text[]`);
        await queryRunner.query(`ALTER TABLE "data_collector" ADD CONSTRAINT "FK_95d30f433fe13ab42dcac8dfce6" FOREIGN KEY ("statsUuid") REFERENCES "stats"("uuid") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "data_collector" DROP CONSTRAINT "FK_95d30f433fe13ab42dcac8dfce6"`);
        await queryRunner.query(`ALTER TABLE "scale_config" ALTER COLUMN "labels" SET DEFAULT ARRAY[]`);
        await queryRunner.query(`ALTER TABLE "picture_choice_config" ALTER COLUMN "options" SET DEFAULT ARRAY[]`);
        await queryRunner.query(`ALTER TABLE "multiple_choice_config" ALTER COLUMN "options" SET DEFAULT ARRAY[]`);
        await queryRunner.query(`ALTER TABLE "file_upload_config" ALTER COLUMN "allowFileType" SET DEFAULT ARRAY['application/pdf', 'image/jpeg'`);
        await queryRunner.query(`ALTER TABLE "drop_down_config" ALTER COLUMN "options" SET DEFAULT ARRAY[]`);
        await queryRunner.query(`ALTER TABLE "data_collector" ADD CONSTRAINT "FK_95d30f433fe13ab42dcac8dfce6" FOREIGN KEY ("statsUuid") REFERENCES "stats"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
