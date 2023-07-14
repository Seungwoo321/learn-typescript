#!/usr/bin/env sh
set -e

rm -rf dist
npm run build

cd dist

git init 
git config --local user.name "Seungwoo Lee"
git config --local user.email "seungwoo321@gmail.com"
git add -A
git commit -m "deploy for learn-typescript-project-11"
git push -f git@github.com:Seungwoo321/learn-typescript.git main:gh-pages
cd -