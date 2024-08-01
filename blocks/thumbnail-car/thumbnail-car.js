import { createEVIcon } from '../../scripts/utils.js';

export default function decorate(block) {
  block.children[1].append(block.children[2]);
  createEVIcon(block.children[3].children[0], block.children[3]);
}
