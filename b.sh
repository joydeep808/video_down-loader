#!/bin/bash
# merge.sh: Concatenate TS segments and merge them into a single MP4 file

# Check for required list files
if [ ! -f video_list.txt ] || [ ! -f audio_list.txt ]; then
  echo "Error: video_list.txt or audio_list.txt not found!"
  exit 1
fi

echo "Concatenating video segments..."
# Create a single video TS file using the concat demuxer
ffmpeg -f concat -safe 0 -i ./parseVideo/video_list.txt -c copy video.ts
if [ $? -ne 0 ]; then
  echo "Error concatenating video segments."
  exit 1
fi

echo "Concatenating audio segments..."
# Create a single audio TS file using the concat demuxer
ffmpeg -f concat -safe 0 -i ./parseVideo/audio_list.txt -c copy audio.ts
if [ $? -ne 0 ]; then
  echo "Error concatenating audio segments."
  exit 1
fi

echo "Merging video and audio into output.mp4..."
# Merge the concatenated TS files into one MP4 file with fast start for web playback
ffmpeg -i video.ts -i audio.ts -c copy -movflags +faststart ./output.mp4
if [ $? -ne 0 ]; then
  echo "Error merging video and audio."
  exit 1
fi

# Optionally remove intermediate TS files

echo "Done! Your output video is saved as output.mp4."
