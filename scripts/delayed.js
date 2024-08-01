// eslint-disable-next-line import/no-cycle
import { sampleRUM } from './aem.js';
import loadEmbed from './libs/video-lib.js';
import { getConfig } from './config.js';

// Core Web Vitals RUM collection
sampleRUM('cwv');

// get the config for adobe launch scripts
const { currentEnv: { analytics: { launchUrl } } } = getConfig();

// add more delayed functionality here
export default function loadVideoDelayed(videoURL, block, videoUrl = '') {
  loadEmbed(videoURL, block, videoUrl);
}

// add more delayed functionality here
function loadScript(url, type, callback) {
  const head = document.querySelector('head');
  let script = head.querySelector(`script[src="${url}"]`);
  if (!script) {
    script = document.createElement('script');
    script.src = url;
    if (type) script.setAttribute('type', type);
    head.append(script);
    script.onload = callback;
    return script;
  }
  return script;
}


// load adobe launch
loadScript(launchUrl);