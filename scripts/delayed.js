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

export async function loadScript(src, attrs) {
  return new Promise((resolve, reject) => {
    if (!document.querySelector(`head > script[src="${src}"]`)) {
      const script = document.createElement('script');
      script.src = src;
      if (attrs) {
      // eslint-disable-next-line no-restricted-syntax, guard-for-in
        for (const attr in attrs) {
          script.setAttribute(attr, attrs[attr]);
        }
      }
      script.onload = resolve;
      script.onerror = reject;
      document.head.append(script);
    } else {
      resolve();
    }
  });
}

// load adobe launch
loadScript(launchUrl, { async: true });

// google recaptcha
// export function loadRecaptcha() {
//   loadScript('https://www.google.com/recaptcha/api.js?onload=onloadCallback&render=explicit', { async: true });
// }