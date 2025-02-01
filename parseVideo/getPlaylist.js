import { downloadHLSSegments } from "./getVideoSegments.js";
import { parseM3U } from "./parseLinks.js";




/**
 * Fetch the playlist from the provided URL.
 * 
 * The URL is constructed by appending the given ID to the base URL.
 * 
 * The function sends a GET request to the URL with headers that mimic a
 * browser request. The headers are set to pretend to be a Chrome browser
 * on an Android device. The headers are mostly copied from the request
 * headers sent by the Chrome browser on an Android device when accessing
 * the website.
 * 
 * The function then checks if the response is OK. If the response is OK,
 * it extracts the JSON data from the response and calls the getMainFile
 * function with the extracted data and the title of the movie.
 * 
 * If the response is not OK, it logs an error message to the console.
 * 
 * If there is an error during the request, it logs the error to the console.
 * 
 * @param {number} id - The ID of the movie to fetch.
 */
async function fetchPlaylist(id) {
  const url = `https://iosmirror.cc/playlist.php?id=${id}`;

  // Setting headers that mimic a browser request
  const headers = {
    'Accept': '*/*',
    'Accept-Encoding': 'gzip, deflate, br, zstd',  // Updated compression algorithms
    'Accept-Language': 'en-US,en;q=0.9,de;q=0.8',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Cookie': '81728596=9769%3A10137; t_hash_t=82cf37e0f78daddae57d98eb349f7238%3A%3A7d334548f58814fc5880bb9a7f4f3ded%3A%3A1738380686%3A%3Ani; t_hash=88263b38ef4bd45b0862c7b0fbe0cb92%3A%3A1738384435%3A%3Ani; cf_clearance=CaUgEPY_sJP6d1ynyYS_.gD6hi.rq7czTmBMhFEALYU-1738384477-1.2.1.1-oDHO7P70Wq3_8Gb6LORYqNkF7JhVY40B2dVF_sxJs8n1o.k86BROQx0bu9qy1M9x6EKg0nUB_Bd6DruDEq0wV0oEEzUENOVqxQRN8mDlOfalaXWDgfQpmROywZaG5A3.YL8OZE2ydffTFjDlFniGr0EHpEcAjadI_en.3GQFZskqWNOVv_.IKGkdx8ZnKQGWIoPLXGAXoo.0vzjmbpFlE5Mx9MfbNUHw3Orw.NMjoHZWWgrD2Q8oyq0RC1fWaIHw43ZYay3S8JabMYINsZnpIBJcfq8BRChRVDPdq1KGNh8',
    'Referer': 'https://iosmirror.cc/home',
    'Sec-Ch-Ua': '"Not A(Brand";v="8", "Chromium";v="132", "Brave";v="132"',
    'Sec-Ch-Ua-Mobile': '?1',
    'Sec-Ch-Ua-Platform': '"Android"',
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Site': 'same-origin',
    'Sec-Gpc': '1',
    'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Mobile Safari/537.36',
    'Connection': 'keep-alive',
  };

  try {
    const response = await fetch(url, { method: 'GET', headers });

    // Check if the response is OK
    if (response.ok) {
      const data = await response.json();  // Assuming the response is JSON

      const title = "Maharaja"
      await getMainFile("https://iosmirror.cc" + data[0].sources[0].file, title)
      // data[0].sources
    } else {
      console.log('Error fetching data:', response.status, response.statusText);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Call the function to fetch the playlist







/**
 * Fetches the main HLS playlist from the given URL and downloads the video and
 * audio segments.
 *
 * @param {string} url The URL of the main HLS playlist.
 * @param {string} title The title of the video.
 */
async function getMainFile(url, title) {
  console.log(`[MAIN] Fetching main playlist: ${url}`);

  // Set the headers for the request. These headers are required to make the
  // request look like it's coming from the iOSMirror website.
  const headers = {
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
  };

  // Set the referrer for the request. This is required to make the request look
  // like it's coming from the iOSMirror website.
  const referrer = "https://iosmirror.cc/home";

  // Set the referrer policy for the request. This is required to make the request
  // look like it's coming from the iOSMirror website.
  const referrerPolicy = "strict-origin-when-cross-origin";

  // Make the request to fetch the main playlist.
  const response = await fetch(url, {
    headers,
    referrer,
    referrerPolicy,
    credentials: "include"
  });

  // Check if the response is OK.
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  // Get the text content of the response.
  const body = await response.text();

  // Parse the M3U content.
  const parseLinks = parseM3U(body);

  // Get the video and audio links.
  const videoLink = parseLinks.videoLinks[0].url;
  const audioLink = parseLinks.audioLinks[0].url;

  // Download the video and audio segments.
  await Promise.all([
    downloadHLSSegments(parseLinks.videoSegmentUrl, videoLink, "video", title),
    downloadHLSSegments(parseLinks.audioSegmentsUrl, audioLink, "audio", title)
  ]);
}


fetchPlaylist(81690671);







// async function getTitle(url) {

// }