/* eslint-disable prettier/prettier */
import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1744310511435 implements MigrationInterface {
  name = 'Init1744310511435';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "permission" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "description" text NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_972bbdc048bf5d859b99488607e" PRIMARY KEY ("uuid"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "team_user_role" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "teamUuid" uuid, "userUuid" uuid, "roleUuid" uuid, CONSTRAINT "PK_0a17b4fb7968e2b8f26b0a8115c" PRIMARY KEY ("uuid"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "team" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "ownerUuid" uuid, "companyUuid" uuid, CONSTRAINT "PK_f4415f685b68870787990e16122" PRIMARY KEY ("uuid"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "company" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "companyName" character varying(255) NOT NULL, "logInEmail" character varying(255) NOT NULL, "logInPassword" character varying(255) NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_3fa0b2af99d910864a56bb10c9e" PRIMARY KEY ("uuid"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "company_user_role" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "userUuid" uuid, "companyUuid" uuid, "roleUuid" uuid, CONSTRAINT "PK_18dbf46798043fea8bfbe1eac30" PRIMARY KEY ("uuid"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "role" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "description" text NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_16fc336b9576146aa1f03fdc7c5" PRIMARY KEY ("uuid"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "transition" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" character varying(255) NOT NULL, "duration" interval NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_b1df2f68ebbc3d2611e848a711f" PRIMARY KEY ("uuid"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "question" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "text" text NOT NULL, "required" boolean NOT NULL, "order" integer NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "formUuid" uuid, "transitionUuid" uuid, CONSTRAINT "PK_6930ce56f7294538e3751b9f32a" PRIMARY KEY ("uuid"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "stats" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "completedResponses" integer NOT NULL, "partialResponses" integer NOT NULL, "averageTime" interval NOT NULL, "completionRate" double precision NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_b20164d9704953c97b893a275cb" PRIMARY KEY ("uuid"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "data_collector_type_enum" AS ENUM('form', 'survey')`,
    );
    await queryRunner.query(
      `CREATE TABLE "data_collector" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(255) NOT NULL, "description" text NOT NULL, "type" "data_collector_type_enum" NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "userUuid" uuid NOT NULL, "statsUuid" uuid, CONSTRAINT "REL_95d30f433fe13ab42dcac8dfce" UNIQUE ("statsUuid"), CONSTRAINT "PK_a133961a41474e0bd107735f95f" PRIMARY KEY ("uuid"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "fullName" character varying(255) NOT NULL, "email" character varying(255) NOT NULL, "password" character varying(255) NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_a95e949168be7b7ece1a2382fed" PRIMARY KEY ("uuid"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "role_permission_context" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "companyUuid" uuid, "teamUuid" uuid, "roleUuid" uuid NOT NULL, "permissionUuid" uuid NOT NULL, CONSTRAINT "PK_0bfc599c832537552274c9527dc" PRIMARY KEY ("uuid"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "team_members" ("teamUuid" uuid NOT NULL, "userUuid" uuid NOT NULL, CONSTRAINT "PK_076ca6cfa892dc243e89dd4349a" PRIMARY KEY ("teamUuid", "userUuid"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_23b9d1451cf77cc27fef201919" ON "team_members" ("teamUuid") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0302dc0bab41fed2b652f9ceae" ON "team_members" ("userUuid") `,
    );
    await queryRunner.query(
      `CREATE TABLE "company_admins" ("companyUuid" uuid NOT NULL, "userUuid" uuid NOT NULL, CONSTRAINT "PK_41b0092335388d7b3215e60ff46" PRIMARY KEY ("companyUuid", "userUuid"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_443f2793db0f28d41e9b055383" ON "company_admins" ("companyUuid") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1548423a4d609161c72a495344" ON "company_admins" ("userUuid") `,
    );
    await queryRunner.query(
      `CREATE TABLE "role_permissions" ("roleUuid" uuid NOT NULL, "permissionUuid" uuid NOT NULL, CONSTRAINT "PK_1d07d1344ba2ce02127850f70ac" PRIMARY KEY ("roleUuid", "permissionUuid"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_782663bfae6fd79da0faa78d77" ON "role_permissions" ("roleUuid") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_bdf7765c5dcaf04c8c648161da" ON "role_permissions" ("permissionUuid") `,
    );
    await queryRunner.query(
      `CREATE TABLE "user_roles" ("userUuid" uuid NOT NULL, "roleUuid" uuid NOT NULL, CONSTRAINT "PK_e3696413acdd811b3458221a700" PRIMARY KEY ("userUuid", "roleUuid"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_dc7659b2e3cd0061a3c4727850" ON "user_roles" ("userUuid") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9a9d53d1243f348f12a1415b6f" ON "user_roles" ("roleUuid") `,
    );
    await queryRunner.query(
      `CREATE TABLE "user_companies" ("userUuid" uuid NOT NULL, "companyUuid" uuid NOT NULL, CONSTRAINT "PK_5dc1461dd244379e514bcb7f6cc" PRIMARY KEY ("userUuid", "companyUuid"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9d31b1ad38560ef0f7a56d74ac" ON "user_companies" ("userUuid") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_742f12307af9087852cc03efe5" ON "user_companies" ("companyUuid") `,
    );
    await queryRunner.query(
      `CREATE TABLE "user_teams" ("userUuid" uuid NOT NULL, "teamUuid" uuid NOT NULL, CONSTRAINT "PK_6d0339b17d281578ce00d5bc479" PRIMARY KEY ("userUuid", "teamUuid"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7c9f730bba774b3baa5159b2c2" ON "user_teams" ("userUuid") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_86a5791191cfa86ee399306cb1" ON "user_teams" ("teamUuid") `,
    );
    await queryRunner.query(
      `ALTER TABLE "team_user_role" ADD CONSTRAINT "FK_3eb2feda4a3cdf86603eaace194" FOREIGN KEY ("teamUuid") REFERENCES "team"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "team_user_role" ADD CONSTRAINT "FK_65b794711e49b48b5193f7425d2" FOREIGN KEY ("userUuid") REFERENCES "user"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "team_user_role" ADD CONSTRAINT "FK_4fb70a5cac95d4aa547fa33360e" FOREIGN KEY ("roleUuid") REFERENCES "role"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "team" ADD CONSTRAINT "FK_2e74c80d7310bb72db7ddfa149d" FOREIGN KEY ("ownerUuid") REFERENCES "user"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "team" ADD CONSTRAINT "FK_b485fb9618f94a198a22666144c" FOREIGN KEY ("companyUuid") REFERENCES "company"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "company_user_role" ADD CONSTRAINT "FK_e3aa818afdef28a8132d4367cc5" FOREIGN KEY ("userUuid") REFERENCES "user"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "company_user_role" ADD CONSTRAINT "FK_5b1ab0eed0509754bcd918d5a3d" FOREIGN KEY ("companyUuid") REFERENCES "company"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "company_user_role" ADD CONSTRAINT "FK_23b1ff951de5ca134e26e822675" FOREIGN KEY ("roleUuid") REFERENCES "role"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "question" ADD CONSTRAINT "FK_99af17e25ea9c1c9c8de04b3799" FOREIGN KEY ("formUuid") REFERENCES "data_collector"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "question" ADD CONSTRAINT "FK_86b05b02897bc5b9a8f79e2b341" FOREIGN KEY ("transitionUuid") REFERENCES "transition"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_collector" ADD CONSTRAINT "FK_0df64589f1ee9aec160a9faa5c7" FOREIGN KEY ("userUuid") REFERENCES "user"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_collector" ADD CONSTRAINT "FK_95d30f433fe13ab42dcac8dfce6" FOREIGN KEY ("statsUuid") REFERENCES "stats"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_permission_context" ADD CONSTRAINT "FK_9dd899df4dc98177a911155a1e7" FOREIGN KEY ("companyUuid") REFERENCES "company"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_permission_context" ADD CONSTRAINT "FK_c2a19c705b6631aff266043b204" FOREIGN KEY ("teamUuid") REFERENCES "team"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_permission_context" ADD CONSTRAINT "FK_cec6525adc054e11ed1d4742263" FOREIGN KEY ("roleUuid") REFERENCES "role"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_permission_context" ADD CONSTRAINT "FK_eb4edfdba7ad2b43243df1b9819" FOREIGN KEY ("permissionUuid") REFERENCES "permission"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "team_members" ADD CONSTRAINT "FK_23b9d1451cf77cc27fef2019191" FOREIGN KEY ("teamUuid") REFERENCES "team"("uuid") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "team_members" ADD CONSTRAINT "FK_0302dc0bab41fed2b652f9ceae6" FOREIGN KEY ("userUuid") REFERENCES "user"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "company_admins" ADD CONSTRAINT "FK_443f2793db0f28d41e9b055383b" FOREIGN KEY ("companyUuid") REFERENCES "company"("uuid") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "company_admins" ADD CONSTRAINT "FK_1548423a4d609161c72a495344a" FOREIGN KEY ("userUuid") REFERENCES "user"("uuid") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_permissions" ADD CONSTRAINT "FK_782663bfae6fd79da0faa78d771" FOREIGN KEY ("roleUuid") REFERENCES "role"("uuid") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_permissions" ADD CONSTRAINT "FK_bdf7765c5dcaf04c8c648161da4" FOREIGN KEY ("permissionUuid") REFERENCES "permission"("uuid") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles" ADD CONSTRAINT "FK_dc7659b2e3cd0061a3c47278507" FOREIGN KEY ("userUuid") REFERENCES "user"("uuid") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles" ADD CONSTRAINT "FK_9a9d53d1243f348f12a1415b6f6" FOREIGN KEY ("roleUuid") REFERENCES "role"("uuid") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_companies" ADD CONSTRAINT "FK_9d31b1ad38560ef0f7a56d74ac7" FOREIGN KEY ("userUuid") REFERENCES "user"("uuid") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_companies" ADD CONSTRAINT "FK_742f12307af9087852cc03efe51" FOREIGN KEY ("companyUuid") REFERENCES "company"("uuid") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_teams" ADD CONSTRAINT "FK_7c9f730bba774b3baa5159b2c24" FOREIGN KEY ("userUuid") REFERENCES "user"("uuid") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_teams" ADD CONSTRAINT "FK_86a5791191cfa86ee399306cb14" FOREIGN KEY ("teamUuid") REFERENCES "team"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_teams" DROP CONSTRAINT "FK_86a5791191cfa86ee399306cb14"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_teams" DROP CONSTRAINT "FK_7c9f730bba774b3baa5159b2c24"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_companies" DROP CONSTRAINT "FK_742f12307af9087852cc03efe51"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_companies" DROP CONSTRAINT "FK_9d31b1ad38560ef0f7a56d74ac7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles" DROP CONSTRAINT "FK_9a9d53d1243f348f12a1415b6f6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles" DROP CONSTRAINT "FK_dc7659b2e3cd0061a3c47278507"`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_permissions" DROP CONSTRAINT "FK_bdf7765c5dcaf04c8c648161da4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_permissions" DROP CONSTRAINT "FK_782663bfae6fd79da0faa78d771"`,
    );
    await queryRunner.query(
      `ALTER TABLE "company_admins" DROP CONSTRAINT "FK_1548423a4d609161c72a495344a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "company_admins" DROP CONSTRAINT "FK_443f2793db0f28d41e9b055383b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "team_members" DROP CONSTRAINT "FK_0302dc0bab41fed2b652f9ceae6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "team_members" DROP CONSTRAINT "FK_23b9d1451cf77cc27fef2019191"`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_permission_context" DROP CONSTRAINT "FK_eb4edfdba7ad2b43243df1b9819"`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_permission_context" DROP CONSTRAINT "FK_cec6525adc054e11ed1d4742263"`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_permission_context" DROP CONSTRAINT "FK_c2a19c705b6631aff266043b204"`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_permission_context" DROP CONSTRAINT "FK_9dd899df4dc98177a911155a1e7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_collector" DROP CONSTRAINT "FK_95d30f433fe13ab42dcac8dfce6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_collector" DROP CONSTRAINT "FK_0df64589f1ee9aec160a9faa5c7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "question" DROP CONSTRAINT "FK_86b05b02897bc5b9a8f79e2b341"`,
    );
    await queryRunner.query(
      `ALTER TABLE "question" DROP CONSTRAINT "FK_99af17e25ea9c1c9c8de04b3799"`,
    );
    await queryRunner.query(
      `ALTER TABLE "company_user_role" DROP CONSTRAINT "FK_23b1ff951de5ca134e26e822675"`,
    );
    await queryRunner.query(
      `ALTER TABLE "company_user_role" DROP CONSTRAINT "FK_5b1ab0eed0509754bcd918d5a3d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "company_user_role" DROP CONSTRAINT "FK_e3aa818afdef28a8132d4367cc5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "team" DROP CONSTRAINT "FK_b485fb9618f94a198a22666144c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "team" DROP CONSTRAINT "FK_2e74c80d7310bb72db7ddfa149d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "team_user_role" DROP CONSTRAINT "FK_4fb70a5cac95d4aa547fa33360e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "team_user_role" DROP CONSTRAINT "FK_65b794711e49b48b5193f7425d2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "team_user_role" DROP CONSTRAINT "FK_3eb2feda4a3cdf86603eaace194"`,
    );
    await queryRunner.query(`DROP INDEX "IDX_86a5791191cfa86ee399306cb1"`);
    await queryRunner.query(`DROP INDEX "IDX_7c9f730bba774b3baa5159b2c2"`);
    await queryRunner.query(`DROP TABLE "user_teams"`);
    await queryRunner.query(`DROP INDEX "IDX_742f12307af9087852cc03efe5"`);
    await queryRunner.query(`DROP INDEX "IDX_9d31b1ad38560ef0f7a56d74ac"`);
    await queryRunner.query(`DROP TABLE "user_companies"`);
    await queryRunner.query(`DROP INDEX "IDX_9a9d53d1243f348f12a1415b6f"`);
    await queryRunner.query(`DROP INDEX "IDX_dc7659b2e3cd0061a3c4727850"`);
    await queryRunner.query(`DROP TABLE "user_roles"`);
    await queryRunner.query(`DROP INDEX "IDX_bdf7765c5dcaf04c8c648161da"`);
    await queryRunner.query(`DROP INDEX "IDX_782663bfae6fd79da0faa78d77"`);
    await queryRunner.query(`DROP TABLE "role_permissions"`);
    await queryRunner.query(`DROP INDEX "IDX_1548423a4d609161c72a495344"`);
    await queryRunner.query(`DROP INDEX "IDX_443f2793db0f28d41e9b055383"`);
    await queryRunner.query(`DROP TABLE "company_admins"`);
    await queryRunner.query(`DROP INDEX "IDX_0302dc0bab41fed2b652f9ceae"`);
    await queryRunner.query(`DROP INDEX "IDX_23b9d1451cf77cc27fef201919"`);
    await queryRunner.query(`DROP TABLE "team_members"`);
    await queryRunner.query(`DROP TABLE "role_permission_context"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "data_collector"`);
    await queryRunner.query(`DROP TYPE "data_collector_type_enum"`);
    await queryRunner.query(`DROP TABLE "stats"`);
    await queryRunner.query(`DROP TABLE "question"`);
    await queryRunner.query(`DROP TABLE "transition"`);
    await queryRunner.query(`DROP TABLE "role"`);
    await queryRunner.query(`DROP TABLE "company_user_role"`);
    await queryRunner.query(`DROP TABLE "company"`);
    await queryRunner.query(`DROP TABLE "team"`);
    await queryRunner.query(`DROP TABLE "team_user_role"`);
    await queryRunner.query(`DROP TABLE "permission"`);
  }
}
