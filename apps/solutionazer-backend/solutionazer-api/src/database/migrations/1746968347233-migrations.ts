import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1746968347233 implements MigrationInterface {
    name = 'Migrations1746968347233'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "question" DROP CONSTRAINT "FK_3fea24d27c74ee8da72dbf0a21b"`);
        await queryRunner.query(`ALTER TABLE "question" DROP CONSTRAINT "FK_5c57d0c95a77692284b42e0bcb8"`);
        await queryRunner.query(`ALTER TABLE "question" DROP CONSTRAINT "FK_802322c45311045777a2298b7b4"`);
        await queryRunner.query(`ALTER TABLE "question" DROP CONSTRAINT "FK_318c27f311a36dc9ca9b7660eac"`);
        await queryRunner.query(`ALTER TABLE "question" DROP CONSTRAINT "FK_8933d77c93518332e51654abee0"`);
        await queryRunner.query(`ALTER TABLE "question" DROP CONSTRAINT "FK_53c7207f189320f6a8efcded465"`);
        await queryRunner.query(`ALTER TABLE "question" DROP CONSTRAINT "FK_efa94a395cb775c18db425dd93a"`);
        await queryRunner.query(`ALTER TABLE "question" DROP CONSTRAINT "FK_f71a38fbd53095f794f8fc4b42c"`);
        await queryRunner.query(`ALTER TABLE "question" DROP CONSTRAINT "FK_f3e4e6c0ace5886bf99b7f10712"`);
        await queryRunner.query(`ALTER TABLE "question" DROP CONSTRAINT "FK_43e0c668073a1915e179eba36a8"`);
        await queryRunner.query(`ALTER TABLE "question" DROP CONSTRAINT "FK_dabdaa39b05c6bf637c5ec19603"`);
        await queryRunner.query(`ALTER TABLE "question" DROP CONSTRAINT "FK_0e6ce2c39549bef40a2d38abe59"`);
        await queryRunner.query(`ALTER TABLE "question" DROP CONSTRAINT "FK_46c26ef6544d4efb41aed3e3fcb"`);
        await queryRunner.query(`ALTER TABLE "question" DROP CONSTRAINT "FK_738737a9b05d964241e5845e2da"`);
        await queryRunner.query(`ALTER TABLE "question" DROP CONSTRAINT "FK_dec519315392770143b07736f96"`);
        await queryRunner.query(`ALTER TABLE "question" DROP CONSTRAINT "FK_88b2acad4c90cbc7fe890f2f7e3"`);
        await queryRunner.query(`ALTER TABLE "question" DROP CONSTRAINT "FK_a4303c14b59639fcf0dea97a7ec"`);
        await queryRunner.query(`ALTER TABLE "drop_down_config" ALTER COLUMN "options" SET DEFAULT ARRAY[]::text[]`);
        await queryRunner.query(`ALTER TABLE "file_upload_config" ALTER COLUMN "allowFileType" SET DEFAULT ARRAY['application/pdf','image/jpeg']::text[]`);
        await queryRunner.query(`ALTER TABLE "multiple_choice_config" ALTER COLUMN "options" SET DEFAULT ARRAY[]::text[]`);
        await queryRunner.query(`ALTER TABLE "scale_config" ALTER COLUMN "labels" SET DEFAULT ARRAY[]::text[]`);
        await queryRunner.query(`ALTER TABLE "question" ADD CONSTRAINT "FK_3fea24d27c74ee8da72dbf0a21b" FOREIGN KEY ("dateConfigUuid") REFERENCES "date_config"("uuid") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "question" ADD CONSTRAINT "FK_5c57d0c95a77692284b42e0bcb8" FOREIGN KEY ("dropDownConfigUuid") REFERENCES "drop_down_config"("uuid") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "question" ADD CONSTRAINT "FK_802322c45311045777a2298b7b4" FOREIGN KEY ("emailConfigUuid") REFERENCES "email_config"("uuid") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "question" ADD CONSTRAINT "FK_318c27f311a36dc9ca9b7660eac" FOREIGN KEY ("fileUploadConfigUuid") REFERENCES "file_upload_config"("uuid") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "question" ADD CONSTRAINT "FK_8933d77c93518332e51654abee0" FOREIGN KEY ("greetingsScreenConfigUuid") REFERENCES "greetings_screen_config"("uuid") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "question" ADD CONSTRAINT "FK_53c7207f189320f6a8efcded465" FOREIGN KEY ("legalConfigUuid") REFERENCES "legal_config"("uuid") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "question" ADD CONSTRAINT "FK_efa94a395cb775c18db425dd93a" FOREIGN KEY ("longTextConfigUuid") REFERENCES "long_text_config"("uuid") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "question" ADD CONSTRAINT "FK_f71a38fbd53095f794f8fc4b42c" FOREIGN KEY ("multipleChoiceConfigUuid") REFERENCES "multiple_choice_config"("uuid") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "question" ADD CONSTRAINT "FK_f3e4e6c0ace5886bf99b7f10712" FOREIGN KEY ("phoneNumberConfigUuid") REFERENCES "phone_number_config"("uuid") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "question" ADD CONSTRAINT "FK_43e0c668073a1915e179eba36a8" FOREIGN KEY ("pictureChoiceConfigUuid") REFERENCES "picture_choice_config"("uuid") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "question" ADD CONSTRAINT "FK_dabdaa39b05c6bf637c5ec19603" FOREIGN KEY ("ratingConfigUuid") REFERENCES "rating_config"("uuid") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "question" ADD CONSTRAINT "FK_0e6ce2c39549bef40a2d38abe59" FOREIGN KEY ("scaleConfigUuid") REFERENCES "scale_config"("uuid") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "question" ADD CONSTRAINT "FK_46c26ef6544d4efb41aed3e3fcb" FOREIGN KEY ("shortTextConfigUuid") REFERENCES "short_text_config"("uuid") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "question" ADD CONSTRAINT "FK_738737a9b05d964241e5845e2da" FOREIGN KEY ("statementConfigUuid") REFERENCES "statement_config"("uuid") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "question" ADD CONSTRAINT "FK_dec519315392770143b07736f96" FOREIGN KEY ("websiteConfigUuid") REFERENCES "website_config"("uuid") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "question" ADD CONSTRAINT "FK_88b2acad4c90cbc7fe890f2f7e3" FOREIGN KEY ("welcomeScreenConfigUuid") REFERENCES "welcome_screen_config"("uuid") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "question" ADD CONSTRAINT "FK_a4303c14b59639fcf0dea97a7ec" FOREIGN KEY ("yesNoConfigUuid") REFERENCES "yes_no_config"("uuid") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "question" DROP CONSTRAINT "FK_a4303c14b59639fcf0dea97a7ec"`);
        await queryRunner.query(`ALTER TABLE "question" DROP CONSTRAINT "FK_88b2acad4c90cbc7fe890f2f7e3"`);
        await queryRunner.query(`ALTER TABLE "question" DROP CONSTRAINT "FK_dec519315392770143b07736f96"`);
        await queryRunner.query(`ALTER TABLE "question" DROP CONSTRAINT "FK_738737a9b05d964241e5845e2da"`);
        await queryRunner.query(`ALTER TABLE "question" DROP CONSTRAINT "FK_46c26ef6544d4efb41aed3e3fcb"`);
        await queryRunner.query(`ALTER TABLE "question" DROP CONSTRAINT "FK_0e6ce2c39549bef40a2d38abe59"`);
        await queryRunner.query(`ALTER TABLE "question" DROP CONSTRAINT "FK_dabdaa39b05c6bf637c5ec19603"`);
        await queryRunner.query(`ALTER TABLE "question" DROP CONSTRAINT "FK_43e0c668073a1915e179eba36a8"`);
        await queryRunner.query(`ALTER TABLE "question" DROP CONSTRAINT "FK_f3e4e6c0ace5886bf99b7f10712"`);
        await queryRunner.query(`ALTER TABLE "question" DROP CONSTRAINT "FK_f71a38fbd53095f794f8fc4b42c"`);
        await queryRunner.query(`ALTER TABLE "question" DROP CONSTRAINT "FK_efa94a395cb775c18db425dd93a"`);
        await queryRunner.query(`ALTER TABLE "question" DROP CONSTRAINT "FK_53c7207f189320f6a8efcded465"`);
        await queryRunner.query(`ALTER TABLE "question" DROP CONSTRAINT "FK_8933d77c93518332e51654abee0"`);
        await queryRunner.query(`ALTER TABLE "question" DROP CONSTRAINT "FK_318c27f311a36dc9ca9b7660eac"`);
        await queryRunner.query(`ALTER TABLE "question" DROP CONSTRAINT "FK_802322c45311045777a2298b7b4"`);
        await queryRunner.query(`ALTER TABLE "question" DROP CONSTRAINT "FK_5c57d0c95a77692284b42e0bcb8"`);
        await queryRunner.query(`ALTER TABLE "question" DROP CONSTRAINT "FK_3fea24d27c74ee8da72dbf0a21b"`);
        await queryRunner.query(`ALTER TABLE "scale_config" ALTER COLUMN "labels" SET DEFAULT ARRAY[]`);
        await queryRunner.query(`ALTER TABLE "multiple_choice_config" ALTER COLUMN "options" SET DEFAULT ARRAY[]`);
        await queryRunner.query(`ALTER TABLE "file_upload_config" ALTER COLUMN "allowFileType" SET DEFAULT ARRAY['application/pdf', 'image/jpeg'`);
        await queryRunner.query(`ALTER TABLE "drop_down_config" ALTER COLUMN "options" SET DEFAULT ARRAY[]`);
        await queryRunner.query(`ALTER TABLE "question" ADD CONSTRAINT "FK_a4303c14b59639fcf0dea97a7ec" FOREIGN KEY ("yesNoConfigUuid") REFERENCES "yes_no_config"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "question" ADD CONSTRAINT "FK_88b2acad4c90cbc7fe890f2f7e3" FOREIGN KEY ("welcomeScreenConfigUuid") REFERENCES "welcome_screen_config"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "question" ADD CONSTRAINT "FK_dec519315392770143b07736f96" FOREIGN KEY ("websiteConfigUuid") REFERENCES "website_config"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "question" ADD CONSTRAINT "FK_738737a9b05d964241e5845e2da" FOREIGN KEY ("statementConfigUuid") REFERENCES "statement_config"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "question" ADD CONSTRAINT "FK_46c26ef6544d4efb41aed3e3fcb" FOREIGN KEY ("shortTextConfigUuid") REFERENCES "short_text_config"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "question" ADD CONSTRAINT "FK_0e6ce2c39549bef40a2d38abe59" FOREIGN KEY ("scaleConfigUuid") REFERENCES "scale_config"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "question" ADD CONSTRAINT "FK_dabdaa39b05c6bf637c5ec19603" FOREIGN KEY ("ratingConfigUuid") REFERENCES "rating_config"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "question" ADD CONSTRAINT "FK_43e0c668073a1915e179eba36a8" FOREIGN KEY ("pictureChoiceConfigUuid") REFERENCES "picture_choice_config"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "question" ADD CONSTRAINT "FK_f3e4e6c0ace5886bf99b7f10712" FOREIGN KEY ("phoneNumberConfigUuid") REFERENCES "phone_number_config"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "question" ADD CONSTRAINT "FK_f71a38fbd53095f794f8fc4b42c" FOREIGN KEY ("multipleChoiceConfigUuid") REFERENCES "multiple_choice_config"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "question" ADD CONSTRAINT "FK_efa94a395cb775c18db425dd93a" FOREIGN KEY ("longTextConfigUuid") REFERENCES "long_text_config"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "question" ADD CONSTRAINT "FK_53c7207f189320f6a8efcded465" FOREIGN KEY ("legalConfigUuid") REFERENCES "legal_config"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "question" ADD CONSTRAINT "FK_8933d77c93518332e51654abee0" FOREIGN KEY ("greetingsScreenConfigUuid") REFERENCES "greetings_screen_config"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "question" ADD CONSTRAINT "FK_318c27f311a36dc9ca9b7660eac" FOREIGN KEY ("fileUploadConfigUuid") REFERENCES "file_upload_config"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "question" ADD CONSTRAINT "FK_802322c45311045777a2298b7b4" FOREIGN KEY ("emailConfigUuid") REFERENCES "email_config"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "question" ADD CONSTRAINT "FK_5c57d0c95a77692284b42e0bcb8" FOREIGN KEY ("dropDownConfigUuid") REFERENCES "drop_down_config"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "question" ADD CONSTRAINT "FK_3fea24d27c74ee8da72dbf0a21b" FOREIGN KEY ("dateConfigUuid") REFERENCES "date_config"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
