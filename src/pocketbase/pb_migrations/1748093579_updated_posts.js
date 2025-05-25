/// <reference path="../pb_data/types.d.ts" />
migrate(
  app => {
    const collection = app.findCollectionByNameOrId('pbc_1125843985');

    // update field
    collection.fields.addAt(
      2,
      new Field({
        cascadeDelete: false,
        collectionId: '_pb_users_auth_',
        hidden: false,
        id: 'relation3182418120',
        maxSelect: 1,
        minSelect: 0,
        name: 'author',
        presentable: true,
        required: false,
        system: false,
        type: 'relation'
      })
    );

    return app.save(collection);
  },
  app => {
    const collection = app.findCollectionByNameOrId('pbc_1125843985');

    // update field
    collection.fields.addAt(
      2,
      new Field({
        cascadeDelete: false,
        collectionId: '_pb_users_auth_',
        hidden: false,
        id: 'relation3182418120',
        maxSelect: 1,
        minSelect: 0,
        name: 'author',
        presentable: false,
        required: false,
        system: false,
        type: 'relation'
      })
    );

    return app.save(collection);
  }
);
