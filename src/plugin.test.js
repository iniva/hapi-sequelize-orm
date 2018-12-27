/* global jest beforeEach describe it expect */

import Hapi from 'hapi';

import plugin from './plugin';
import Orm from './orm';

jest.mock('./orm');

const mockedConfig = {
    bookstore: {
        models: {},
        database: 'bookstore',
        username: 'dev',
        password: '123456',
        dialect: 'mysql'
    }
};
let server;

describe('HapiJS Plugin', () => {
    beforeEach(() => {
        server = Hapi.Server({ port: 8080 });
    });

    it('should register the plugin', async () => {
        await server.register({
            plugin,
            options: {
                databases: {}
            }
        });

        expect(Object.keys(server.registrations)).toEqual(expect.arrayContaining([plugin.name]));
    });

    it('should throw when trying use getDb without a database name', async () => {
        await server.register({
            plugin,
            options: {
                databases: {}
            }
        });

        expect(() => server[plugin.name].getDb())
            .toThrowError(/hapi-sequelize-orm: You must provide a database name/);
    });

    it('should throw when trying to get a database taht is not registered', async () => {
        await server.register({
            plugin,
            options: {
                databases: mockedConfig
            }
        });

        expect(() => server[plugin.name].getDb('myDB'))
            .toThrowError(/hapi-sequelize-orm: There's no \[myDB\] database/);
    });

    it('should get an instance of Orm', async () => {
        await server.register({
            plugin,
            options: {
                databases: mockedConfig
            }
        });

        const database = server[plugin.name].getDb('bookstore');

        expect(database).toBeInstanceOf(Orm);
    });

    it('should throw when connection to database fails', async () => {
        Orm.mockImplementation(() => {
            throw new Error('Test rejection');
        });

        try {
            await server.register({
                plugin,
                options: {
                    databases: mockedConfig
                }
            });
        }
        catch(error) {
            expect(error.message).toMatch(/Test rejection/);
        }
    });
});
