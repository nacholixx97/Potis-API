
exports.up = function (knex) {
    return knex.schema
        .alterTable('bill', table => {
            table.timestamp('updated_at').defaultTo(knex.fn.now());
            table.text('created_by');
            table.text('updated_by');
        })
        .raw("update bill set updated_at = created_at, created_by = 'admin', updated_by = 'admin'")

        .alterTable('product', table => {
            table.text('created_by');
            table.text('updated_by');
        })
        .raw("update product set created_by = 'admin', updated_by = 'admin'")

        .alterTable('sell', table => {
            table.timestamp('updated_at').defaultTo(knex.fn.now());
            table.text('created_by');
            table.text('updated_by');
        })
        .raw("update sell set updated_at = created_at, created_by = 'admin', updated_by = 'admin'")

        .alterTable('stock', table => {
            table.timestamp('updated_at').defaultTo(knex.fn.now());
            table.text('created_by');
            table.text('updated_by');
        })
        .raw("update stock set updated_at = created_at, created_by = 'admin', updated_by = 'admin'")

        .alterTable('user', table => {
            table.text('created_by');
            table.text('updated_by');
        })
        .raw("update public.user set created_by = 'admin', updated_by = 'admin'")
};

exports.down = function (knex) {

};
