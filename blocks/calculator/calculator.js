import getMakes from './api/getMakes.js';
import getModels from './api/getModels.js';
import getAutoDetailOnMakeModel from './api/getAutoDetailOnMakeModel.js';
import getVehicleImageOnNVIC from './api/getVehicleImageOnNVIC.js';
import getAutoDetailOnNVIC from './api/getAutoDetailOnNVIC.js';

export default async function decorate(block) {
  const formFields = [{ name: 'formLabel_Make' }, { name: 'formLabel_Model' }];

  const formUserFields = [
    { name: 'formLabelUser_Salary' },
    { name: 'formLabelUser_Vehicle_Cost' },
    { name: 'formLabelUser_Kms' },
    { name: 'formLabelUser_Lease_Term' },
  ];

  const [brandImage, formLabels, formUserLabels, richText] = block.children;
  brandImage.className = 'brand-image';
  formLabels.className = 'form-label-container';
  formUserLabels.className = 'form-user-label-container';
  richText.className = 'content-container';

  let formFieldIndex = 0;
  const responseMakes = await getMakes();
  let responseModels = await getModels(responseMakes.Table[0].code);
  let responseVehicleList = await getAutoDetailOnMakeModel(responseMakes.Table[0].code, responseModels.Table[0].Code);

  [...formLabels.children].forEach((item) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'form-element-wrapper';
    [...item.children].forEach((p) => {
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

          select.addEventListener('change', async (e) => {
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
            responseVehicleList.Table.forEach(async (vehicle) => {
              const responseVehicleImage = await getVehicleImageOnNVIC(vehicle.NVIC_CUR);
              const responseVehicleDetail = await getAutoDetailOnNVIC(vehicle.NVIC_CUR);
              const img = document.createElement('img');
              responseVehicleImage.arrayBuffer().then((buffer) => {
                let binary = '';
                const bytes = [].slice.call(new Uint8Array(buffer));
                bytes.forEach((b) => {
                  binary += String.fromCharCode(b);
                });
                const imageStr = window.btoa(binary);
                img.src = `data:image/jpeg;base64,${imageStr}`;
              });
              const li = document.createElement('li');
              li.className = 'vehicle-item';
              const h3 = document.createElement('h3');
              h3.innerHTML = vehicle.RRP.Amount;
              const span = document.createElement('span');
              span.innerHTML = ' RRP';
              h3.append(span);
              const prgh = document.createElement('p');
              prgh.innerHTML =
                '2024 ' +
                responseVehicleDetail.Table[0].ManufacturerName +
                ' ' +
                responseVehicleDetail.Table[0].FamilyName +
                ' ' +
                responseVehicleDetail.Table[0].VariantName +
                ' ' +
                responseVehicleDetail.Table[0].SeriesName +
                ' ' +
                responseVehicleDetail.Table[0].BodyName;
              const pFueltype = document.createElement('p');
              pFueltype.innerHTML = 'Fuel Type: ' + responseVehicleDetail.Table[0].engine_classification;
              li.append(h3);
              li.append(prgh);
              li.append(img);
              li.append(pFueltype);
              vehicleSelectionListContainer.append(li);
            });
          });
        } else if (formFields[formFieldIndex].name === 'formLabel_Model') {
          responseModels.Table.forEach((model) => {
            const option = document.createElement('option');
            option.setAttribute('value', model.Code);
            option.innerText = model.Name;
            select.append(option);
          });

          select.addEventListener('change', async (e) => {
            e.preventDefault();
            const selectMake = document.getElementById(formFields[0].name);
            // Populate the Vehicle List
            responseVehicleList = await getAutoDetailOnMakeModel(selectMake.value, select.value);
            const vehicleSelectionListContainer = document.getElementById('vehicle-selection-list-ul');
            vehicleSelectionListContainer.innerHTML = '';
            responseVehicleList.Table.forEach(async (vehicle) => {
              const responseVehicleImage = await getVehicleImageOnNVIC(vehicle.NVIC_CUR);
              const responseVehicleDetail = await getAutoDetailOnNVIC(vehicle.NVIC_CUR);
              const img = document.createElement('img');
              responseVehicleImage.arrayBuffer().then((buffer) => {
                let binary = '';
                const bytes = [].slice.call(new Uint8Array(buffer));
                bytes.forEach((b) => {
                  binary += String.fromCharCode(b);
                });
                const imageStr = window.btoa(binary);
                img.src = `data:image/jpeg;base64,${imageStr}`;
              });
              const li = document.createElement('li');
              li.className = 'vehicle-item';
              const h3 = document.createElement('h3');
              h3.innerHTML = vehicle.RRP.Amount;
              const span = document.createElement('span');
              span.innerHTML = ' RRP';
              h3.append(span);
              const prgh = document.createElement('p');
              prgh.innerHTML =
                '2024 ' +
                responseVehicleDetail.Table[0].ManufacturerName +
                ' ' +
                responseVehicleDetail.Table[0].FamilyName +
                ' ' +
                responseVehicleDetail.Table[0].VariantName +
                ' ' +
                responseVehicleDetail.Table[0].SeriesName +
                ' ' +
                responseVehicleDetail.Table[0].BodyName;
              const pFueltype = document.createElement('p');
              pFueltype.innerHTML = 'Fuel Type: ' + responseVehicleDetail.Table[0].engine_classification;
              li.append(h3);
              li.append(prgh);
              li.append(img);
              li.append(pFueltype);
              vehicleSelectionListContainer.append(li);
            });
          });
        }
        select.className = 'input-select';
        inlineDiv.append(label);
        inlineDiv.append(select);
        wrapper.append(inlineDiv);
      }
      p.textContent = '';
      item.append(wrapper);
      formFieldIndex += 1;
    });

    // Create UI for the vehicle list
    const vehicleListDiv = document.createElement('div');
    vehicleListDiv.id = 'vehicle-list';
    const vehicleListWrapper = document.createElement('div');
    vehicleListWrapper.className = 'container';

    const ul = document.createElement('ul');
    ul.id = 'vehicle-selection-list-ul';
    responseVehicleList.Table.forEach(async (vehicle) => {
      const responseVehicleImage = await getVehicleImageOnNVIC(vehicle.NVIC_CUR);
      const responseVehicleDetail = await getAutoDetailOnNVIC(vehicle.NVIC_CUR);
      debugger;
      const img = document.createElement('img');
      responseVehicleImage.arrayBuffer().then((buffer) => {
        let binary = '';
        const bytes = [].slice.call(new Uint8Array(buffer));
        bytes.forEach((b) => {
          binary += String.fromCharCode(b);
        });
        const imageStr = window.btoa(binary);
        img.src = `data:image/jpeg;base64,${imageStr}`;
      });
      const li = document.createElement('li');
      li.className = 'vehicle-item';
      const h3 = document.createElement('h3');
      h3.innerHTML = '$ ' + vehicle.RRP.Amount;
      const span = document.createElement('span');
      span.innerHTML = ' RRP';
      h3.append(span);
      const prgh = document.createElement('p');
      prgh.innerHTML =
        '2024 ' +
        responseVehicleDetail.Table[0].ManufacturerName +
        ' ' +
        responseVehicleDetail.Table[0].FamilyName +
        ' ' +
        responseVehicleDetail.Table[0].VariantName +
        ' ' +
        responseVehicleDetail.Table[0].SeriesName +
        ' ' +
        responseVehicleDetail.Table[0].BodyName;
      const pFueltype = document.createElement('p');
      pFueltype.innerHTML = 'Fuel Type: ' + responseVehicleDetail.Table[0].engine_classification;

      li.append(h3);
      li.append(prgh);
      li.append(img);
      li.append(pFueltype);
      ul.append(li);
    });
    vehicleListWrapper.append(ul);

    vehicleListDiv.append(vehicleListWrapper);
    formLabels.append(vehicleListDiv);
  });

  let formUserFieldIndex = 0;

  [...formUserLabels.children].forEach((item) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'wrapper';
    [...item.children].forEach((p) => {
      const label = document.createElement('div');
      label.className = 'form-label';
      label.setAttribute('data-aue-prop', formUserFields[formUserFieldIndex].name);
      label.append(p.innerHTML);
      const wrapperEl = document.createElement('div');
      wrapperEl.id = formUserFields[formUserFieldIndex].name;
      wrapperEl.className = 'wrapper-inline';
      const input = document.createElement('input');
      input.className = 'input-text';
      input.setAttribute('type', 'number');
      wrapperEl.append(label);
      wrapperEl.append(input);
      p.textContent = '';
      item.append(wrapperEl);
      formUserFieldIndex += 1;
    });
  });
}
