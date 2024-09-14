import { pgTableCreator } from "drizzle-orm/pg-core";

/**
 * This uses the multi-table schema feature in Drizzle.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `project-4-v0_${name}`);
