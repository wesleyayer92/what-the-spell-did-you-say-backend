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
// next, give the info about our specific database
// that we're talking to




async function postToDB(isCorrect) {
    try {
        const test = await db.result(`
        insert into spellingBeeAttempts
        (userId, wordId, attemptCorrect, dateAttempted)
        values
        (1, 4, ${isCorrect}, '1999-12-31');
        `);
        return test;
    }
    catch (err) {
        err.message;
    }
}

async function pullFromDB(){
    const result = await db.one(`select * from spellingBee where wordId=4;`);
    // const result = await db.any(`select * from spellingBee;`);

    console.log('im in the function');
    console.log(result);
    return result;
}

router.get('/', async (req, res, next) => {
    const result = await pullFromDB();
    console.log('im in router.get')
    console.log(result);
    res.send(result);
});

router.post('/', async (req, res, next) => {
    console.log(req.body);
    const { attemptCorrect } = req.body;
    const response = await postToDB(attemptCorrect);
    console.log(response);
    // response.command === "INSERT" && response.rowCount >= 1;
    // console.log(response.command)
    // ? res.sendStatus(200)
    // : res.send(`COULD NOT DO THE POST THING`);
})

module.exports = router;
