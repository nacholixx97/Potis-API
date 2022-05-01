const db = require('../database/config');
const { catchAsync } = require('../helpers/catchAsync');
const ErrorHandler = require('../helpers/errorHandler');
const { sendOK } = require('../helpers/sendOK');
const jwtToken = require('../helpers/jwtToken');

const sellController = {};

sellController.getList = catchAsync(async (req, res, next) => {
    const sortingModel = req.body.sortingModel;
    let sells = await db('bill')
        .select('bill_id', 'created_at', 'total')
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
    const totalRows = sells.length;
    const totalPages = Math.ceil(totalRows / gridModel.pageSize);

    const startRow = gridModel.pageSize * (gridModel.selectedPage - 1);
    sells = sells.slice(startRow, startRow + gridModel.pageSize);

    sendOK(
        res,
        {
            data: sells,
            selectedPage: gridModel.selectedPage,
            pageSize: gridModel.pageSize,
            totalPages: totalPages,
            totalRows: totalRows
        }
    );
});

sellController.newSell = catchAsync(async (req, res, next) => {
    let bill_id = await db('bill').insert({}).returning('bill_id');
    bill_id = bill_id[0];

    console.log(req.body.products);

    products = req.body.products;
    totalSell = 0;
    let rowsToImpact = [];
    let rowsForStockToImpact = [];
    products.map(item => {
        rowsToImpact.push({
            product_id: item.product_id,
            bill_id: bill_id,
            price: item.price,
            amount: item.amount,
            discount: item.discount,
            subtotal: item.subtotal,
            total: item.total,
            created_by: jwtToken.userByToken(req.headers['access-token']).username,
            updated_by: jwtToken.userByToken(req.headers['access-token']).username
        })
        
        rowsForStockToImpact.push({
            action: 'out',
            product_id: item.product_id,
            amount: item.amount,
            created_by: jwtToken.userByToken(req.headers['access-token']).username,
            updated_by: jwtToken.userByToken(req.headers['access-token']).username
        });

        totalSell += item.total;
    })

    await db('sell').insert(rowsToImpact);
    await db('stock').insert(rowsForStockToImpact);
    await db('bill').where('bill_id', bill_id).update({ total: totalSell });

    sendOK(res);
});

sellController.getById = catchAsync(async (req, res, next) => {
    const id = req.params.id;
    const sells = await db('sell as s')
        .select('p.product_id', 'p.name', 'p.waist', 's.amount', 's.subtotal', 's.discount', 's.total')
        .join('product as p', 's.product_id', 'p.product_id')
        .where('s.bill_id', id);
    const has_been_returned = await db('bill').where('bill_id', id).select('has_been_returned');

    sendOK(res, {data: sells, has_been_returned: has_been_returned[0].has_been_returned});
});

sellController.returnSell = catchAsync(async (req, res, next) => {
    const id = req.params.id;
    const productsAndAmountToReturn = await db('sell')
        .select('product_id', 'amount')
        .where('bill_id', id);

    let rowsToImpact = [];
    productsAndAmountToReturn.map(item => {
        rowsToImpact.push({
            action: 'in',
            product_id: item.product_id,
            amount: item.amount
        });
    });

    await db('stock').insert(rowsToImpact);
    await db('bill').where('bill_id', id).update({ has_been_returned: true });

    sendOK(res);
});

module.exports = sellController;
