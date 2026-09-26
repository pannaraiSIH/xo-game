ALTER TABLE "game_results" ALTER COLUMN "result" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "game_result";--> statement-breakpoint
CREATE TYPE "game_result" AS ENUM('draw', 'lose', 'win');--> statement-breakpoint
ALTER TABLE "game_results" ALTER COLUMN "result" SET DATA TYPE "game_result" USING "result"::"game_result";