import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.table('ride_track_app_user', table => {
        table.string('unit', 20).defaultTo('metric');
    });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.table('ride_track_app_user', table => {
        table.dropColumn('unit');
    });
}

