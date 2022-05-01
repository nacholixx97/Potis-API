exports.up = knex => {
    return knex.schema
        .createTable('product', table => {
            table.increments('product_id').unsigned().primary();
            table.text('name').notNullable();
            table.text('description');
            table.text('waist');
            table.integer('cost_price');
            table.integer('price');
            table.integer('min_stock');
            table.boolean('active').defaultTo(true).notNullable();
            table.timestamp('created_at').defaultTo(knex.fn.now());
            table.timestamp('updated_at').defaultTo(knex.fn.now());
        })
};

exports.down = knex => {
    return knex.schema
        .dropTableIfExists('product');
};
