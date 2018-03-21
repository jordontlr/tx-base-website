remove-build:
	-rm -rf dist

deploy:
    git remote set-url heroku https://git.heroku.com/tx-base-website.git/
	git branch -D deploy
	git checkout -b deploy
	donejs build
	git add -f dist
	git commit -m "deploy with build artifacts"
	git push heroku deploy:master
	git checkout master
	git branch -D deploy
