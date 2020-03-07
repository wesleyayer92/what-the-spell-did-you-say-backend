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


async function lifeTimeScore (){
    // let attemptsCorrect = 0;
    // let attemptsTotal = 0;
    // let lifeTimeScore = attemptsCorrect/attemptsTotal;
    try{
        const attemptsCorrect = await db.result(`
        select count(*) from spellingbeeattempts
         where attemptCorrect=true and userid=1
        `);
        const attemptsTotal = await db.result(`
        select count(*) from spellingbeeattempts
        where userid=1;
        `);
        // console.log(parseInt(attemptsCorrect.rows[0].count));
        return (parseInt(attemptsCorrect.rows[0].count)/parseInt(attemptsTotal.rows[0].count) * 100).toFixed(2);
        //make sure that is a number not string
        //Number(variable)
    }
    catch (err){
        console.log('************ERROR****');
        err.message;
    }
}


// async function scorecardPull() {
//     const result = await db.any(`select * from spellingBeeAttempts`);
//     return result;
// }


async function postToDB(isCorrect, wordId) {
    // const date = new Date();
    try {
        const test = await db.result(`
        insert into spellingBeeAttempts
        (userId, wordId, attemptCorrect, dateAttempted)
        values
        (1, ${wordId}, ${isCorrect}, localtimestamp);
        `);
        return test;
    }
    catch (err) {
        console.log(err);
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
                break;
            case 2:
                wordId = getRandomInt(1, 123);
                result = await db.one(`select * from spellingBee where wordId=${wordId}`);
                arr.push(result);
                break;
            case 3:
                wordId = getRandomInt(1, 123);
                result = await db.one(`select * from spellingBee where wordId=${wordId}`);
                arr.push(result);
                break;
            case 4:
                wordId = getRandomInt(124, 350);
                result = await db.one(`select * from spellingBee where wordId=${wordId}`);
                arr.push(result);
                break;
            case 5:
                wordId = getRandomInt(124, 350);
                result = await db.one(`select * from spellingBee where wordId=${wordId}`);
                arr.push(result);
                break;
            case 6:
                wordId = getRandomInt(351, 450);
                result = await db.one(`select * from spellingBee where wordId=${wordId}`);
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

router.get('/scorecard', async (req, res, next) => {
    const result = await lifeTimeScore();
    res.json(result);
});

router.get('/', async (req, res, next) => {
    const result = await pullFromDB();
    console.log('im in router.get')
    console.log(result);
    res.send(result);
});

router.post('/', async (req, res, next) => {
    console.log(req.body);
    const { attemptCorrect, wordId } = req.body;
    const response = await postToDB(attemptCorrect, wordId);
    console.log(response);
})

module.exports = router;
