/// <reference path="../pb_data/types.d.ts" />
migrate(
  app => {
    const collection = new Collection({
      createRule: null,
      deleteRule: null,
      fields: [
        {
          autogeneratePattern: '[a-z0-9]{15}',
          hidden: false,
          id: 'text3208210256',
          max: 15,
          min: 15,
          name: 'id',
          pattern: '^[a-z0-9]+$',
          presentable: false,
          primaryKey: true,
          required: true,
          system: true,
          type: 'text'
        },
        {
          cascadeDelete: false,
          collectionId: '_pb_users_auth_',
          hidden: false,
          id: 'relation2375276105',
          maxSelect: 1,
          minSelect: 0,
          name: 'user',
          presentable: false,
          required: false,
          system: false,
          type: 'relation'
        },
        {
          cascadeDelete: false,
          collectionId: 'pbc_1125843985',
          hidden: false,
          id: 'relation1519021197',
          maxSelect: 1,
          minSelect: 0,
          name: 'post',
          presentable: false,
          required: false,
          system: false,
          type: 'relation'
        }
      ],
      id: 'pbc_2190274710',
      indexes: [],
      listRule: null,
      name: 'likes',
      system: false,
      type: 'base',
      updateRule: null,
      viewRule: null
    });

    return app.save(collection);
  },
  app => {
    const collection = app.findCollectionByNameOrId('pbc_2190274710');

    return app.delete(collection);
  }
);
