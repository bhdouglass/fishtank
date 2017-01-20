#!/bin/bash

cd ..
LINKS=false SKIP_LINT=true ./node_modules/.bin/gulp build

mkdir -p build/tmp/
cp -r www/ build/tmp/
cp click/* build/tmp/
cp click/manifest.json build/
