import Sequelize from 'sequelize';

export default class Orm {
    constructor(options) {
        const { models = {}, ...config } = options;
        const settings = {
            operatorsAliases: false,
            logging: false,
            ...config
        };

        this.conn = new Sequelize(settings);
        this.models = {};

        this.setModels(models);
        this.setAssociations(models);
    }

    setModels(models) {
        for (const modelName in models) {
            const { name, definition, options = {}} = models[modelName];

            this.models[name] = this.conn.define(name, definition, options);
        }
    }

    getModel(model) {
        if (!this.models.hasOwnProperty(model)) {
            throw new Error(`[${model}] model doesn't exist`);
        }

        return this.models[model];
    }

    setAssociations(models) {
        for (const modelName in models) {
            const model = models[modelName];

            if (model.hasOwnProperty('associations')) {
                model.associations.forEach(({ type, target, options }) => {
                    this.models[model.name].associate = (models, type, target, options = {}) => {
                        return this.models[model.name][type](models[target], options);
                    };
                    this.models[model.name].associate(this.models, type, target, options);
                });
            }
        }
    }

    async init() {
        return this.conn.sync();
    }

    async testConnection() {
        return this.conn.authenticate();
    }

    async close() {
        return this.conn.close();
    }

    async destroy(model, options = {}) {
        return this.getModel(model).destroy(options);
    }

    async query(query, options) {
        return this.conn.query(query, options);
    }

    async bulkCreate(model, options) {
        return this.getModel(model).bulkCreate(options.data);
    }

    async findOne(model, options) {
        return this.getModel(model).findOne(options);
    }

    async findById(model, id) {
        return this.getModel(model).findById(id);
    }

    async findAll(model, options = {}) {
        return this.getModel(model).findAll(options);
    }
}