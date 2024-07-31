/**
 * Configuration for different environments.
 */
export const HOSTS = {
  PROD: {
    url: 'oly.com.au',
    aemUrl: 'author-p136205-e1368144.adobeaemcloud.com',
    previewUrl: 'main--mmsg-oly--aemsites.hlx.page',
    liveUrl: 'main--mmsg-oly--aemsites.hlx.live',
    calculator: {
      nlKey: 'abc',
      nlHeader: 'test',
      apiUrl: 'https://110267-mmsg-stage.adobeioruntime.net/',
    },
    form: {
      apiUrl: 'https://110267-mmsg-stage.adobeioruntime.net/',
    },
  },
  STAGE: {
    url: 'oly.com.au',
    aemUrl: 'author-p136205-e1368144.adobeaemcloud.com',
    previewUrl: 'main--mmsg-oly--aemsites.hlx.page',
    liveUrl: 'main--mmsg-oly--aemsites.hlx.live',
    calculator: {
      nlKey: 'abc',
      nlHeader: 'test',
      apiUrl: 'https://110267-mmsg-stage.adobeioruntime.net/',
    },
    form: {
      apiUrl: 'https://110267-mmsg-stage.adobeioruntime.net/',
    },
  },
  DEV: {
    url: 'oly.com.au',
    aemUrl: 'author-p136205-e1368144.adobeaemcloud.com',
    previewUrl: 'main--mmsg-oly--aemsites.hlx.page',
    liveUrl: 'main--mmsg-oly--aemsites.hlx.live',
    calculator: {
      nlKey: 'abc',
      nlHeader: 'test',
      apiUrl: 'https://110267-mmsg-stage.adobeioruntime.net/',
    },
    form: {
      apiUrl: 'https://110267-mmsg-stage.adobeioruntime.net/',
    },
  },
  LOCAL: {
    url: 'localhost:3000',
    aemUrl: 'author-p136205-e1368144.adobeaemcloud.com',
    previewUrl: 'localhost',
    liveUrl: 'localhost',
    calculator: {
      nlKey: 'abc',
      nlHeader: 'test',
      apiUrl: 'https://110267-mmsg-stage.adobeioruntime.net/',
    },
    form: {
      apiUrl: 'https://110267-mmsg-stage.adobeioruntime.net/',
    },
  },
};

export function getEnvironment() {
  const origin = window.location.hostname.toLowerCase();
  switch (true) {
    case origin.includes('localhost'):
      return 'LOCAL';
    case origin.includes('mmsg-oly--aemsites.hlx.page') || origin.includes('dev'):
      return 'DEV';
    case origin.includes('mmsg-oly-stage--aemsites.hlx.page') || origin.includes('stage'):
      return 'STAGE';
    case origin.includes('mmsg-oly-prod--aemsites.hlx.page'):
      return 'PROD';
    default:
      return 'DEV';
  }
}

/**
 * Get site config
 */
export function getConfig() {
  if (window.oly && window.oly.config) {
    return window.oly.config;
  }

  // Find the environment key that matches the current host
  const currentEnvKey = getEnvironment();

  // Use DEV as the default environment if no match is found
  const currentEnv = HOSTS[currentEnvKey] || HOSTS.DEV;

  const cdnHost = currentEnv.url;
  const cdnOrigin = `https://${cdnHost}`;
  const baseURL = window.location.origin || 'https://oly.com.au/';
  const youTubeLinkCheck = 'https://youtu';
  const videoModalPath = '/modals/video';

  window.oly = window.oly || {};
  window.oly = {
    baseURL,
    currentEnv,
    cdnOrigin,
    env: currentEnvKey,
    youTubeLinkCheck,
    videoModalPath,
  };

  return window.oly;
}
