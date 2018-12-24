/* eslint-disable no-console */
import { name, version } from '../package';
import Orm from './orm';

export default {
    name,
    version,
    register: async (server, { databases }) => {
        const getDb = dbName => {
            console.log(server);
            console.log(dbName);
        };

        for (const dbName in databases) {
            try {
                const instance = new Orm(databases[dbName]);

                await instance.testConnection();
                await instance.init();

                server.decorate('server', `${name}:${dbName}`);
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