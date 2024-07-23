import getMakes from './api/getMakes.js';
import getModels from './api/getModels.js';
import getAutoDetailOnMakeModel from './api/getAutoDetailOnMakeModel.js';
import getVehicleImageOnNVIC from './api/getVehicleImageOnNVIC.js';

export default async function decorate(block) {
  debugger;
  const formFields = [
    { name: 'formLabel_Make' },
    { name: 'formLabel_Model' },
    { name: 'formLabel_Variant' },
    { name: 'formLabel_Salary' },
    { name: 'formLabel_Vehicle_Cost' },
    { name: 'formLabel_Kms' },
    { name: 'formLabel_Lease_Term' },
  ];
  const [brandImage, formLabels, btnCalculate, richText] = block.children;
  brandImage.className = 'brand-image';
  formLabels.className = 'form-label-container';
  btnCalculate.className = 'button';
  richText.className = 'content-container';

  let formFieldIndex = 0;
  const responseMakes = await getMakes();
  let responseModels = await getModels(responseMakes.Table[0].code);
  let responseVehicleList = await getAutoDetailOnMakeModel(responseMakes.Table[0].code, responseModels.Table[0].Code);

  [...formLabels.children].forEach((item) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'form-element-wrapper';
    [...item.children].forEach((p, index) => {
      const label = document.createElement('div');
      label.className = 'form-label';
      label.setAttribute('data-aue-prop', formFields[formFieldIndex].name);
      label.append(p.innerHTML);
      const inlineDiv = document.createElement('div');
      inlineDiv.className = 'wrapper-inline';
      if (
        formFields[formFieldIndex].name === 'formLabel_Make' ||
        formFields[formFieldIndex].name === 'formLabel_Model'
      ) {
        const select = document.createElement('select');
        select.id = formFields[formFieldIndex].name;
        if (formFields[formFieldIndex].name === 'formLabel_Make') {
          responseMakes.Table.forEach((make) => {
            const option = document.createElement('option');
            option.setAttribute('value', make.code);
            option.innerText = make.name;
            select.append(option);
          });

          select.addEventListener('change', async function (e) {
            e.preventDefault();
            responseModels = await getModels(select.value);
            const selectModel = document.getElementById(formFields[1].name);
            selectModel.innerHTML = '';
            responseModels.Table.forEach(async (model) => {
              const option = document.createElement('option');
              option.setAttribute('value', model.Code);
              option.innerText = model.Name;
              selectModel.append(option);
            });

            responseVehicleList = await getAutoDetailOnMakeModel(select.value, selectModel.value);
            const vehicleSelectionListContainer = document.getElementById('vehicle-selection-list-ul');
            vehicleSelectionListContainer.innerHTML = '';
            vehicleSelectionListContainer.style.display = 'none';
            responseVehicleList.Table.forEach(async (vehicle, index) => {
              const responseVehicleImage = await getVehicleImageOnNVIC(vehicle.NVIC_CUR);
              const b64image = btoa(responseVehicleImage);
              debugger;
              const li = document.createElement('li');
              li.className = 'vehicle-item';
              const h3 = document.createElement('h3');
              h3.innerHTML = vehicle.RRP.Amount;
              const span = document.createElement('span');
              span.innerHTML = ' RRP';
              h3.append(span);
              const p = document.createElement('p');
              p.innerHTML = vehicle.ModelName;
              const img = document.createElement('img');
              img.src = 'data:image/jpeg;base64,' + b64image;
              li.append(h3);
              li.append(p);
              li.append(img);
              vehicleSelectionListContainer.append(li);

              if (index === responseVehicleList.Table.length - 1) {
                vehicleSelectionListContainer.style.display = 'block';
              }
            });
          });
        } else if (formFields[formFieldIndex].name === 'formLabel_Model') {
          responseModels.Table.forEach((model) => {
            const option = document.createElement('option');
            option.setAttribute('value', model.Code);
            option.innerText = model.Name;
            select.append(option);
          });

          select.addEventListener('change', async function (e) {
            e.preventDefault();
            const selectMake = document.getElementById(formFields[0].name);
            // Populate the Vehicle List
            responseVehicleList = await getAutoDetailOnMakeModel(selectMake.value, select.value);
            const vehicleSelectionListContainer = document.getElementById('vehicle-selection-list-ul');
            vehicleSelectionListContainer.innerHTML = '';
            vehicleSelectionListContainer.style.display = 'none';
            responseVehicleList.Table.forEach(async (vehicle, index) => {
              const responseVehicleImage = await getVehicleImageOnNVIC(vehicle.NVIC_CUR);
              const b64image = btoa(responseVehicleImage);
              debugger;
              const li = document.createElement('li');
              li.className = 'vehicle-item';
              const h3 = document.createElement('h3');
              h3.innerHTML = vehicle.RRP.Amount;
              const span = document.createElement('span');
              span.innerHTML = ' RRP';
              h3.append(span);
              const p = document.createElement('p');
              p.innerHTML = vehicle.ModelName;
              const img = document.createElement('img');
              img.src = 'data:image/jpeg;base64,' + b64image;
              li.append(h3);
              li.append(p);
              li.append(img);
              vehicleSelectionListContainer.append(li);
              if (index === responseVehicleList.Table.length - 1) {
                vehicleSelectionListContainer.style.display = 'block';
              }
            });
          });
        }
        select.className = 'input-select';
        inlineDiv.append(label);
        inlineDiv.append(select);
        wrapper.append(inlineDiv);
      } else {
        const input = document.createElement('input');
        input.className = 'input-text';
        input.setAttribute('type', 'number');
        inlineDiv.append(label);
        inlineDiv.append(input);
        wrapper.append(inlineDiv);
      }
      p.textContent = '';
      item.append(wrapper);
      formFieldIndex += 1;
    });

    const vehicleListDiv = document.createElement('div');
    vehicleListDiv.id = 'vehicle-list';
    const vehicleListWrapper = document.createElement('div');
    vehicleListWrapper.className = 'container';

    const ul = document.createElement('ul');
    ul.id = 'vehicle-selection-list-ul';
    ul.style.display = 'none';
    responseVehicleList.Table.forEach(async (vehicle, index) => {
      const responseVehicleImage = await getVehicleImageOnNVIC(vehicle.NVIC_CUR);
      const b64image = btoa(responseVehicleImage);
      debugger;
      const li = document.createElement('li');
      li.className = 'vehicle-item';
      const h3 = document.createElement('h3');
      h3.innerHTML = vehicle.RRP.Amount;
      const span = document.createElement('span');
      span.innerHTML = ' RRP';
      h3.append(span);
      const p = document.createElement('p');
      p.innerHTML = vehicle.ModelName;
      const img = document.createElement('img');
      img.src = 'data:image/jpeg;base64,' + b64image;
      li.append(h3);
      li.append(p);
      li.append(img);
      ul.append(li);

      if (index === responseVehicleList.Table.length - 1) {
        ul.style.display = 'block';
      }
    });
    vehicleListWrapper.append(ul);

    vehicleListDiv.append(vehicleListWrapper);
    block.append(vehicleListDiv);
  });
}
