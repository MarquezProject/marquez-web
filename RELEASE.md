# Setup
   
1. Add [MarquezProject/marquez-web](https://github.com/MarquezProject/marquez-web) as a remote:

   ```
   $ git remote add upstream "git@github.com:MarquezProject/marquez-web.git"
   ```
   
2. Verify that git remotes are correct:

   ```
   $ git remote -v
   ```
   
   This should output:
   
   ```
   origin	git@github.com:WeConnect/marquez-web.git (fetch)
   origin	git@github.com:WeConnect/marquez-web.git (push)
   upstream	git@github.com:MarquezProject/marquez-web.git (fetch)
   upstream	git@github.com:MarquezProject/marquez-web.git (push)
   ```
   
3. Then, you need to define the following merge strategy when fetching upstream changes:

   ```
   $ git config --global merge.ours.driver true
   ```

# Releasing

1. Fetch upstream changes:

   ```
   $ git fetch upstream
   ```
   
2. Merge and push changes:

   ```
   $ git merge upstream/master
   $ git push origin master
   ```
   
3. Tag a release:

   ```
   $ ./.circleci/git-tag.sh
   ```
   
   Open [https://circleci.com/gh/WeConnect/workflows/marquez-web](https://circleci.com/gh/WeConnect/workflows/marquez-web) to follow the status of the release.
