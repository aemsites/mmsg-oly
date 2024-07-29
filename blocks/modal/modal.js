import { loadFragment } from '../fragment/fragment.js';
import { buildBlock, decorateBlock, decorateIcons, loadBlock, loadCSS } from '../../scripts/aem.js';
import loadVideoDelayed from '../../scripts/delayed.js';
import { CONFIG } from '../../scripts/utils.js';

export async function createModal(contentNodes, videoUrl) {
  await loadCSS(`${window.hlx.codeBasePath}/blocks/modal/modal.css`);
  const dialog = document.createElement('dialog');
  const dialogContent = document.createElement('div');
  dialogContent.classList.add('modal-content');
  dialogContent.append(...contentNodes);

  // Create embed block and load YouTube video
  const embedBlock = document.createElement('div');
  embedBlock.classList.add('embed');
  const embedLink = document.createElement('a');
  embedLink.href = videoUrl;
  embedBlock.appendChild(embedLink);
  dialogContent.appendChild(embedBlock);

  // Call loadVideoDelayed to load the video
  if (videoUrl && videoUrl.includes(CONFIG.youTubeLinkCheck)) {
    loadVideoDelayed(embedBlock, [], videoUrl);
  }

  dialog.append(dialogContent);

  const closeButton = document.createElement('a');
  closeButton.href = '#';
  closeButton.classList.add('close-button');
  closeButton.setAttribute('aria-label', 'Close');
  closeButton.setAttribute('role', 'button');
  closeButton.type = 'button';
  closeButton.innerHTML = '<span class="icon icon-close-circle">Close video</span>';
  closeButton.addEventListener('click', () => dialog.close());
  dialog.append(closeButton);

  // Close dialog on clicks outside the dialog
  dialog.addEventListener('click', (event) => {
    event.preventDefault();
    const dialogDimensions = dialog.getBoundingClientRect();
    if (
      event.clientX < dialogDimensions.left ||
      event.clientX > dialogDimensions.right ||
      event.clientY < dialogDimensions.top ||
      event.clientY > dialogDimensions.bottom
    ) {
      dialog.close();
    }
  });

  const block = buildBlock('modal', '');
  document.querySelector('main').append(block);
  decorateBlock(block);
  await loadBlock(block);
  decorateIcons(closeButton);

  dialog.addEventListener('close', () => {
    document.body.classList.remove('modal-open');
    block.remove();
  });

  block.append(dialog);
  return {
    block,
    showModal: () => {
      dialog.showModal();
      // Google Chrome restores the scroll position when the dialog is reopened,
      // so we need to reset it.
      setTimeout(() => {
        dialogContent.scrollTop = 0;
      }, 0);

      document.body.classList.add('modal-open');
    },
  };
}

export async function openModal(fragmentUrl, videoUrl = '') {
  const path = fragmentUrl.startsWith('http') ? new URL(fragmentUrl, window.location).pathname : fragmentUrl;

  const fragment = await loadFragment(path);
  const { showModal } = await createModal(fragment.childNodes, videoUrl);
  showModal();
}
