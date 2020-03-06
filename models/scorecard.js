var express = require('express');
var router = express.Router();

// require 'pg-promise', but call it immediately
// so we can configure the connection
const pgp = require('pg-promise')({
    query: e => {
        // print the SQL query
        console.log(`QUERY: ${e.query}`);
    }
});

const options = {
    host: 'localhost',
    database: 'spellingGame'
};

const db = pgp(options);


async function pullScorecard (){
    try{
        const result = await db.result(`
        select * from spellingBeeAttempts;
        `);
        console.log(result);
        return result;
    }
}

module.exports = scorecardRouter;