/// <reference path="../pb_data/types.d.ts" />
migrate(
  app => {
    const collection = app.findCollectionByNameOrId('pbc_1125843985');

    // add field
    collection.fields.addAt(
      7,
      new Field({
        hidden: false,
        id: 'json1077128922',
        maxSize: 0,
        name: 'tableOfContents',
        presentable: false,
        required: false,
        system: false,
        type: 'json'
      })
    );

    return app.save(collection);
  },
  app => {
    const collection = app.findCollectionByNameOrId('pbc_1125843985');

    // remove field
    collection.fields.removeById('json1077128922');

    return app.save(collection);
  }
);
