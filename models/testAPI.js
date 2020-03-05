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

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

async function pullFromDB() {
    const arr = [];
    let wordId;
    let result;
    for (let count = 1; count <= 6; count++) {
        switch(count) {
            case 1:
                wordId = getRandomInt(1, 123);
                result = await db.one(`select * from spellingBee where wordId=${wordId}`);
                arr.push(result);
                console.log(`FIRST: ${arr[0]}`)
                break;
            case 2:
                wordId = getRandomInt(1, 123);
                result = await db.one(`select * from spellingBee where wordId=${wordId}`);
                console.log(`SECOND: ${arr[1]}`)
                arr.push(result);
                break;
            case 3:
                wordId = getRandomInt(1, 123);
                result = await db.one(`select * from spellingBee where wordId=${wordId}`);
                console.log(`THIRD: ${arr[2]}`)
                arr.push(result);
                break;
            case 4:
                wordId = getRandomInt(124, 350);
                result = await db.one(`select * from spellingBee where wordId=${wordId}`);
                console.log(`FOURTH: ${arr[3]}`)
                arr.push(result);
                break;
            case 5:
                wordId = getRandomInt(124, 350);
                result = await db.one(`select * from spellingBee where wordId=${wordId}`);
                console.log(`FIFTH: ${arr[4]}`)
                arr.push(result);
                break;
            case 6:
                wordId = getRandomInt(351, 450);
                result = await db.one(`select * from spellingBee where wordId=${wordId}`);
                console.log(`SIXTH: ${arr[5]}`)
                arr.push(result);
                break;
        }
    }
    
    console.log(`WHOLE: ${arr}`);
    return arr;

    // const result = await db.one(`select * from spellingBee where wordId=4;`);
    // const result = await db.any(`select * from spellingBee;`);

    // console.log('im in the function');
    // console.log(result);
    // return result;
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
