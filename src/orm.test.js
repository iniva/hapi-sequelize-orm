/* global jest describe it expect */

import Sequelize from 'sequelize';

import Orm from './orm';

jest.mock('sequelize');

describe('Orm class', () => {
    it('should return an Orm instance' , () => {
        const database = new Orm({});
        const expectedProperties = ['conn', 'models'];

        expect(database).toBeInstanceOf(Orm);
        expect(database.conn).toBeInstanceOf(Sequelize);
        expect(Object.keys(database)).toEqual(expect.arrayContaining(expectedProperties));
    });
});
