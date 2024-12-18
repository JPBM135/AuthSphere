name="$1"

if [ -z "$name" ]; then
  echo "Please provide a name for the migration"
  exit 1
fi

ENV=default

if [ -n "$2" ]; then
  ENV="$2"
fi

npx knex migrate:make "$name" --env "$ENV"

FOLDER_PATH="./migrations"

if [ "$ENV" = "secure" ]; then
  FOLDER_PATH="./migrations-keys"
fi

created_migration=$(ls -t $FOLDER_PATH | head -1)

mv "$FOLDER_PATH/$created_migration" "$FOLDER_PATH/${created_migration%.js}.mjs"