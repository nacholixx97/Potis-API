exports.up = knex => {
    return knex.schema
        .createTable('user', table => {
            table.increments('user_id').unsigned().primary();
            table.text('username').unique().notNullable();
            table.text('password').notNullable();
            table.text('name');
            table.text('lastname');
            table.boolean('active').defaultTo(true).notNullable();
            table.timestamp('created_at').defaultTo(knex.fn.now());
            table.timestamp('updated_at').defaultTo(knex.fn.now());
        })
};

exports.down = knex => {
    return knex.schema
        .dropTableIfExists('users');
};
