
create table spellingBee (
    id serial primary key,
    word text,
    word2 text,
    partOfSpeech text,
    definition text,
    difficulty text
);




create table users (
    id serial primary key,
    name text,
    emailUsername text,
    hash text
);