/// <reference path="../pb_data/types.d.ts" />
migrate(
  app => {
    const collection = app.findCollectionByNameOrId('pbc_1125843985');

    // add field
    collection.fields.addAt(
      9,
      new Field({
        autogeneratePattern: '',
        hidden: false,
        id: 'text1591429585',
        max: 0,
        min: 0,
        name: 'excerpt',
        pattern: '',
        presentable: false,
        primaryKey: false,
        required: false,
        system: false,
        type: 'text'
      })
    );

    return app.save(collection);
  },
  app => {
    const collection = app.findCollectionByNameOrId('pbc_1125843985');

    // remove field
    collection.fields.removeById('text1591429585');

    return app.save(collection);
  }
);
