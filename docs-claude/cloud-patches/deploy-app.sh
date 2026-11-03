#!/bin/sh
# Deploys farin-english main:app to the live English app repo (farinrasuli/farin-english-app, main), from the COMMITTED tree only.
# Usage: sh docs-claude/cloud-patches/deploy-app.sh "<commit message>"   (run after merging cloud-work into main)
set -e
SRC=/home/user/farin-english; APP=/home/user/farin-english-app; TMP=$(mktemp -d)
git -C "$APP" fetch -q origin main && git -C "$APP" checkout -q -B main origin/main
git -C "$SRC" archive --format=tar main:app | tar -x -C "$TMP"
git --git-dir="$APP/.git" --work-tree="$TMP" add -A
git --git-dir="$APP/.git" --work-tree="$TMP" -c user.name=farinrasuli -c user.email=farinrasuli@gmail.com commit -qm "$1" || { echo "nothing to deploy"; exit 0; }
git -C "$APP" reset -q --hard HEAD
[ "$(git -C "$APP" rev-parse 'HEAD^{tree}')" = "$(git -C "$SRC" rev-parse main:app)" ] || { echo "tree mismatch"; exit 1; }
git -C "$APP" push -q origin main && echo "deployed $(git -C "$APP" rev-parse --short HEAD)"
rm -rf "$TMP"
