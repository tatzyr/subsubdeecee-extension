#!/bin/bash

set -euxo pipefail

rm -f dist.zip
mkdir -p dist
rm dist/*
cp background.js content.js icon16.png icon48.png icon96.png icon128.png manifest.json dist
pushd dist
zip -r ../dist.zip *
popd
