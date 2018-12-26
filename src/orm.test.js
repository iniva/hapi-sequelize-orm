/* global jest describe it expect */

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

    it('should be able to get a valid model', () => {
        const database = new Orm(mockedConfig);
        const userModel = database.getModel('User');

        expect(userModel).toBeInstanceOf(Function);
    });
});
