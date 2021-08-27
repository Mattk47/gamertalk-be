<h1>Northcoders House of Games API</h1>

I have built an API for the purpose of accessing application data programmatically. The intention here is to mimick the building of a real world backend service (such as reddit) which should provide this information to the front end architecture.

<h2> Dependencies</h2>
<ul>
<li>dotenv</li>
<li>express</li>
<li>node-postgres</li>
<li>pg-format</li>
</ul>

<h2> Dev Dependencies</h2>
<ul>
<li>jest</li>
<li>jest-sorted</li>
<li>supertest</li>
</ul>

A PSQL database is needed to setup this project successfully.

<h2>Installation process</h2>

Fork and clone this repository, then cd into the newly created directory and <strong>run: npm install</strong> to install all the aforementioned dependencies.

After installing the dependencies, run the command: <strong>npm run setup-dbs</strong> to create both test and dev databases.

Lastly, two .env files need to be created : .env.test and .env.development. Into each, add PGDATABASE=<database_name_here>, with the correct database name for that environment (see /db/setup.sql for the database names). Double check that these .env files are .gitignored.

<h2>Executing program</h2>
<ul>
<li>To test the endpoints: <strong>npm test app.js</strong></li>
<li>To test the seeding util functions: <strong>npm test utils.js</strong></li>
<li>To seed dev database: <strong>npm run seed</strong></li>
</ul>