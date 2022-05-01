exports.up = knex => {
    return knex.schema
        .createTable('bill', table => {
            table.increments('bill_id').unsigned().primary();
            table.integer('total');
            table.boolean('has_been_returned').notNullable().defaultTo(false);
            table.timestamp('created_at').defaultTo(knex.fn.now());
        })
        .createTable('sell', table => {
            table.increments('sell_id').unsigned().primary();
            table.integer('bill_id').notNullable().index().references('bill_id').inTable('bill').onDelete('cascade');
            table.integer('product_id').notNullable().index().references('product_id').inTable('product').onDelete('cascade');
            table.integer('price').notNullable();
            table.integer('amount').notNullable();
            table.integer('discount').notNullable();
            table.integer('subtotal').notNullable();
            table.integer('total').notNullable();
            table.timestamp('created_at').defaultTo(knex.fn.now());
        })
};

exports.down = knex => {
    return knex.schema
        .dropTableIfExists('bill')
        .dropTableIfExists('sell');

};
