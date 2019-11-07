#!/bin/bash
#
# A script used to tag a commit and kickoff the deployment workflow
#
# Release tag: VERSION.YYYYMMDD.SHA-1
#
# Usage: $ ./git-tag.sh

set -eu

# Change working directory .circleci
project_root=$(git rev-parse --show-toplevel)
cd "${project_root}/.circleci"

# Ensure on master branch
branch=$(git rev-parse --abbrev-ref HEAD)
if [[ "${branch}" != "master" ]]; then
  echo "You may only tag a commit on the 'master' branch"
  exit 1;
fi

# Get upstream release tags only (descending order)
RELEASES=( $(git tag --sort=-creatordate | awk '/^[0-9]+(\.[0-9]+){2}$/') ) # X.Y.Z

# Get latest tagged release upstream
release="${RELEASES[0]}"

date=$(date +%Y%m%d)
sha=$(git log --pretty=format:'%h' -n 1)

# Tag in the format VERSION.YYYYMMDD.SHA-1 (ex: 0.1.0.20190213.a9e469e)
tag="${release}.${date}.${sha}"

# Tag commit
git tag -a "${tag}" -m "marquez-web ${tag}"

# Push tag to Github
git push origin "${tag}"

echo "Follow the status of the release here: 'https://circleci.com/gh/WeConnect/workflows/marquez-web'"
