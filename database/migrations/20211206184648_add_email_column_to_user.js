
exports.up = function(knex) {
    return knex.schema
        .alterTable('user', table => {
            table.text('email').unique();
        })
        .raw("update public.user set email = 'seba.ponce97@gmail.com' where user_id = 1");
};

exports.down = function(knex) {
    
};
