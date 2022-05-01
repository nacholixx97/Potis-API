
exports.up = function (knex) {
    return knex.schema.table('product', function (table) {
        table.text('image');
    })
};

exports.down = function (knex) {

};
