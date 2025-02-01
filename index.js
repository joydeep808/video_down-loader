import { downloadHLSSegments } from "./parseVideo/getVideoSegments.js";
import { parseM3U } from "./parseVideo/parseLinks.js";




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







async function getMainFile(url, title) {
  const response = await fetch(url, {
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

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const body = await response.text();
  const parseLinks = parseM3U(body);

  const videoLink = parseLinks.videoLinks[0].url
  const audioLink = parseLinks.audioLinks[0].url
  await Promise.all([
    downloadHLSSegments(parseLinks.videoSegmentUrl, videoLink, "video", title),
    downloadHLSSegments(parseLinks.audioSegmentsUrl, audioLink, "audio", title)

  ])
}


fetchPlaylist(81690671);






