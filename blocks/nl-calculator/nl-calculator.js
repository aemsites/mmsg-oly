import getMakes from './api/getMakes.js';
import getModels from './api/getModels.js';
import getAutoDetailOnMakeModel from './api/getAutoDetailOnMakeModel.js';
import getVehicleImageOnNVIC from './api/getVehicleImageOnNVIC.js';
import getAutoDetailOnNVIC from './api/getAutoDetailOnNVIC.js';

export default async function decorate(block) {
  block.textContent = '';
  block.innerHTML = '';
}
