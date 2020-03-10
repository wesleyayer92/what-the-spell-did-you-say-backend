
create table spellingBee (
    wordId integer primary key,
    word text,
    word2 text,
    partOfSpeech text,
    definition text,
    difficulty text
);


create table users (
    userId serial primary key,
    name text,
    emailUsername text,
    hash text
);

create table spellingBeeAttempts (
    emailUsername text,
    wordId integer REFERENCES spellingBee(wordId) Not Null,
    attemptCorrect boolean,
    dateAttempted timestamp
)