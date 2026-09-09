import { sqliteTable, text, integer, primaryKey, index } from 'drizzle-orm/sqlite-core';
export const profiles = sqliteTable('one_profiles', {
 userId: text('user_id').primaryKey(), displayName: text('display_name').notNull(), team: text('team').notNull().default(''), createdAt: integer('created_at').notNull()
});
export const checkpoints = sqliteTable('one_checkpoints', {
 userId: text('user_id').notNull(), checkpoint: text('checkpoint').notNull(), detail: text('detail').notNull().default(''), createdAt: integer('created_at').notNull()
}, t=>[primaryKey({columns:[t.userId,t.checkpoint]})]);
export const runs = sqliteTable('one_runs', {
 id:text('id').primaryKey(), userId:text('user_id').notNull(), gameId:text('game_id').notNull(), level:integer('level').notNull(), seed:integer('seed').notNull(), createdAt:integer('created_at').notNull(), finishedAt:integer('finished_at'), passed:integer('passed').notNull().default(0), summary:text('summary').notNull().default(''), proof:text('proof').notNull().default('')
},t=>[index('one_runs_user_game_level').on(t.userId,t.gameId,t.level),index('one_runs_user_created').on(t.userId,t.createdAt)]);
