#!/usr/bin/env sh

# abort on errors
set -e

# build
npm run build

# navigate into the build output directory
cd dist

git init
git add -A
git commit -m 'deploy'

# deploying to https://lnq99.github.io/computer-graphic
git push -f git@github.com:lnq99/computer-graphic.git master:gh-pages

cd -