import { createEVIcon } from '../../scripts/utils.js';

export default function decorate(block) {
  block.children[1].append(block.children[2]);
  createEVIcon(block.children[2].children[0], block.children[2]);
  block.children[2].classList.add('ev-badge');
  block.children[1].append(block.children[2]);
}
