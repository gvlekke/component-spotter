#!/bin/sh
# Renders the listing images from src/*.html with headless Chrome.
set -e
cd "$(dirname "$0")"
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
shot() { # out width height url
  "$CHROME" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
    --virtual-time-budget=4000 --window-size="$2,$3" --screenshot="$PWD/$1" "$4" 2>/dev/null
}
SRC="file://$PWD/src"
shot icon.png 128 128 "$SRC/icon.html"
cp icon.png src/icon.png
shot cover.png 1920 1080 "$SRC/slides.html?s=cover"
i=1
for s in list variants library select; do
  shot "carousel-$i-$s.png" 1920 1080 "$SRC/slides.html?s=$s"
  i=$((i+1))
done
echo "Rendered: $(ls *.png | tr '\n' ' ')"
