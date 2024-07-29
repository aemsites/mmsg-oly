// eslint-disable-next-line import/no-cycle
import { sampleRUM } from './aem.js';
import loadEmbed from './libs/video-lib.js';

// Core Web Vitals RUM collection
sampleRUM('cwv');

// add more delayed functionality here
export default function loadVideoDelayed(videoURL, block, videoUrl = '') {
  loadEmbed(videoURL, block, videoUrl);
}
