
create table spellingBee (
    id integer primary key,
    word text,
    word2 text,
    partOfSpeech text,
    definition text(varchar),
    difficulty text
);




create table users (
    id serial primary key,
    name text,
    emailUsername text,
    hash text
);