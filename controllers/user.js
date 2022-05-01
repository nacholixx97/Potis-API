const db = require('../database/config');
const { catchAsync } = require('../helpers/catchAsync');
const ErrorHandler = require('../helpers/errorHandler');
const { sendOK } = require('../helpers/sendOK');
const jwtToken = require('../helpers/jwtToken');

const userController = {};

userController.getById = catchAsync(async (req, res, next) => {
    const id = req.params.id;
    const user = await db('user')
        .where({
            user_id: id
        }).first();

    if (!user)
        next(new ErrorHandler(`No existe usuario de ID: ${id}`));
    else
        sendOK(res, user);
});

userController.getList = catchAsync(async (req, res, next) => {
    const sortingModel = req.body.sortingModel;
    let users = await db('user')
        .select('user_id', 'lastname', 'name', 'username', 'email', 'active')
        .where(qb => {
            req.body.filters.map(f => {
                if (f.value.length > 0 && f.type != 'check' && f.type != 'date')
                    qb.where(`${f.key}`, 'ilike', `%${f.value}%`);

                if (f.type == 'check')
                    qb.where(`${f.key}`, `${f.value | false}`);

                if (f.type == 'date' && f.value.length > 0)
                    qb.whereRaw(`created_at between ? and ?`, [`${f.value} 00:00:00`, `${f.value} 23:59:59`]);
            });
        })
        .orderBy(sortingModel.sortBy, sortingModel.sortDirection);

    const gridModel = req.body.gridModel;
    const totalRows = users.length;
    const totalPages = Math.ceil(totalRows / gridModel.pageSize);

    const startRow = gridModel.pageSize * (gridModel.selectedPage - 1);
    users = users.slice(startRow, startRow + gridModel.pageSize);

    sendOK(
        res,
        {
            data: users,
            selectedPage: gridModel.selectedPage,
            pageSize: gridModel.pageSize,
            totalPages: totalPages,
            totalRows: totalRows
        }
    );
});

userController.deleteUser = catchAsync(async (req, res, next) => {
    const id = req.params.id;

    await db('user')
        .update({ active: false })
        .where('user_id', id);

    sendOK(res);
});

userController.update = catchAsync(async (req, res, next) => {
    const id = req.params.id;
    let request = req.body;
    request.updated_at = new Date();
    request.updated_by = jwtToken.userByToken(req.headers['access-token']).username;

    await db('user')
        .where('user_id', id)
        .update(request);

    sendOK(res);
});

userController.create = catchAsync(async (req, res, next) => {
    const request = req.body;
    await db('user')
        .insert({
            lastname: request.lastname,
            name: request.name,
            username: request.username,
            password: request.password,
            email: request.email,
            active: true,
            created_by: jwtToken.userByToken(req.headers['access-token']).username,
            updated_by: jwtToken.userByToken(req.headers['access-token']).username
        })
        .returning('user_id');

    sendOK(res);
});

userController.changePassword = catchAsync(async (req, res, next) => {
    const request = req.body;

    if (request.password !== request.confirmPassword)
        next(new ErrorHandler('Las contraseñas no coinciden.'));

    await db('user')
        .update({
            password: request.password,
            updated_at: new Date(),
            updated_by: jwtToken.userByToken(req.headers['access-token']).username
        });

    sendOK(res);
});

module.exports = userController;
