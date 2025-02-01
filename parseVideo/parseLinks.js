

// Sample M3U content (usually you would fetch or read from a file)


// Function to parse the M3U content
export function parseM3U(m3uContent) {
  // Define a regular expression to capture both video resolutions (720p, 480p)
  const videoLinkRegex = /#EXT-X-STREAM-INF:[^\n]+RESOLUTION=(\d+x\d+)[^\n]+\n([^\n]+)/g;
  // The regular expression is used to capture the video links with resolutions
  // such as 1280x720 or 854x480

  // Define a regular expression to capture all audio links with language names
  const audioLinkRegex = /#EXT-X-MEDIA:[^\n]+LANGUAGE="([a-z]+)",NAME="([a-zA-Z\s]+)",DEFAULT=[^\n]+,URI="([^\"]+)"/g;
  // The regular expression is used to capture the audio links with language names
  // such as English, Spanish, French, etc.

  // Initialize an empty array to store the video links
  const videoLinks = [];

  // Extract video links (720p, 480p)
  let videoMatch;
  // Use a while loop to iterate through the M3U content and extract the video links
  while ((videoMatch = videoLinkRegex.exec(m3uContent)) !== null) {
    // Get the resolution of the video link
    const resolution = videoMatch[1]; // e.g., 1280x720, 854x480
    // Get the video link URL
    const videoUrl = videoMatch[2];   // the video link URL
    // Add the video link to the array
    videoLinks.push({ resolution, url: videoUrl });
  }

  // Initialize an empty array to store the audio links
  const audioLinks = [];

  // Extract all audio links with language names
  let audioMatch;
  // Use a while loop to iterate through the M3U content and extract the audio links
  while ((audioMatch = audioLinkRegex.exec(m3uContent)) !== null) {
    // Get the language name of the audio link
    const languageName = audioMatch[2];
    // Get the audio link URL
    const audioUrl = audioMatch[3];
    // Add the audio link to the array
    audioLinks.push({ language: languageName, url: audioUrl });
  }

  // Get the segments URL for the first video link
  const videoSegmentUrl = getVideoSegmentsUrl(videoLinks[0].url)

  // Get the segments URL for the first audio link
  const audioSegmentsUrl = getAudioSegmentsUrl(audioLinks[0].url)

  // Get the common base URL by comparing the protocol and host of the first video and audio links
  const commonBaseUrl = getCommonBaseUrl(videoLinks[0].url, audioLinks[0].url)

  // Return an object containing the video and audio segments URLs, the video and audio links, and the common base URL
  return {
    videoSegmentUrl,
    audioSegmentsUrl,
    videoLinks,
    audioLinks,
    commonBaseUrl
  };
}


/**
 * This function takes a URL as input and returns a new URL that points to the video segments.
 * The video segments URL is constructed by taking the protocol, host, and first 4 parts of the path
 * of the input URL. The remaining parts of the path are discarded.
 *
 * For example, if the input URL is 'https://example.com/hls/81690671/manifest.m3u8',
 * the returned URL will be 'https://example.com/hls/81690671'.
 *
 * @param {string} url1 - The URL to modify.
 * @returns {string} The modified URL pointing to the video segments.
 */
export function getVideoSegmentsUrl(url1) {
  // Use URL object to parse the URLs
  const parsedUrl1 = new URL(url1);
  return `${parsedUrl1.protocol}//${parsedUrl1.host}${parsedUrl1.pathname.split('/').slice(0, 4).join('/')}`;
}

export function getAudioSegmentsUrl(url1) {
  // Use URL object to parse the URLs
  const parsedUrl1 = new URL(url1);
  return `${parsedUrl1.protocol}//${parsedUrl1.host}${parsedUrl1.pathname.split('/').slice(0, 5).join('/')}`;
}




/**
 * This function takes two URLs as input and returns a new URL that is the common base of both input URLs.
 * The common base URL is constructed by taking the protocol, host, and path up to the first slash after domain
 * of the input URLs. If the protocol and host of the two input URLs are not the same, an error is thrown.
 *
 * For example, if the input URLs are 'https://example.com/hls/81690671/manifest.m3u8' and 'https://example.com/hls/81690671/subtitles_1_en.m3u8',
 * the returned URL will be 'https://example.com/hls/81690671'.
 *
 * @param {string} url1 - The first URL to process.
 * @param {string} url2 - The second URL to process.
 * @returns {string} The common base URL of the two input URLs.
 * @throws {Error} if the protocol and host of the two input URLs are not the same.
 */
export function getCommonBaseUrl(url1, url2) {
  // Use URL object to parse the URLs
  const parsedUrl1 = new URL(url1);
  const parsedUrl2 = new URL(url2);

  // Compare the protocol and host
  if (parsedUrl1.protocol !== parsedUrl2.protocol || parsedUrl1.host !== parsedUrl2.host) {
    throw new Error("The provided URLs do not share a common base.");
  }

  // Return the common base URL by combining the protocol, host, and path up to the first slash after domain
  const commonBase = `${parsedUrl1.protocol}//${parsedUrl1.host}${parsedUrl1.pathname.split('/').slice(0, 3).join('/')}`;
  return commonBase;
}




// Example usage:
