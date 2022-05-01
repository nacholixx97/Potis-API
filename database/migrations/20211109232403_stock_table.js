exports.up = knex => {
    return knex.schema
        .createTable('stock', table => {
            table.increments('stock_id').unsigned().primary();
            table.enum('action', ['in', 'out']).notNullable();
            table.integer('amount').notNullable();
            table.integer('product_id').notNullable().index().references('product_id').inTable('product').onDelete('cascade');
            table.timestamp('created_at').defaultTo(knex.fn.now());
        })
};

exports.down = knex => {
    return knex.schema
        .dropTableIfExists('stock');
};
