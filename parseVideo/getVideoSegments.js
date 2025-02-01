import fs from "fs"
import path from "path"
import m3u8Parser from "m3u8-parser"
import fetch from "node-fetch";


export async function downloadHLSSegments(commonUrl, url, name, title) {
  try {
    // Step 1: Fetch the master playlist at the given URL
    console.log(`[MASTER] Fetching master playlist: ${url}`);
    const masterResponse = await fetch(url, {
      "headers": {
        "accept": "/",
        "accept-language": "en-US,en;q=0.9",
        "priority": "u=1, i",
        "sec-ch-ua": "\"Not A(Brand\";v=\"8\", \"Chromium\";v=\"132\", \"Brave\";v=\"132\"",
        "sec-ch-ua-mobile": "?1",
        "sec-ch-ua-platform": "\"Android\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "sec-gpc": "1"
      },
      "referrer": "https://iosmirror.cc/home",
      "referrerPolicy": "strict-origin-when-cross-origin",
      "body": null,
      "method": "GET",
      "mode": "cors",
      "credentials": "include"
    });

    // Step 2: Extract the master playlist content
    const masterPlaylist = await masterResponse.text();

    // Step 3: Create a folder for the video segments
    const folder = fs.mkdirSync(`./public/${name + "/" + title}`, { recursive: true });

    // Step 4: Write the master playlist to a file
    fs.writeFileSync(`${folder}/master.m3u8`, masterPlaylist);
    modifyM3U8Content(folder + '/master.m3u8', name)

    // Step 5: Parse the master playlist
    const parser = new m3u8Parser.Parser();
    parser.push(masterPlaylist);
    parser.end();

    // Step 6: Extract the segments from the parsed master playlist
    const segments = parser.manifest.segments;

    console.log(`[MASTER] Found ${segments.length} variant streams`);

    // Step 7: Download each segment of the video
    await downloadChunk(commonUrl, segments, segments.length, folder)
  } catch (error) {
    console.error('[ERROR] HLS download failed:', error);
    return null;
  }
}




/**
 * Download all HLS segments in parallel using a specified number of threads.
 * @param {string} url - The base URL of the HLS segments.
 * @param {Array} segments - The array of HLS segments to download.
 * @param {number} maxSegments - The total number of segments to download.
 * @param {string} folder - The folder to save the downloaded segments to.
 */
async function downloadChunk(url, segments, maxSegments, folder) {
  const mediaPlaylistUrl = url + "/";

  /**
   * Set up headers to mimic a browser request
   * Note: These headers are for demonstration purposes only and may need to be adjusted
   * based on the specific requirements of the HLS stream.
   */
  const segmentsHeaders = {
    'Accept-Encoding': 'gzip, deflate, br',
    'Accept-Language': 'en-US,en;q=0.9',
    'Cache-Control': 'max-age=3628800',
    'Referer': 'https://iosmirror.cc/',
    'Sec-Ch-Ua': '"Not A(Brand";v="8", "Chromium";v="132", "Brave";v="132"',
    'Sec-Ch-Ua-Mobile': '?1',
    'Sec-Ch-Ua-Platform': '"Android"',
    'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Mobile Safari/537.36',
  };

  /**
   * Calculate the number of segments to download per thread
   */
  const totalThreads = 5;
  const segmentsPerThread = Math.ceil(maxSegments / totalThreads);

  /**
   * Create an array of promises to track the downloads
   */
  const promises = [];

  /**
   * Loop through each thread and download the segments
   */
  for (let thread = 0; thread < totalThreads; thread++) {
    const start = thread * segmentsPerThread;
    const end = Math.min(start + segmentsPerThread, maxSegments);
    if (start >= end) break;

    /**
     * Create a promise for each thread to download the segments
     */
    promises.push((async () => {
      /**
       * Loop through each segment and download it
       */
      for (let i = start; i < end; i++) {
        const segmentUrl = mediaPlaylistUrl + segments[i].uri;
        console.log(`Downloading segment ${i + 1} of ${maxSegments}: ${segmentUrl}`);
        const segmentResponse = await fetch(segmentUrl, {
          method: "GET",
          headers: segmentsHeaders // Fixed typo: segmentsHeaders -> headers
        });
        const segmentData = await segmentResponse.arrayBuffer();
        const filename = path.join(folder, `${segments[i].uri.split(".")[0]}.ts`);
        console.log(`Saving segment ${i + 1} of ${maxSegments} to ${filename}`);
        fs.writeFileSync(filename, Buffer.from(segmentData));
      }
    })());
  }

  /**
   * Wait for all promises to resolve
   */
  await Promise.all(promises);
}
function modifyM3U8Content(path, name) {
  // Split the M3U8 content by new lines
  const m3u8Content = fs.readFileSync(path, "utf-8");
  const lines = m3u8Content.split("\n");

  // Loop through each line
  const modifiedLines = lines.map(line => {
    // Check if the line contains a .jpg image path
    if (line.includes(".jpg",)) {
      // Replace .jpg with desired modification, for example, change extension or URL
      return line.replace(".jpg", ".ts");
    }
    if (line.includes(".js",)) {
      // Replace .jpg with desired modification, for example, change extension or URL
      return line.replace(".js", ".ts");
    }
    return line;  // Return line unchanged if it doesn't contain .jpg
  });

  // Join the modified lines back into a single string
  const modifiedM3U8Content = modifiedLines.join("\n");

  // Write the modified M3U8 content back to the file
  fs.writeFileSync(path, modifiedM3U8Content);
  return;
}