
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

start: db
	@bin/www | garnish

watch:
	@onchange 'db/**/*.yml' -- make db & \
		nodemon -q -x 'bin/www | garnish'

db: db.json

clean:
	@rm db.json

#
# Targets
#

db.json: $(DATA)
	@bin/seed
