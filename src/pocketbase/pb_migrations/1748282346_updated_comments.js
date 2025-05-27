/// <reference path="../pb_data/types.d.ts" />
migrate(
  app => {
    const collection = app.findCollectionByNameOrId('pbc_533777971');

    // add field
    collection.fields.addAt(
      4,
      new Field({
        cascadeDelete: false,
        collectionId: 'pbc_533777971',
        hidden: false,
        id: 'relation2684380970',
        maxSelect: 999,
        minSelect: 0,
        name: 'replies',
        presentable: false,
        required: false,
        system: false,
        type: 'relation'
      })
    );

    return app.save(collection);
  },
  app => {
    const collection = app.findCollectionByNameOrId('pbc_533777971');

    // remove field
    collection.fields.removeById('relation2684380970');

    return app.save(collection);
  }
);
