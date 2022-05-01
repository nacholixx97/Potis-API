const db = require('../database/config');
const { catchAsync } = require('../helpers/catchAsync');
const ErrorHandler = require('../helpers/errorHandler');
const { sendOK } = require('../helpers/sendOK');
const jwtToken = require('../helpers/jwtToken');

const productController = {};

productController.getById = catchAsync(async (req, res, next) => {
    const id = req.params.id;
    const product = await db('product')
        .where('product_id', id)
        .first();

    if (!product)
        next(new ErrorHandler(`No existe producto de ID: ${id}`));
    else
        sendOK(res, product);
});

productController.getList = catchAsync(async (req, res, next) => {
    const sortingModel = req.body.sortingModel;
    let products = await db('product')
        .select('product_id', 'name', 'description', 'waist', 'price', 'min_stock', 'active', 'updated_at')
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
    const totalRows = products.length;
    const totalPages = Math.ceil(totalRows / gridModel.pageSize);

    const startRow = gridModel.pageSize * (gridModel.selectedPage - 1);
    products = products.slice(startRow, startRow + gridModel.pageSize);

    sendOK(
        res,
        {
            data: products,
            selectedPage: gridModel.selectedPage,
            pageSize: gridModel.pageSize,
            totalPages: totalPages,
            totalRows: totalRows
        }
    );
});

productController.getProductsToSell = catchAsync(async (req, res, next) => {
    const sortingModel = req.body.sortingModel;
    const stock = db.raw(`
        (case when totalStock(product_id, 'in') is not null then totalStock(product_id, 'in') else 0 end) 
        - 
        (case when totalStock(product_id, 'out') is not null then totalStock(product_id, 'out') else 0 end)
        as stock
    `);
    let products = await db('product')
        .select('product_id', 'name', 'price', stock, 'min_stock')
        .where(qb => {
            req.body.filters.map(f => {
                if (f.value.length > 0 && f.type != 'check' && f.type != 'date')
                    qb.where(`${f.key}`, 'ilike', `%${f.value}%`);

                if (f.type == 'check')
                    qb.where(`${f.key}`, `${f.value | false}`);

                if (f.type == 'date' && f.value.length > 0)
                    qb.whereRaw(`created_at between ? and ?`, [`${f.value} 00:00:00`, `${f.value} 23:59:59`]);
            });
            qb.where('active', 'true');
        })
        .orderBy(sortingModel.sortBy, sortingModel.sortDirection);

    const gridModel = req.body.gridModel;
    const totalRows = products.length;
    const totalPages = Math.ceil(totalRows / gridModel.pageSize);

    const startRow = gridModel.pageSize * (gridModel.selectedPage - 1);
    products = products.slice(startRow, startRow + gridModel.pageSize);

    sendOK(
        res,
        {
            data: products,
            selectedPage: gridModel.selectedPage,
            pageSize: gridModel.pageSize,
            totalPages: totalPages,
            totalRows: totalRows
        }
    );
});

productController.deleteProduct = catchAsync(async (req, res, next) => {
    const id = req.params.id;

    await db('product')
        .update({ active: false })
        .where('product_id', id);

    sendOK(res);
});

productController.updateProduct = catchAsync(async (req, res, next) => {
    const id = req.params.id;
    let request = req.body;
    request.updated_at = new Date();
    request.updated_by = jwtToken.userByToken(req.headers['access-token']).username;

    await db('product')
        .where('product_id', id)
        .update(request);

    sendOK(res);
});

productController.createProduct = catchAsync(async (req, res, next) => {
    const request = req.body;
    const product_id = await db('product')
        .insert({
            name: request.name,
            description: request.description,
            waist: request.waist,
            cost_price: request.cost_price,
            price: request.price,
            min_stock: request.min_stock,
            active: true,
            image: request.image,
            created_by: jwtToken.userByToken(req.headers['access-token']).username,
            updated_by: jwtToken.userByToken(req.headers['access-token']).username
        })
        .returning('product_id');

    if (request.has_stock)
        await db('stock').insert({ action: 'in', product_id: product_id[0], amount: request.start_stock });

    sendOK(res);
});

module.exports = productController;
