# bratstvousa
bratstvousa website and admin

# Architecture

1. App: SvelteKit
- SvelteKit was chosen due to it's ability to easily transition from SSR to CSR. The hope is that development will be faster with SSR.
2. Admin: Laravel Nova Admin
- There is no better admin library than nova (ok maybe [filament](https://filamentphp.com/))
3. Database: Postgres
- Good support for JSON formats, which are good for adding translations later on

# DB Schema Choices
The original site had a bunch of self references in a `pages` table.
The problem is that: 

    1. Permissions are more difficult to maintain in this case
    2. Overly 'modular?' it's hard to customize when all of the pages must have the same columns
    3. It's too easy to accidentally create nested forloops of sql queries.
Considerations of the new schema

    1. Yes, it needs a new table for each new type of page, but that allows for more customizeability.
    2. More information is stored in the DB. It is easier to figure out what is going on by just looking at the db

