CREATE TABLE IF NOT EXISTS "users" (
  "userId" VARCHAR(255) UNIQUE PRIMARY KEY,
  "firstName" VARCHAR(255) NOT NULL,
  "lastName" VARCHAR(255) NOT NULL,
  "email" VARCHAR(255) UNIQUE NOT NULL,
  "password" VARCHAR(255) NOT NULL,
  "phone" VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS "organisations" (
  "orgId" VARCHAR(255) UNIQUE,
  "name" VARCHAR(255) NOT NULL,
  "description" VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS "users_organisations" (
  "users_userId" VARCHAR(255),
  "organisations_orgId" VARCHAR(255),
  PRIMARY KEY ("users_userId", "organisations_orgId")
);

ALTER TABLE "users_organisations" ADD FOREIGN KEY ("users_userId") REFERENCES "users" ("userId");

ALTER TABLE "users_organisations" ADD FOREIGN KEY ("organisations_orgId") REFERENCES "organisations" ("orgId");
