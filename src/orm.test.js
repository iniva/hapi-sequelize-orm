/* global jest beforeEach afterEach describe it expect */

import Sequelize from 'sequelize';

import Orm from './orm';
import { DATA_TYPES, ASSOCIATION_TYPES } from './types';

const mockedModels = {
    User: {
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
    },
    Job: {
        name: 'Job',
        definition: {
            id: {
                type: DATA_TYPES.STRING,
                primaryKey: true
            },
            title: DATA_TYPES.STRING,
        }
    },
    UserJob: {
        name: 'UserJob',
        definition: {
            started: DATA_TYPES.DATEONLY,
            finished: DATA_TYPES.DATEONLY
        },
        options: {
            freezeTableName: true
        }
    }
};
const mockedConfig = {
    models: mockedModels,
    database: 'bookstore',
    username: 'dev',
    password: '123456',
    dialect: 'mysql'
};

describe('Orm class', () => {
    it('should return an Orm instance' , () => {
        const database = new Orm(mockedConfig);
        const expectedProperties = ['conn', 'models'];

        expect(database).toBeInstanceOf(Orm);
        expect(database.conn).toBeInstanceOf(Sequelize);
        expect(Object.keys(database)).toEqual(expect.arrayContaining(expectedProperties));
    });

    it('should throw when trying to get a model that does not exist', () => {
        const database = new Orm(mockedConfig);

        expect(() => database.getModel('invalid')).toThrowError(/\[invalid\] model doesn't exist/);
    })

    it('should set the models', () => {
        const database = new Orm(mockedConfig);
        const expectedModels = Object.keys(mockedConfig.models);

        expect(Object.keys(database.models)).toEqual(expectedModels);
    });

    it('should not set the models', () => {
        const { models, ...noModelsConfig } = mockedConfig; // eslint-disable-line no-unused-vars
        const database = new Orm(noModelsConfig);

        expect(Object.keys(database.models)).toEqual([]);
    });

    it('should be able to get a valid model', () => {
        const database = new Orm(mockedConfig);
        const userModel = database.getModel('User');

        expect(userModel).toBeInstanceOf(Function);
    });

    describe('Internal Sequelize methods', () => {
        let myDb;

        beforeEach(() => {
            myDb = new Orm(mockedConfig);
        });

        afterEach(() => {
            myDb = null;
        });

        it('should call Sequelize [sync] method', () => {
            myDb.conn.sync = jest.fn();
            myDb.init();

            expect(myDb.conn.sync).toHaveBeenCalledTimes(1);
        });

        it('should call Sequelize [authenticate] method', () => {
            myDb.conn.authenticate = jest.fn();
            myDb.testConnection();

            expect(myDb.conn.authenticate).toHaveBeenCalledTimes(1);
        });

        it('should call Sequelize [close] method', () => {
            myDb.conn.close = jest.fn();
            myDb.close();

            expect(myDb.conn.close).toHaveBeenCalledTimes(1);
        });

        it('should call Sequelize [query] method', () => {
            myDb.conn.query = jest.fn();
            myDb.query('SELECT 1', {});

            expect(myDb.conn.query).toHaveBeenCalledTimes(1);
        });
    });
});
