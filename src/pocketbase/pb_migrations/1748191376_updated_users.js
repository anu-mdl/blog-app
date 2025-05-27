/// <reference path="../pb_data/types.d.ts" />
migrate(
  app => {
    const collection = app.findCollectionByNameOrId('_pb_users_auth_');

    // add field
    collection.fields.addAt(
      9,
      new Field({
        autogeneratePattern: '',
        hidden: false,
        id: 'text3709889147',
        max: 0,
        min: 0,
        name: 'bio',
        pattern: '',
        presentable: false,
        primaryKey: false,
        required: false,
        system: false,
        type: 'text'
      })
    );

    // add field
    collection.fields.addAt(
      10,
      new Field({
        hidden: false,
        id: 'json1755560041',
        maxSize: 0,
        name: 'socials',
        presentable: false,
        required: false,
        system: false,
        type: 'json'
      })
    );

    return app.save(collection);
  },
  app => {
    const collection = app.findCollectionByNameOrId('_pb_users_auth_');

    // remove field
    collection.fields.removeById('text3709889147');

    // remove field
    collection.fields.removeById('json1755560041');

    return app.save(collection);
  }
);
