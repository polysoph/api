
#
# Binaries
#

BIN := ./node_modules/.bin

#
# Variables
#

PORT ?= 5000

DATA = $(shell find ./db -type f -name '*.yml')

#
# Tasks
#

start: install db
	@bin/www | garnish

start\:production:
	@node --harmony_destructuring bin/www

deploy:
	@git add -f db.json
	@git commit -m "Auto-commit: Updating database"
	@git push dokku master

watch:
	@onchange 'db/**/*.yml' -- make db & \
		nodemon -q -x 'bin/www | garnish'

db: db.json

clean:
	@rm db.json

#
# Shorthands
#

install: node_modules

#
# Targets
#

node_modules: package.json
	@npm install

db.json: $(DATA)
	@bin/seed
