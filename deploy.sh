#!/bin/bash

SOURCE_BRANCH="master"
TARGET_BRANCH="gh-pages"

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

# Cloning the repository to repo/ directory,
# Creating gh-pages branch if it doesn't exists else moving to that branch
git clone $REPO repo
cd repo
git checkout $TARGET_BRANCH || git checkout --orphan $TARGET_BRANCH
cd ..

# Setting up the username and email.
git config user.name "Travis CI"
git config user.email "$COMMIT_AUTHOR_EMAIL"

# Cleaning up the old repo's gh-pages branch except CNAME file and 404.html
find repo/* ! -name "CNAME" ! -name "404.html" -maxdepth 1  -exec rm -rf {} \; 2> /dev/null
cd repo

git add --all
git commit -m "Travis CI Clean Deploy : ${SHA}"

git checkout $SOURCE_BRANCH

# Actual building and setup of current push or PR.
npm install
npm run build
mv build ../build/

git checkout $TARGET_BRANCH
rm -rf node_modules/
mv ../build/* .
cp index.html 404.html

# Staging the new build for commit; and then commiting the lastest build
git add -A
git commit --amend --no-edit --allow-empty

# Deploying only if the build has changed
if [ -z `git diff --name-only HEAD HEAD~1` ]; then

  echo "No Changes in the Build; exiting"
  exit 0

else
  # There are changes in the Build; push the changes to gh-pages
  echo "There are changes in the Build; pushing the changes to gh-pages"

  # Actual push to gh-pages branch via Travis
  git push --force $SSH_REPO $TARGET_BRANCH
fi
