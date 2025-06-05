/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2190274710")

  // update collection data
  unmarshal({
    "indexes": [
      "CREATE UNIQUE INDEX `idx_aRVzIG0Zfg` ON `likes` (\n  `user`,\n  `post`\n)"
    ]
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2190274710")

  // update collection data
  unmarshal({
    "indexes": [
      "CREATE INDEX `idx_aRVzIG0Zfg` ON `likes` (\n  `user`,\n  `post`\n)"
    ]
  }, collection)

  return app.save(collection)
})
