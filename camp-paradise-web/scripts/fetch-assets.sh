#!/usr/bin/env bash
#
# Downloads the original Camp Paradise media from the live site and produces
# optimized, responsive assets under static/media and static/video.
#
# Images not hosted on the live site are committed under assets/raw and listed
# in LOCAL_IMAGES; they go through the same optimization pipeline.
#
# Requires: curl, magick (ImageMagick), ffmpeg. Run from the app root:
#   npm run assets
#
set -euo pipefail

BASE="https://www.camp-paradise.org/static/media"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
RAW="$ROOT/.assets-raw"
IMG_OUT="$ROOT/static/media"
VID_OUT="$ROOT/static/video"

mkdir -p "$RAW" "$IMG_OUT" "$VID_OUT"

# slug -> hashed source filename on the live site
declare -a IMAGES=(
  "chapel:chapel.a021a355.jpg"
  "kitchen:kitchen.aec0ce22.jpg"
  "lodging:lodging.be38fa9c.jpg"
  "sauna:sauna.f17dde50.JPG"
  "leader-ben:ben.2af983b9.jpg"
  "leader-tim:tim.ef49bfa9.jpg"
  "leader-victor:victor.9cef9026.jpeg"
  "leader-family:family.6c81b107.jpeg"
  "gallery-01:2.1cb533c1.jpg"
  "gallery-02:3.7d4813e2.jpg"
  "gallery-03:5.4faab999.jpg"
  "gallery-04:8.63b72dc2.jpg"
  "gallery-05:14.5de439e8.jpg"
  "gallery-06:16.3bd81dcb.JPG"
  "gallery-07:19.c6847f6e.jpg"
  "gallery-08:22.028bb421.jpg"
  "gallery-09:25.33712b5c.jpg"
  "gallery-10:27.495272a2.jpg"
  "gallery-11:28.3fba7b61.jpg"
  "gallery-12:31.c7d5c3fd.jpg"
  "gallery-13:200.956ba9a5.jpg"
  "gallery-14:201.073bd0d2.jpg"
  "gallery-15:206.707ecb34.JPG"
  "gallery-16:2copy.19291b4f.jpg"
  "gallery-17:6copy.6ea66ee1.jpg"
  "gallery-18:7copy.752e4317.jpg"
)

# slug -> file under assets/raw (committed originals, ~2400px, EXIF stripped)
declare -a LOCAL_IMAGES=(
  "cabins:cabins.jpg"
  "tents:tents.jpg"
)

VIDEO_SRC="Retreat.2e757472.mp4"

download() {
  local url="$1" dest="$2"
  if [[ -f "$dest" ]]; then
    echo "  cached $(basename "$dest")"
  else
    echo "  fetch  $(basename "$dest")"
    curl -fsSL "$url" -o "$dest"
  fi
}

echo "==> Downloading originals"
for entry in "${IMAGES[@]}"; do
  slug="${entry%%:*}"
  file="${entry##*:}"
  download "$BASE/$file" "$RAW/$slug.orig"
done
download "$BASE/$VIDEO_SRC" "$RAW/retreat.orig.mp4"
for entry in "${LOCAL_IMAGES[@]}"; do
  slug="${entry%%:*}"
  file="${entry##*:}"
  cp "$ROOT/assets/raw/$file" "$RAW/$slug.orig"
  echo "  local  $file"
done

echo "==> Optimizing images (avif + webp + jpg, widths 640/1280/1920)"
for entry in "${IMAGES[@]}" "${LOCAL_IMAGES[@]}"; do
  slug="${entry%%:*}"
  src="$RAW/$slug.orig"
  for w in 640 1280 1920; do
    magick "$src" -auto-orient -strip -resize "${w}x${w}>" -quality 80 "$IMG_OUT/$slug-${w}w.jpg"
    magick "$src" -auto-orient -strip -resize "${w}x${w}>" -quality 62 "$IMG_OUT/$slug-${w}w.avif"
    magick "$src" -auto-orient -strip -resize "${w}x${w}>" -quality 78 "$IMG_OUT/$slug-${w}w.webp"
  done
  echo "  done   $slug"
done

# Hero video is a silent background LOOP: trim to a 20s clip starting at 4s.
CLIP_START=4
CLIP_LEN=20
echo "==> Encoding hero video (${CLIP_LEN}s 720p loop, mp4 + webm + poster)"
# Poster from the clip start
ffmpeg -y -ss "$CLIP_START" -i "$RAW/retreat.orig.mp4" -frames:v 1 -q:v 3 "$VID_OUT/retreat-poster.jpg" 2>/dev/null
magick "$VID_OUT/retreat-poster.jpg" -strip -quality 60 "$VID_OUT/retreat-poster.avif"
magick "$VID_OUT/retreat-poster.jpg" -strip -quality 76 "$VID_OUT/retreat-poster.webp"

# 720p H.264 (broad support), muted, no audio track
ffmpeg -y -ss "$CLIP_START" -t "$CLIP_LEN" -i "$RAW/retreat.orig.mp4" -an -vf "scale=-2:720" \
  -c:v libx264 -profile:v high -crf 28 -preset slow -movflags +faststart \
  "$VID_OUT/retreat-720.mp4" 2>/dev/null

# 720p WebM (VP9)
ffmpeg -y -ss "$CLIP_START" -t "$CLIP_LEN" -i "$RAW/retreat.orig.mp4" -an -vf "scale=-2:720" \
  -c:v libvpx-vp9 -crf 37 -b:v 0 -row-mt 1 -deadline good \
  "$VID_OUT/retreat-720.webm" 2>/dev/null

# Logo + favicons + PWA icons, all derived from the real Camp Paradise emblem.
LOGO_SRC="Logo.7be05888.png"
FOREST="#0f3d2e"
echo "==> Building logo, favicons and PWA icons"
download "$BASE/$LOGO_SRC" "$RAW/logo.orig.png"
# Trim transparent margins, pad back to a centered transparent square.
magick "$RAW/logo.orig.png" -trim +repage -resize 480x480 \
  -background none -gravity center -extent 512x512 "$RAW/logo-square.png"

# Transparent color logo for nav/footer on dark backgrounds.
magick "$RAW/logo-square.png" -resize 512x512 "$ROOT/static/logo.png"
magick "$RAW/logo-square.png" -resize 512x512 "$ROOT/static/logo.webp"

# Browser tab favicons (transparent).
magick "$RAW/logo-square.png" -resize 256x256 "$ROOT/static/favicon.png"
magick "$RAW/logo-square.png" -define icon:auto-resize=16,32,48 "$ROOT/static/favicon.ico"

# iOS home-screen icon (no transparency: flatten on forest green).
magick "$RAW/logo-square.png" -background "$FOREST" -flatten \
  -resize 180x180 "$ROOT/static/apple-touch-icon.png"

# PWA icons on forest background.
mkdir -p "$ROOT/static/icons"
magick "$RAW/logo-square.png" -background "$FOREST" -flatten \
  -resize 192x192 "$ROOT/static/icons/icon-192.png"
magick "$RAW/logo-square.png" -background "$FOREST" -flatten \
  -resize 512x512 "$ROOT/static/icons/icon-512.png"
# Maskable: emblem within the safe zone (~62%) on a full forest canvas.
magick "$RAW/logo-square.png" -resize 320x320 \
  -background "$FOREST" -gravity center -extent 512x512 \
  "$ROOT/static/icons/icon-maskable-512.png"

echo "==> Done. Output sizes:"
du -sh "$IMG_OUT" "$VID_OUT"
ls -la "$ROOT/static"/logo.png "$ROOT/static"/favicon.* "$ROOT/static"/apple-touch-icon.png "$ROOT/static/icons"/*.png
