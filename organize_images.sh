#!/bin/bash
# organize_images.sh - 建立 images/ 子資料夾結構

IMAGES_DIR="$(cd "$(dirname "$0")" && pwd)/images"
cd "$IMAGES_DIR" || exit 1

# 建立所需子資料夾
mkdir -p sci-fi fantasy-nordic fantasy-warrior life ai-girl-modern videos

# 將 MP4 影片移至 videos/
find . -maxdepth 1 -type f \( -iname "*.mp4" \) -exec mv {} videos/ \;

echo "images/ 子資料夾已建立："
ls -d */ 2>/dev/null || true
