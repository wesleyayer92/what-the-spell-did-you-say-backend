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


async function lifeTimeScore(emailUsername) {
    // let attemptsCorrect = 0;
    // let attemptsTotal = 0;
    // let lifeTimeScore = attemptsCorrect/attemptsTotal;
    try{
        const attemptsCorrect = await db.result(`
        select count(*) from spellingbeeattempts
         where attemptCorrect=true and emailUsername='${emailUsername}'
        `);
        const attemptsTotal = await db.result(`
        select count(*) from spellingbeeattempts
        where emailUsername='${emailUsername}';
        `);
        const result = (parseInt(attemptsCorrect.rows[0].count)/parseInt(attemptsTotal.rows[0].count) * 100).toFixed(0);
        console.log(result);
        // console.log(parseInt(attemptsCorrect.rows[0].count));
        if (result == "NaN") {
            return 0;
        } else {
            return result;
        }
        //make sure that is a number not string
        //Number(variable)
    }
    catch (err){
        console.log('************ERROR************');
        err.message;
    }
}

async function mostRecentScore(emailUsername) {
    // let attemptsCorrect = 0;
    // let attemptsTotal = 0;
    // let lifeTimeScore = attemptsCorrect/attemptsTotal;
    try{
        const attemptsCorrect = await db.result(`
        select count(*) from (select * from spellingbeeattempts order by dateattempted desc limit 6) as mostrecent where attemptcorrect=true and emailUsername='${emailUsername}';
        `);
        const attemptsTotal = 6;
        // console.log(parseInt(attemptsCorrect.rows[0].count));
        return (parseInt(attemptsCorrect.rows[0].count)/parseInt(attemptsTotal) * 100).toFixed(0) || 0;
        //make sure that is a number not string
        //Number(variable)
    }
    catch (err){
        console.log('************ERROR************');
        err.message;
    }
}

async function mostRecentWords(emailUsername) {
    try {
        const words = await db.result(`
        select word, attemptcorrect from spellingbeeattempts where emailUsername='${emailUsername}' order by dateattempted desc limit 6;
        `);
        console.log(words);
        return words;
    }
    catch (err) {
        console.log(err);
    }
}

async function postToDB(emailUsername, word, isCorrect) {
    // const date = new Date();
    try {
        const test = await db.result(`
        insert into spellingBeeAttempts
        (emailUsername, word, attemptCorrect, dateAttempted)
        values
        ('${emailUsername}', '${word}', ${isCorrect}, localtimestamp);
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
    return arr;
}

async function createUser(name, emailUsername, hash) {
    try {
        const resultObj = await db.result(`
        SELECT emailUsername FROM users WHERE emailusername='${emailUsername}';`);
        console.log(resultObj);
        // console.log(resultObj.rows[0]);
        if (resultObj.rows[0] == undefined) {
            const createUser = await db.one(`
            insert into users
            (name, emailUsername, hash)
            values
            ('${name}', '${emailUsername}', ${hash});
            `);
            console.log(createUser);
            return createUser;
        }
        else {
            console.log('user already exists');
        } 
    }
    catch(err) {
        console.log(err);
    }
}

async function login(emailUsername, hash) {
    console.log('HASH');
    console.log(hash);
    try {
        const resultObj = await db.result(`
        SELECT * FROM users where emailusername='${emailUsername}' and hash='${hash}';
        `);
        // console.log(emailUsername);
        console.log('HASHCHECK!!!!!!!')
        console.log(resultObj)
        if (resultObj.rows[0].hash == hash) {
            // console.log('OK');
            // allow user to proceed//
            // allow button to work or function that goes
            // to next page to work
            return resultObj;
        }
    }
    catch(err) {
        console.log('hey you did it wrong');
        return err.message;
    }
}

router.post('/signup', async(req, res, next) => {
    console.log('******REQBODY*******')
    console.log(req.body);
    const { name, emailUsername, hash } = req.body;
    const result = await createUser(name, emailUsername, hash);
    console.log(result);
})

router.post('/login', async(req, res, next) => {
    console.log('*****LOGIN******')
    const { emailUsername, hash } = req.body
    const result = await login(emailUsername, hash);
    result.rowCount >= 1 ?
    res.send('ITS WORKING')
    : res.send('ITS BROKEN');
})

router.post('/scorecard', async (req, res, next) => {
    const { emailUsername } = req.body;
    const arr = [];
    arr.push(await lifeTimeScore(emailUsername));
    arr.push(await mostRecentScore(emailUsername));
    const wordsArray = await mostRecentWords(emailUsername);
    arr.push(wordsArray.rows);
    console.log('ARRRRRRRRRRRRRRRR');
    console.log(arr);
    res.json(arr);
});

router.get('/', async(req, res, next) => {
    const result = await pullFromDB();
    console.log('im in router.get')
    console.log(result);
    res.send(result);
});

router.post('/', async (req, res, next) => {
    console.log(req.body);
    const { emailUsername, word, attemptCorrect } = req.body;
    try {
        const response = await postToDB(emailUsername, word, attemptCorrect);
        console.log("RESPONSE==============");
        console.log(response);
        res.json({response: response});
    } catch (err) {
        console.log(`ERROR: ${err}`);
        res.json({response: false})
    }
})

module.exports = router;
