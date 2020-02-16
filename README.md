![Continuous Integration](https://github.com/iniva/hapi-sequelize-orm/workflows/Continuous%20Integration/badge.svg)
[![Coverage Status](https://coveralls.io/repos/github/iniva/hapi-sequelize-orm/badge.svg?branch=master)](https://coveralls.io/github/iniva/hapi-sequelize-orm?branch=master)

# Hapi Sequelize ORM <!-- omit in toc -->
A Hapijs (v17+) plugin for relational databases using Sequelize

- [Installation](#installation)
- [Options](#options)
- [Model Definition](#model-definition)
- [Usage](#usage)
  - [HapiJS Plugin](#hapijs-plugin)
  - [Standalone](#standalone)
- [Disclaimer](#disclaimer)

## Installation
```
# npm
npm install hapi-sequelize-orm

# yarn
yarn add hapi-sequelize-orm
```

Depending on which database(s) you will work with, you will need one or more of these
```
# Postgres
npm install pg pg-hstore
yarn add pg pg-hstore

# MySQL
npm install mysql2
yarn add mysql2

# SQLite
npm install sqlite3
yarn add sqlite3

# MS SQL
npm install tedious
yarn add tedious
```

## Options
Database options are passed as a javascript object with the following structure:
```javascript
{
    models: {},
    ...sequelizeOpts
}
```
* **models**: object where each key has a [Model Definition](#model-definition)
* **sequelizeOpts**: same as described by [Sequelize docs](http://docs.sequelizejs.com/class/lib/sequelize.js~Sequelize.html#instance-constructor-constructor)

## Model Definition
Models are javascript objects with the following properties:
* `required` **name**: A string that will be used to register the model
* `required` **definition**: an object following the [Sequelize models definition](http://docs.sequelizejs.com/manual/tutorial/models-definition.html)
* `optional` **options**: an object following the [Sequelize model configuration](http://docs.sequelizejs.com/manual/tutorial/models-definition.html#configuration). This controls the table behavior, like fields with urderscore, timestamps, etc.
* `optional` **associations**: an array of objects with the following properties:
  * `required` **type**: The association type. The `ASSOCIATION_TYPES` variable that comes with this library is a direct export of `sequelize.DataTypes`.
  * `required` **target**: the name of the target model.
  * `optional | required` **options**: an object that defines the specific association. See [Sequelize Associations](http://docs.sequelizejs.com/class/lib/associations/base.js~Association.html) for more details.

**Example**
```javascript
// user.js | User Model
import { ASSOCIATION_TYPES, DATA_TYPES } from 'hapi-sequelize-orm';

export default {
    name: 'User',
    definition: {
        id: {
            type: DATA_TYPES.STRING,
            primaryKey: true
        },
        name: DATA_TYPES.STRING,
        lastname: DATA_TYPES.STRING,
        email: {
            type: DATA_TYPES.STRING,
            unique: true
        }
    },
    associations: [
        {
            type: ASSOCIATION_TYPES.belongsToMany,
            target: 'Job',
            options: {
                through: 'UserJob'
            }
        }
    ]
};
```

## Usage
You can either implement this as a HapiJS plugin (intended) or as a standalone using the `Orm` class directly.

### HapiJS Plugin
The plugin approach allows you to connect to multiple databases and access them from a single point, which is the plugin itself.
```javascript
// File where you register your plugins
import { plugin as ormPlugin } from 'hapi-sequelize-orm';

// other plugins
await server.register({
    plugin: ormPlugin,
    options: {
        databases: {
            bookstore: {
                models: {/* model definitions */},
                database: 'bookstore',
                username: 'dev',
                password: '123456',
                dialect: 'mysql'
            },

            statistics: {
                models: {/* model definitions */},
                database: 'stats',
                username: 'dev',
                password: '123456',
                dialect: 'postgres'
            },
        }
    }
});
```

```javascript
// Handler
import { QUERY_TYPES } from 'hapi-sequelize-orm';

server.route({
    method:'GET',
    path:'/books',
    handler: function (request) {
        const database = request.server['hapi-sequelize-orm'].getDb('bookstore');
        const books = await database.query('SELECT * FROM books', { raw: true, type: QUERY_TYPES.SELECT });
        // QUERY_TYPES is a direct export of sequelize.QueryTypes

        return books;
    }
});
```

### Standalone
The standalone approach is almost the same as the plugin one. You would create a new instance of the `Orm` class with a single database configuration object (see [Options](#options)) and then use the database. You could also test the connection and/or invoke the `init()` method just to be sure that you can connect to the database. You are in control.

The difference here is that you would need to expose the implementation through your own plugin (you can see the [plugin](src/plugin.js) implementation for reference) or instantiate a new database connection across your API everytime you need to perform a query.

```javascript
// Handler
import { Orm, QUERY_TYPES } from 'hapi-sequelize-orm';
import dbOpts from 'path/to/config/dbOpts';

server.route({
    method:'GET',
    path:'/books',
    handler: function (request) {
        const database = new Orm(dbOpts);
        const books = await database.query('SELECT * FROM books', { raw: true, type: QUERY_TYPES.SELECT });
        // QUERY_TYPES is a direct export of sequelize.QueryTypes

        return books;
    }
});
```

## Disclaimer
I created this library to avoid the copy/paste across personal projects where I interact with relational databases.

If you find it useful and have any feedback / issue / improvement in mind, create an issue describing it. I'm open to discussion.