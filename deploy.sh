#!/bin/bash

SOURCE_BRANCH="master"
TARGET_BRANCH="gh-pages"
LOCAL_TARGET_BRANCH="local-pages"

# Pull requests and commits to other branches shouldn't try to deploy.
if [ "$TRAVIS_PULL_REQUEST" != "false" -o "$TRAVIS_BRANCH" != "$SOURCE_BRANCH" ]; then
    echo "Skipping deploy; The request or commit is not on master"
    exit 0
fi

# Save some useful information
REPO=`git config remote.origin.url`
SSH_REPO=${REPO/https:\/\/github.com\//git@github.com:}
SHA=`git rev-parse --verify HEAD`

ENCRYPTED_KEY_VAR="encrypted_${ENCRYPTION_LABEL}_key"
ENCRYPTED_IV_VAR="encrypted_${ENCRYPTION_LABEL}_iv"
ENCRYPTED_KEY=${!ENCRYPTED_KEY_VAR}
ENCRYPTED_IV=${!ENCRYPTED_IV_VAR}
openssl aes-256-cbc -K $ENCRYPTED_KEY -iv $ENCRYPTED_IV -in deploy_key.enc -out ../deploy_key -d

chmod 600 ../deploy_key
eval `ssh-agent -s`
ssh-add ../deploy_key

# Cloning the source branch only of repository to repo/ directory,
# Creating gh-pages branch if it doesn't exists else moving to that branch
git clone --single-branch --branch $SOURCE_BRANCH $REPO repo

# Setting up the username and email.
git config user.name "Travis CI"
git config user.email "$COMMIT_AUTHOR_EMAIL"

cd repo

# Actual building and setup of current push or PR.
npm install
npm run build
mv build ../build/

# Create an orphan target branch
git checkout --orphan $TARGET_BRANCH
# Remove all the files that were checked out from source branch
git rm -rf .
mv ../build/* .
cp index.html 404.html
rm -Rf node_modules/ package-lock.json

# Create a commit on target branch
git add --all
git commit -m "Travis CI Clean Deploy : ${SHA}"

# There are changes in the Build; push the changes to gh-pages
echo "There are changes in the Build; pushing the changes to gh-pages"

# Actual push to gh-pages branch via Travis
git push --force $SSH_REPO $TARGET_BRANCH



# Deploying to local-pages
git checkout $SOURCE_BRANCH

npm install
export REACT_APP_API_URL=http://localhost:4000
export REACT_APP_LOCAL_ENV=true
npm run build
mv build ../

# Create an orphan local target branch
git checkout --orphan $LOCAL_TARGET_BRANCH
# Remove all the files that were checked out from source branch
git rm -rf .
mv ../build/* .
cp index.html 404.html
rm -Rf node_modules/ package-lock.json

# Create a commit on target branch
git add --all
git commit -m "Travis CI Clean Deploy : ${SHA}"

# There are changes in the Build; push the changes to local-pages
echo "There are changes in the Build; pushing the changes to local-pages"

# Actual push to gh-pages branch via Travis
git push --force $SSH_REPO $LOCAL_TARGET_BRANCH
