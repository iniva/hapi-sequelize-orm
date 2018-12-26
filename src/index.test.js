/* global describe it expect */

import * as library from './';
import Orm from './orm';
import plugin from './plugin';
import {
    ASSOCIATION_TYPES,
    DATA_TYPES,
    QUERY_TYPES
} from './types';

describe('Sequelize ORM Library', () => {
    it('should export the Orm class, the plugin and the types', () => {
        expect(library.Orm).toEqual(Orm);
        expect(library.plugin).toEqual(plugin);
        expect(library.ASSOCIATION_TYPES).toEqual(ASSOCIATION_TYPES);
        expect(library.DATA_TYPES).toEqual(DATA_TYPES);
        expect(library.QUERY_TYPES).toEqual(QUERY_TYPES);
    });
});