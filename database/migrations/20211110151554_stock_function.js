
exports.up = function (knex) {
    return knex.raw(
        "create or replace function totalstock (id integer, act text)"+
        "returns integer as $total$"+
        "declare"+
        "   total integer;"+
        "begin"+
        "   select sum(s.amount) into total "+
        "   from stock s"+
        "   where s.product_id = id and s.action = act;"+
        "   return total;"+
        "end;"+
        "$total$ language plpgsql;"
    )
};

exports.down = function (knex) {

};
