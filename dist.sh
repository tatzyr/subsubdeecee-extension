#!/bin/bash

mkdir dist
rm dist/*
cp background.js content.js icon48.png icon96.png LICENSE manifest.json README.md dist
pushd dist
zip -r ../dist.zip *
popd
