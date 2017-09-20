node_modules/.bin/tsc -p src/tsconfig.server.json
cp -R src/assets dist
cp -R src/css dist
cp src/firebase-sa.json dist
cp src/services/posts.json dist/services
cp -R src/articles dist/
