remove-build:
	-rm -rf dist

heroku-remote
	-git remote add heroku https://git.heroku.com/tx-base-website.git/

heroku-deploy:
	-git branch -D deploy
	git checkout -b deploy
	donejs build
	git add -f dist
	git commit -m "deploy with build artifacts"
	git push -f heroku deploy:master
	git checkout master
	git branch -D deploy
