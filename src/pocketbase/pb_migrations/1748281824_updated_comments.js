/// <reference path="../pb_data/types.d.ts" />
migrate(
  app => {
    const collection = app.findCollectionByNameOrId('pbc_533777971');

    // update field
    collection.fields.addAt(
      1,
      new Field({
        cascadeDelete: false,
        collectionId: 'pbc_1125843985',
        hidden: false,
        id: 'relation1519021197',
        maxSelect: 1,
        minSelect: 0,
        name: 'post',
        presentable: true,
        required: false,
        system: false,
        type: 'relation'
      })
    );

    return app.save(collection);
  },
  app => {
    const collection = app.findCollectionByNameOrId('pbc_533777971');

    // update field
    collection.fields.addAt(
      1,
      new Field({
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
      })
    );

    return app.save(collection);
  }
);
