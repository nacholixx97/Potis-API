const db = require('../database/config');
const { catchAsync } = require('../helpers/catchAsync');
const ErrorHandler = require('../helpers/errorHandler');
const { sendOK } = require('../helpers/sendOK');
const moment = require('moment');

const chartController = {};

chartController.mostSelledToday = catchAsync(async (req, res, next) => {
    const date = moment().format("YYYY-MM-DD");
    const productColumn = db.raw("concat('#', p.product_id, ' - ', p.name, ' (', p.waist, ')') as name")
    const sellsColumn = db.raw("sum(s.amount) as y")
    const data = await db('product as p')
        .column(productColumn, sellsColumn)
        .join('sell as s', 's.product_id', '=', 'p.product_id')
        .join('bill as b', 's.bill_id', 'b.bill_id')
        .whereRaw("s.created_at between ? and ? ", [`${date} 00:00:00`, `${date} 23:59:59`])
        .where('b.has_been_returned', false)
        .groupBy('p.product_id');

    sendOK(res, data);
});

chartController.totalGenerated = catchAsync(async (req, res, next) => {
    const date = moment().format("YYYY-MM-DD");
    const totalColumn = db.raw("sum(s.total) as total")
    const data = await db('sell as s')
        .join('bill as b', 's.bill_id', 'b.bill_id')
        .column(totalColumn)
        .whereRaw("s.created_at between ? and ? ", [`${date} 00:00:00`, `${date} 23:59:59`])
        .where('b.has_been_returned', false)

    sendOK(res, data[0]);
});

chartController.mostSelledProducts = catchAsync(async (req, res, next) => {
    const productColumn = db.raw("concat('#', p.product_id, ' - ', p.name, ' (', p.waist, ')') as name")
    const sellsColumn = db.raw("sum(s.amount) as y")
    const data = await db('product as p')
        .column(productColumn, sellsColumn)
        .join('sell as s', 's.product_id', 'p.product_id')
        .join('bill as b', 's.bill_id', 'b.bill_id')
        .where('b.has_been_returned', false)
        .groupBy('p.product_id');

    sendOK(res, data);
});

chartController.mostSelledByWaist = catchAsync(async (req, res, next) => {
    const productColumn = db.raw("concat('Talle: ', p.waist) as name")
    const sellsColumn = db.raw("sum(s.amount) as y")
    const data = await db('product as p')
        .column(productColumn, sellsColumn)
        .join('sell as s', 's.product_id', 'p.product_id')
        .join('bill as b', 's.bill_id', 'b.bill_id')
        .where('b.has_been_returned', false)
        .groupBy('p.waist');

    sendOK(res, data);
});

module.exports = chartController;
