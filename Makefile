SHELL=/bin/bash

.PHONY: all
all: clean dist_chrome.zip dist_firefox.zip

.PHONY: clean
clean:
	$(RM) -r dist dist_chrome.zip dist_firefox.zip

dist:
	mkdir -p dist

dist/background.js dist/content.js: dist
	grep -vE "///|@ts-|@type" $(notdir $@) > $@

dist/LICENSE dist/README.md dist/icon16.png dist/icon48.png dist/icon96.png dist/icon128.png: dist
	cp $(notdir $@) $@

.PHONY: chrome_manifest
chrome_manifest: dist
	cp manifest_chrome.json dist/manifest.json

.PHONY: firefox_manifest
firefox_manifest: dist
	cp manifest_firefox.json dist/manifest.json

dist_chrome.zip: chrome_manifest dist/LICENSE dist/README.md dist/background.js dist/content.js dist/icon16.png dist/icon48.png dist/icon96.png dist/icon128.png
	(cd dist && zip -r ../$@ .)

dist_firefox.zip: firefox_manifest dist/LICENSE dist/README.md dist/background.js dist/content.js dist/icon16.png dist/icon48.png dist/icon96.png dist/icon128.png
	(cd dist && zip -r ../$@ .)
