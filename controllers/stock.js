const db = require('../database/config');
const { catchAsync } = require('../helpers/catchAsync');
const ErrorHandler = require('../helpers/errorHandler');
const { sendOK } = require('../helpers/sendOK');
const jwtToken = require('../helpers/jwtToken');

const stockController = {};

stockController.getList = catchAsync(async (req, res, next) => {
    const sortingModel = req.body.sortingModel;
    const totalStock = db.raw(`
        (case when totalStock(product_id, 'in') is not null then totalStock(product_id, 'in') else 0 end) 
        - 
        (case when totalStock(product_id, 'out') is not null then totalStock(product_id, 'out') else 0 end)
        as total_stock
    `);
    let stock = await db('product')
        .select('product_id', 'name', 'price', totalStock, 'min_stock')
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
    const totalRows = stock.length;
    const totalPages = Math.ceil(totalRows / gridModel.pageSize);

    const startRow = gridModel.pageSize * (gridModel.selectedPage - 1);
    stock = stock.slice(startRow, startRow + gridModel.pageSize);


    sendOK(
        res,
        {
            data: stock,
            selectedPage: gridModel.selectedPage,
            pageSize: gridModel.pageSize,
            totalPages: totalPages,
            totalRows: totalRows
        }
    );
});

stockController.inAction = catchAsync(async (req, res, next) => {
    const products = req.body.products;
    let rowsToImpact = [];

    products.map(product => {
        rowsToImpact.push({
            action: 'in',
            product_id: product.product_id,
            amount: product.amount,
            created_by: jwtToken.userByToken(req.headers['access-token']).username,
            updated_by: jwtToken.userByToken(req.headers['access-token']).username
        });
    })

    await db('stock').insert(rowsToImpact);

    sendOK(res);
});

module.exports = stockController;
