/// <reference path="../pb_data/types.d.ts" />
migrate(
  app => {
    const collection = app.findCollectionByNameOrId('_pb_users_auth_');

    // update collection data
    unmarshal(
      {
        oauth2: {
          mappedFields: {
            name: ''
          }
        }
      },
      collection
    );

    // add field
    collection.fields.addAt(
      8,
      new Field({
        hidden: false,
        id: 'select1466534506',
        maxSelect: 1,
        name: 'role',
        presentable: false,
        required: false,
        system: false,
        type: 'select',
        values: ['user', 'admin']
      })
    );

    // update field
    collection.fields.addAt(
      6,
      new Field({
        autogeneratePattern: '',
        hidden: false,
        id: 'text1579384326',
        max: 255,
        min: 0,
        name: 'username',
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
    const collection = app.findCollectionByNameOrId('_pb_users_auth_');

    // update collection data
    unmarshal(
      {
        oauth2: {
          mappedFields: {
            name: 'name'
          }
        }
      },
      collection
    );

    // remove field
    collection.fields.removeById('select1466534506');

    // update field
    collection.fields.addAt(
      6,
      new Field({
        autogeneratePattern: '',
        hidden: false,
        id: 'text1579384326',
        max: 255,
        min: 0,
        name: 'name',
        pattern: '',
        presentable: false,
        primaryKey: false,
        required: false,
        system: false,
        type: 'text'
      })
    );

    return app.save(collection);
  }
);
