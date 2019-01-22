const   pg = require('pg'),
        config = require('../config/dev');

const   pool = new pg.Pool(config.db);

function get_tags(cb){
    pool.connect(function (err, client, done) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }
        client.query(`SELECT attname  AS col
        FROM   pg_attribute
        WHERE  attrelid = 'tags'::regclass 
        AND    attnum > 0
        AND    NOT attisdropped
        ORDER  BY attnum;`, function(err, res){
            done();
            var allTags = []
            for (var i = 1 ; i < res.rows.length ; i++)
            {
                var oneTag = { value: res.rows[i].col, label: res.rows[i].col }
                allTags.push(oneTag)
            } 
            return cb(allTags)
        });
    })
}

module.exports = {
    get_tags
}