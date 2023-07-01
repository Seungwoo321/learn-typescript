#!/usr/bin/env sh
set -e

git init 
git config --local user.name "Seungwoo Lee"
git config --local user.email "seungwoo321@gmail.com"
git add -A
git commit -m "deploy for learn-typescript-project"
git push -f git@github.com:Seungwoo321/learn-typescript.git main:gh-pages
rm -rf .git