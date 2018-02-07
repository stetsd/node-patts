const level = require('level');
const sublevel = require('level-sublevel');
const db = sublevel(level('example-db', {valueEncoding: 'json'}));
const salesDb = db.sublevel('sales');

module.exports = function totalSales(item, cb){
    console.log('totalSales() invoked');
    let sum = 0;
    salesDb.createValueStream()
        .on('data', data => {
            if(!item || data.item === item){
                sum += data.amount;
            }
        })
        .on('end', () => {
            cb(null, sum);
        });
};