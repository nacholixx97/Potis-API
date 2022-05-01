
exports.up = function (knex) {
    return knex('user')
        .then(function () {
            return knex('user').insert([
                {
                    username: 'admin',
                    password: '123',
                    name: 'admin',
                    lastname: 'admin'
                }
            ]);
        });
};

exports.down = function (knex) {

};
