/*
  Warnings:

  - The values [STUDENT,COUNSELLOR] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `counsellorId` on the `Assignment` table. All the data in the column will be lost.
  - You are about to drop the column `studentId` on the `Assignment` table. All the data in the column will be lost.
  - You are about to drop the column `counsellorId` on the `Availability` table. All the data in the column will be lost.
  - You are about to drop the column `counsellorId` on the `Conversation` table. All the data in the column will be lost.
  - You are about to drop the column `studentId` on the `Conversation` table. All the data in the column will be lost.
  - You are about to drop the column `counsellorId` on the `Meeting` table. All the data in the column will be lost.
  - You are about to drop the column `studentId` on the `Meeting` table. All the data in the column will be lost.
  - You are about to drop the column `studentId` on the `Prediction` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[patientId]` on the table `Assignment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[patientId,doctorId]` on the table `Conversation` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `doctorId` to the `Assignment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `patientId` to the `Assignment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `doctorId` to the `Availability` table without a default value. This is not possible if the table is not empty.
  - Added the required column `doctorId` to the `Conversation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `patientId` to the `Conversation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `doctorId` to the `Meeting` table without a default value. This is not possible if the table is not empty.
  - Added the required column `patientId` to the `Meeting` table without a default value. This is not possible if the table is not empty.
  - Added the required column `patientId` to the `Prediction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('PATIENT', 'DOCTOR', 'ADMIN');
ALTER TABLE "public"."User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "public"."Role_old";
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'PATIENT';
COMMIT;

-- DropForeignKey
ALTER TABLE "Assignment" DROP CONSTRAINT "Assignment_counsellorId_fkey";

-- DropForeignKey
ALTER TABLE "Assignment" DROP CONSTRAINT "Assignment_studentId_fkey";

-- DropForeignKey
ALTER TABLE "Availability" DROP CONSTRAINT "Availability_counsellorId_fkey";

-- DropForeignKey
ALTER TABLE "Conversation" DROP CONSTRAINT "Conversation_counsellorId_fkey";

-- DropForeignKey
ALTER TABLE "Conversation" DROP CONSTRAINT "Conversation_studentId_fkey";

-- DropForeignKey
ALTER TABLE "Meeting" DROP CONSTRAINT "Meeting_counsellorId_fkey";

-- DropForeignKey
ALTER TABLE "Meeting" DROP CONSTRAINT "Meeting_studentId_fkey";

-- DropIndex
DROP INDEX "idx_assignment_counsellor";

-- DropIndex
DROP INDEX "uniq_assignment_student";

-- DropIndex
DROP INDEX "idx_avail_counsellor_start";

-- DropIndex
DROP INDEX "idx_convo_counsellor";

-- DropIndex
DROP INDEX "uniq_convo_student_counsellor";

-- DropIndex
DROP INDEX "idx_meeting_counsellor_start";

-- DropIndex
DROP INDEX "idx_meeting_student_start";

-- DropIndex
DROP INDEX "Prediction_studentId_idx";

-- AlterTable
ALTER TABLE "Assignment" DROP COLUMN "counsellorId",
DROP COLUMN "studentId",
ADD COLUMN     "doctorId" TEXT NOT NULL,
ADD COLUMN     "patientId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Availability" DROP COLUMN "counsellorId",
ADD COLUMN     "doctorId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Conversation" DROP COLUMN "counsellorId",
DROP COLUMN "studentId",
ADD COLUMN     "doctorId" TEXT NOT NULL,
ADD COLUMN     "patientId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Meeting" DROP COLUMN "counsellorId",
DROP COLUMN "studentId",
ADD COLUMN     "doctorId" TEXT NOT NULL,
ADD COLUMN     "patientId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Prediction" DROP COLUMN "studentId",
ADD COLUMN     "patientId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "address" TEXT,
ADD COLUMN     "height" INTEGER,
ADD COLUMN     "specialCondition" TEXT,
ADD COLUMN     "weight" INTEGER,
ALTER COLUMN "rollNo" DROP NOT NULL,
ALTER COLUMN "role" SET DEFAULT 'PATIENT';

-- CreateIndex
CREATE UNIQUE INDEX "uniq_assignment_patient" ON "Assignment"("patientId");

-- CreateIndex
CREATE INDEX "idx_assignment_doctor" ON "Assignment"("doctorId");

-- CreateIndex
CREATE INDEX "idx_avail_doctor_start" ON "Availability"("doctorId", "startTime");

-- CreateIndex
CREATE INDEX "idx_convo_doctor" ON "Conversation"("doctorId");

-- CreateIndex
CREATE UNIQUE INDEX "uniq_convo_patient_doctor" ON "Conversation"("patientId", "doctorId");

-- CreateIndex
CREATE INDEX "idx_meeting_doctor_start" ON "Meeting"("doctorId", "startTime");

-- CreateIndex
CREATE INDEX "idx_meeting_patient_start" ON "Meeting"("patientId", "startTime");

-- CreateIndex
CREATE INDEX "Prediction_patientId_idx" ON "Prediction"("patientId");

-- AddForeignKey
ALTER TABLE "Availability" ADD CONSTRAINT "Availability_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Meeting" ADD CONSTRAINT "Meeting_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Meeting" ADD CONSTRAINT "Meeting_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
