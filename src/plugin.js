/* eslint-disable no-console */
import { name, version } from '../package';
import Orm from './orm';
import { hasOwnProperty } from './helpers'

export default {
    name,
    version,
    register: async (server, { databases }) => {
        const getDb = dbName => {
            if (!dbName) {
                throw new Error(`${name}: You must provide a database name`);
            }

            const instancePlugin = `${name}:${dbName}`;

            if (!hasOwnProperty(server, instancePlugin)) {
                throw new Error(`${name}: There's no [${dbName}] database`);
            }

            return server[instancePlugin];
        };

        for (const dbName in databases) {
            try {
                const instance = new Orm(databases[dbName]);

                await instance.testConnection();
                await instance.init();

                server.decorate('server', `${name}:${dbName}`, instance);
                console.log(`${name}: [${dbName}] database initialized`);
            }
            catch (error) {
                console.log(`${name}: Could not initialize plugin for [${dbName}] database`);
                throw error;
            }
        }

        server.decorate('server', name, { getDb });
    }
}