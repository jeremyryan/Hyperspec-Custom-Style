create table glossary (
       key text not null primary key,
       term text unique,
       definition text
);

