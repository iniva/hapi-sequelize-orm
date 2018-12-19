import { DataTypes, QueryTypes } from 'sequelize';

export const ASSOCIATION_TYPES = {
    hasMany: 'hasMany',
    belongsTo: 'belongsTo',
    hasOne: 'hasOne',
    belongsToMany: 'belongsToMany'
};

export const DATA_TYPES = DataTypes;

export const QUERY_TYPES = QueryTypes;