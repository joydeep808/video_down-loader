import fs from "fs";

function createTxtFiles() {
  // Read the m3u8 files for video and audio
  // - The video and audio files are in different directories
  // - The video file is at ../public/video/Maharaja/master.m3u8
  // - The audio file is at ../public/audio/Maharaja/master.m3u8
  const videoContent = fs.readFileSync('../public/video/Maharaja/master.m3u8', "utf-8");
  const audioContent = fs.readFileSync('../public/audio/Maharaja/master.m3u8', "utf-8");

  // Split the contents of the m3u8 files into lines
  // - Each line is a single entry in the m3u8 playlist
  // - The lines are split on the newline character
  const videoLines = videoContent.split("\n");
  const audioLines = audioContent.split("\n");

  // Filter the lines to only include those containing '.ts'
  // - This is because the .ts files are the only ones we care about
  // - The other lines are comments or metadata
  const videoLinesWithTs = videoLines.filter(line => line.includes(".ts"));
  const audioLinesWithTs = audioLines.filter(line => line.includes(".ts"));

  // Format each line to include the "file ..." prefix along with the path
  // - The path is the full path to the .ts file
  // - The "file ..." prefix is required by FFmpeg
  const videoFiles = videoLinesWithTs.map(line => `file '../public/video/Maharaja/${line.trim()}'`);
  const audioFiles = audioLinesWithTs.map(line => `file '../public/audio/Maharaja/${line.trim()}'`);

  // Write the results to text files
  // - The video file is written to ./video_list.txt
  // - The audio file is written to ./audio_list.txt
  // - The files are written as text files with one line per .ts file
  fs.writeFileSync('./video_list.txt', videoFiles.join('\n'));
  fs.writeFileSync('./audio_list.txt', audioFiles.join('\n'));

  console.log("Text files created successfully.");
}

createTxtFiles();
