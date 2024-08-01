import getMakes from './api/getMakes.js';
import getModels from './api/getModels.js';
import getAutoDetailOnMakeModel from './api/getAutoDetailOnMakeModel.js';
import getVehicleImageOnNVIC from './api/getVehicleImageOnNVIC.js';
import getAutoDetailOnNVIC from './api/getAutoDetailOnNVIC.js';
import getCalculatorResult from './api/getCalculatorResult.js';

export default async function decorate(block) {
  const formFields = [{ name: 'formLabel_Year' }, { name: 'formLabel_Make' }, { name: 'formLabel_Model' }];
  const formAboutYouFields = [{ name: 'formLabelYou_Salary' }];

  const formCustomizeCarFields = [
    { name: 'formLabelCar_Variant' },
    { name: 'formLabelCar_EstimatedTravel' },
    { name: 'formLabelCar_LeaseTerm' },
  ];

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();

  let selectedNVIC = '';

  let calculatorResponse = null;

  const [
    apiDetails,
    titleDescription,
    formLabels,
    formCarLabels,
    carViewDescription,
    formYouLabels,
    aboutViewDescription,
    resultsViewDescription,
  ] = block.children;
  titleDescription.className = 'form-heading';
  formLabels.className = 'form-label-container';
  formCarLabels.className = 'form-car-label-container';
  carViewDescription.className = 'content-container';

  const formCustomizeCarFieldsLabels = [];
  const formAboutYouFieldsLabels = [];
  const formAboutYouFieldDescription = [];
  let leaseTermSelected = '5';
  block.textContent = '';
  const el_calcContainer = document.createElement('div');
  el_calcContainer.className = 'container';

  [...titleDescription.children].forEach((item) => {
    [...item.children].forEach((el) => {
      el_calcContainer.append(el);
    });
  });

  const el_break = document.createElement('br');
  const el_inputSalary = document.createElement('input');
  const el_inputKmsTravelled = document.createElement('input');

  //Calculator all views - UI section
  const el_calcViews = document.createElement('div');
  el_calcViews.className = 'views';

  //Calculator search view - UI section
  const el_calcSearchView = document.createElement('div');
  el_calcSearchView.className = 'view-search';
  el_calcSearchView.id = 'view-search';
  const el_searchViewCol1 = document.createElement('div');
  el_searchViewCol1.className = 'col';
  const el_searchViewCol2 = document.createElement('div');
  el_searchViewCol2.className = 'col';

  //Car View
  const el_calcCarView = document.createElement('div');
  el_calcCarView.id = 'view-car';

  const el_calcAboutYouView = document.createElement('div');
  const el_calcResultView = document.createElement('div');

  let formFieldIndex = 0;
  const responseMakes = await getMakes(currentYear);
  let responseModels = await getModels(currentYear, responseMakes.Table[0].code);
  let responseVehicleList = await getAutoDetailOnMakeModel(
    currentYear,
    responseMakes.Table[0].code,
    responseModels.Table[0].Code,
  );

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
      const select = document.createElement('select');
      select.id = formFields[formFieldIndex].name;

      if (formFields[formFieldIndex].name === 'formLabel_Year') {
        for (let i = 0; i < 2; i++) {
          const option = document.createElement('option');
          option.setAttribute('value', currentYear - i);
          option.innerText = currentYear - i;
          select.append(option);
        }

        select.addEventListener('change', async (e) => {
          e.preventDefault();
          responseMakes = await getMakes(select.value);
          const selectMake = document.getElementById(formFields[1].name);
          selectMake.innerHTML = '';
          responseMakes.Table.forEach((make) => {
            const option = document.createElement('option');
            option.setAttribute('value', make.code);
            option.innerText = make.name;
            selectMake.append(option);
          });
        });
      } else if (formFields[formFieldIndex].name === 'formLabel_Make') {
        responseMakes.Table.forEach((make) => {
          const option = document.createElement('option');
          option.setAttribute('value', make.code);
          option.innerText = make.name;
          select.append(option);
        });

        select.addEventListener('change', async (e) => {
          e.preventDefault();
          const selectYear = document.getElementById(formFields[0].name);
          responseModels = await getModels(selectYear.value, select.value);
          const selectModel = document.getElementById(formFields[2].name);
          selectModel.innerHTML = '';
          responseModels.Table.forEach(async (model) => {
            const option = document.createElement('option');
            option.setAttribute('value', model.Code);
            option.innerText = model.Name;
            selectModel.append(option);
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
          const selectYear = document.getElementById(formFields[0].name);
          const selectMake = document.getElementById(formFields[1].name);
        });
      }
      select.className = 'input-select';
      inlineDiv.append(label);
      inlineDiv.append(select);
      wrapper.append(inlineDiv);

      p.textContent = '';
      p.remove();
      item.append(wrapper);
      el_searchViewCol1.append(item);
      formFieldIndex += 1;
    });
  });

  const el_btnSearch = document.createElement('button');
  el_btnSearch.className = 'button';
  el_btnSearch.innerText = 'Search';

  el_btnSearch.addEventListener('click', async () => {
    const el_viewCar = document.getElementById('view-car');
    //const el_carDetail = document.getElementById('car-detail');
    if (el_viewCar != null) el_viewCar.innerHTML = '';

    // Create UI for the vehicle list
    const vehicleListDiv = document.createElement('div');
    vehicleListDiv.id = 'vehicle-list';
    const vehicleListWrapper = document.createElement('div');
    vehicleListWrapper.className = 'container';
    el_calcCarView.className = 'view-car';

    const el_calcCarSelectionViewList = document.createElement('ul');
    el_calcCarSelectionViewList.className = 'view-inline-list';
    const el_calcCustomizeCar = document.createElement('li');
    el_calcCustomizeCar.innerText = '1. Customise the car';
    el_calcCustomizeCar.className = 'selected';
    const el_calcAboutYou = document.createElement('li');
    el_calcAboutYou.innerText = '2. About you';
    const el_calcResult = document.createElement('li');
    el_calcResult.innerText = '3. Results';
    el_calcCarSelectionViewList.append(el_calcCustomizeCar);
    el_calcCarSelectionViewList.append(el_calcAboutYou);
    el_calcCarSelectionViewList.append(el_calcResult);
    el_calcCarView.append(el_calcCarSelectionViewList);

    const el_calcCarDetailWrapper = document.createElement('div');
    el_calcCarDetailWrapper.className = 'wrapper';
    const el_calcCarDetailCol1 = document.createElement('div');
    el_calcCarDetailCol1.className = 'col';
    const el_calcCarDetailCol2 = document.createElement('div');
    el_calcCarDetailCol2.className = 'col';

    const carImg = document.createElement('img');
    el_calcCarDetailCol1.append(carImg);

    const carDetail = document.createElement('div');
    carDetail.className = 'detail';
    carDetail.id = 'car-detail';
    const carMakeModel = document.createElement('h4');
    const slctYear = document.getElementById(formFields[0].name);
    const slctMake = document.getElementById(formFields[1].name);
    const slctModel = document.getElementById(formFields[2].name);

    carMakeModel.innerText = `${slctYear.options[slctYear.selectedIndex].text} ${slctMake.options[slctMake.selectedIndex].text} ${slctModel.options[slctModel.selectedIndex].text}`;
    carDetail.append(carMakeModel);

    // Refresh the variant list on vehicle selection/search
    responseVehicleList = await getAutoDetailOnMakeModel(slctYear.value, slctMake.value, slctModel.value);

    //Add customize car labels to Car detail UI

    let formCustomizeCarFieldIndex = 0;

    [...formCarLabels.children].forEach((item) => {
      const wrapper = document.createElement('div');
      wrapper.className = 'wrapper';
      [...item.children].forEach(async (p, index) => {
        const el = document.getElementById(formCustomizeCarFields[formCustomizeCarFieldIndex].name);
        if (el != null) {
          el.remove();
        }
        const label = document.createElement('div');
        label.className = 'form-label';
        label.setAttribute('data-aue-prop', formCustomizeCarFields[formCustomizeCarFieldIndex].name);

        // Initialize once through the elements in loop
        if (formCustomizeCarFieldsLabels.length != item.children.length) {
          formCustomizeCarFieldsLabels[formCustomizeCarFieldIndex] = p.innerText;
        }

        label.append(formCustomizeCarFieldsLabels[formCustomizeCarFieldIndex]);
        const wrapperEl = document.createElement('div');
        wrapperEl.id = formCustomizeCarFields[formCustomizeCarFieldIndex].name;
        wrapperEl.className = 'wrapper-inline';

        wrapperEl.append(label);

        if (formCustomizeCarFields[formCustomizeCarFieldIndex].name === 'formLabelCar_Variant') {
          const el_selectVariant = document.createElement('select');
          el_selectVariant.id = formCustomizeCarFields[formCustomizeCarFieldIndex].name;

          responseVehicleList.Table.forEach(async (vehicle, index) => {
            const responseVehicleDetail = await getAutoDetailOnNVIC(vehicle.NVIC_CUR);
            if (index === 0) {
              const responseVehicleImage = await getVehicleImageOnNVIC(vehicle.NVIC_CUR);
              responseVehicleImage.arrayBuffer().then((buffer) => {
                let binary = '';
                const bytes = [].slice.call(new Uint8Array(buffer));
                bytes.forEach((b) => {
                  binary += String.fromCharCode(b);
                });
                const imageStr = window.btoa(binary);
                carImg.src = `data:image/jpeg;base64,${imageStr}`;
                const el_carImgDesc = document.createElement('div');
                el_carImgDesc.innerText = 'image is indicative only';
                el_carImgDesc.className = 'img-sub-text';
                el_calcCarDetailCol1.append(el_carImgDesc);
              });
            }
            const el_variantOption = document.createElement('option');
            el_variantOption.setAttribute('value', vehicle.NVIC_CUR);
            el_variantOption.innerText = `${responseVehicleDetail.Table[0].VariantName} ${responseVehicleDetail.Table[0].SeriesName} ${responseVehicleDetail.Table[0].BodyName} - $${vehicle.RRP.Amount}`;
            el_selectVariant.append(el_variantOption);
            selectedNVIC = el_selectVariant.value;
            el_selectVariant.addEventListener('change', async () => {
              selectedNVIC = el_selectVariant.value;
              const responseVehicleImage = await getVehicleImageOnNVIC(el_selectVariant.value);
              responseVehicleImage.arrayBuffer().then((buffer) => {
                let binary = '';
                const bytes = [].slice.call(new Uint8Array(buffer));
                bytes.forEach((b) => {
                  binary += String.fromCharCode(b);
                });
                const imageStr = window.btoa(binary);
                carImg.src = `data:image/jpeg;base64,${imageStr}`;
              });
            });
            wrapperEl.append(el_selectVariant);
          });
        } else if (formCustomizeCarFields[formCustomizeCarFieldIndex].name === 'formLabelCar_EstimatedTravel') {
          const el_dataListKmsTravelled = document.createElement('datalist');
          el_dataListKmsTravelled.setAttribute('id', 'data-list-kms');
          for (let i = 1; i <= 15; i++) {
            const el_dlKmsOption = document.createElement('option');
            el_dlKmsOption.setAttribute('value', i * 1000 + 1000);
            el_dlKmsOption.innerText = `${i * 1000 + 1000}`;
            el_dataListKmsTravelled.append(el_dlKmsOption);
          }

          el_inputKmsTravelled.id = formCustomizeCarFields[formCustomizeCarFieldIndex].name;
          el_inputKmsTravelled.setAttribute('type', 'range');
          el_inputKmsTravelled.setAttribute('min', '10000');
          el_inputKmsTravelled.setAttribute('max', '25000');
          el_inputKmsTravelled.setAttribute('step', '1000');
          el_inputKmsTravelled.setAttribute('value', '10000');
          el_inputKmsTravelled.setAttribute('list', 'data-list-kms');

          const el_kmsTravelledWrapper = document.createElement('div');
          el_kmsTravelledWrapper.className = 'kms-wrapper';
          const el_kmsTravelledWrapperCol1 = document.createElement('div');
          el_kmsTravelledWrapperCol1.className = 'col';
          const el_kmsTravelledWrapperCol2 = document.createElement('div');
          el_kmsTravelledWrapperCol2.className = 'col';
          el_kmsTravelledWrapper.append(el_kmsTravelledWrapperCol1);
          el_kmsTravelledWrapper.append(el_kmsTravelledWrapperCol2);
          const el_kmsTravelledSelectedValue = document.createElement('span');
          el_kmsTravelledSelectedValue.className = 'formValue';
          el_kmsTravelledSelectedValue.innerText = `${el_inputKmsTravelled.value} Km`;

          el_inputKmsTravelled.addEventListener('change', () => {
            el_kmsTravelledSelectedValue.innerText = `${el_inputKmsTravelled.value} Km`;
          });

          el_kmsTravelledWrapperCol1.append(el_inputKmsTravelled);
          const el_kmsTravelledIndicator = document.createElement('div');
          el_kmsTravelledIndicator.className = 'range-indicator-wrapper';
          const el_kmsTravelledMinIndicator = document.createElement('span');
          el_kmsTravelledMinIndicator.className = 'min';
          el_kmsTravelledMinIndicator.innerText = '10,000 km';
          const el_kmsTravelledMaxIndicator = document.createElement('span');
          el_kmsTravelledMaxIndicator.className = 'max';
          el_kmsTravelledMaxIndicator.innerText = '25,000 km';
          el_kmsTravelledIndicator.append(el_kmsTravelledMinIndicator);
          el_kmsTravelledIndicator.append(el_kmsTravelledMaxIndicator);
          el_kmsTravelledWrapperCol1.append(el_kmsTravelledIndicator);
          el_kmsTravelledWrapperCol2.append(el_kmsTravelledSelectedValue);
          wrapperEl.append(el_kmsTravelledWrapper);
        } else if (formCustomizeCarFields[formCustomizeCarFieldIndex].name === 'formLabelCar_LeaseTerm') {
          const el_leaseTermWrapper = document.createElement('div');
          el_leaseTermWrapper.className = 'lease-term-wrapper';
          for (let i = 1; i <= 5; i++) {
            const el_leaseTerm = document.createElement('span');
            el_leaseTerm.setAttribute('id', `leaseTerm-${i}`);
            el_leaseTerm.className = 'formValue';
            if (i == 1) {
              el_leaseTerm.innerText = `${i} year`;
            } else {
              el_leaseTerm.innerText = `${i} years`;
            }
            el_leaseTerm.addEventListener('click', () => {
              if (el_leaseTerm.innerText === '1 year') {
                leaseTermSelected = '1';
              } else if (el + el_leaseTerm.innerText === '2 years') {
                leaseTermSelected = '2';
              } else if (el + el_leaseTerm.innerText === '3 years') {
                leaseTermSelected = '3';
              } else if (el + el_leaseTerm.innerText === '4 years') {
                leaseTermSelected = '4';
              } else if (el + el_leaseTerm.innerText === '5 years') {
                leaseTermSelected = '5';
              }
              document.querySelectorAll('[id^=leaseTerm-].formValue').forEach((leaseTermEl) => {
                leaseTermEl.classList.remove('selected');
              });
              el_leaseTerm.classList.add('selected');
            });
            el_leaseTermWrapper.append(el_leaseTerm);
          }
          wrapperEl.append(el_leaseTermWrapper);
        }

        p.textContent = '';
        p.remove();
        item.append(wrapperEl);
        formCustomizeCarFieldIndex += 1;
      });
    });

    carDetail.append(formCarLabels);

    el_calcCarDetailCol2.append(carDetail);

    el_calcCarDetailWrapper.append(el_calcCarDetailCol1);
    el_calcCarDetailWrapper.append(el_calcCarDetailCol2);
    el_calcCarView.style.display = 'block';
    el_calcCarView.append(el_calcCarDetailWrapper);

    const el_btnNext = document.createElement('button');
    el_btnNext.innerText = 'Next';
    el_btnNext.className = 'button';

    el_calcSearchView.style.display = 'none';

    // Next button click event in Customise car view
    el_btnNext.addEventListener('click', () => {
      if (el_calcAboutYouView != null) {
        el_calcAboutYouView.innerHTML = '';
      }

      //Calculator About You - UI section
      el_calcCarView.style.display = 'none';
      el_calcSearchView.style.display = 'none';
      el_calcAboutYouView.style.display = 'block';

      el_calcAboutYouView.className = 'view-about-you';
      el_calcAboutYouView.id = 'view-about-you';

      el_calcCustomizeCar.classList.remove('selected');
      el_calcAboutYou.className = 'selected';

      el_calcAboutYouView.append(el_calcCarSelectionViewList);

      const el_calcAboutYouWrapper = document.createElement('div');
      el_calcAboutYouWrapper.className = 'wrapper';
      const el_calcAboutYouWrapperCol1 = document.createElement('div');
      el_calcAboutYouWrapperCol1.className = 'col';
      const el_calcAboutYouWrapperCol2 = document.createElement('div');
      el_calcAboutYouWrapperCol2.className = 'col';

      // About you view description UI:
      [...aboutViewDescription.children].forEach((item) => {
        [...item.children].forEach((el, index) => {
          const el_aboutYouDescription = document.createElement('div');
          el_aboutYouDescription.className = 'text-left';

          // Initialize only once through the elements in loop
          if (formAboutYouFieldDescription.length != item.children.length) {
            formAboutYouFieldDescription[index] = el.innerText;
          }

          el_aboutYouDescription.innerText = formAboutYouFieldDescription[index];
          el_calcAboutYouWrapperCol1.append(el_aboutYouDescription);
          el.style.display = 'none';
        });
      });

      let formAboutYouFieldIndex = 0;

      // About you view form fields UI:
      [...formYouLabels.children].forEach((item) => {
        [...item.children].forEach((el) => {
          const label = document.createElement('div');
          label.className = 'form-label';
          label.setAttribute('data-aue-prop', formAboutYouFields[formAboutYouFieldIndex].name);

          // Initialize once through the elements in loop
          if (formAboutYouFieldsLabels.length != item.children.length) {
            formAboutYouFieldsLabels[formAboutYouFieldIndex] = el.innerText;
          }

          label.append(formAboutYouFieldsLabels[formAboutYouFieldIndex]);
          const el_wrapperSalary = document.createElement('div');
          el_wrapperSalary.className = 'wrapper-inline';
          el_wrapperSalary.append(label);

          const el_formCtrlSalary = document.createElement('div');
          el_formCtrlSalary.className = 'form-ctrl-currency';

          el_inputSalary.id = formAboutYouFields[formAboutYouFieldIndex].name;
          el_inputSalary.className = 'input-salary';
          el_inputSalary.setAttribute('type', 'number');
          el_inputSalary.innerText = '100000';
          el_inputSalary.value = '100000';
          el_formCtrlSalary.append(el_inputSalary);

          el_wrapperSalary.append(el_formCtrlSalary);
          el_calcAboutYouWrapperCol2.append(el_wrapperSalary);

          formAboutYouFieldIndex += 1;
        });
      });

      el_calcAboutYouWrapper.append(el_calcAboutYouWrapperCol1);
      el_calcAboutYouWrapper.append(el_calcAboutYouWrapperCol2);

      el_calcAboutYouView.append(el_calcAboutYouWrapper);

      const el_btnShowResult = document.createElement('button');
      el_btnShowResult.innerText = 'Show results';
      el_btnShowResult.className = 'button';
      el_btnShowResult.addEventListener('click', async () => {
        if (el_calcResultView != null) {
          el_calcResultView.innerHTML = '';
        }

        let calculatorResponseError = '';
        // Get Calculator API result
        try {
          calculatorResponse = await getCalculatorResult();
        } catch {
          calculatorResponseError = 'Error fetching the calculator result';
        }

        //Setup the results view
        el_calcSearchView.style.display = 'none';
        el_calcCarView.style.display = 'none';
        el_calcAboutYouView.style.display = 'none';

        el_calcResultView.className = 'view-results';
        el_calcResultView.id = 'view-results';
        el_calcResultView.style.display = 'block';

        el_calcCustomizeCar.classList.remove('selected');
        el_calcAboutYou.classList.remove('selected');
        el_calcResult.className = 'selected';

        el_calcResultView.append(el_calcCarSelectionViewList);

        // Build the result view here
        const el_calcResultDetailWrapper = document.createElement('div');
        el_calcResultDetailWrapper.className = 'wrapper';
        const el_calcResultDetailCol2 = document.createElement('div');
        el_calcResultDetailCol2.className = 'col';

        const carResultDetail = document.createElement('div');
        carResultDetail.className = 'detail';
        carResultDetail.id = 'car-result-detail';
        const carResultMakeModel = document.createElement('h4');
        const slctResultYear = document.getElementById(formFields[0].name);
        const slctResultMake = document.getElementById(formFields[1].name);
        const slctResultModel = document.getElementById(formFields[2].name);

        carResultMakeModel.innerText = `${slctResultYear.options[slctResultYear.selectedIndex].text} ${slctResultMake.options[slctResultMake.selectedIndex].text} ${slctResultModel.options[slctResultModel.selectedIndex].text}`;
        carResultDetail.append(carMakeModel);

        const el_variantSelected = document.createElement('div');
        el_variantSelected.className = 'selected-variant';
        const responseVehicleDetail = await getAutoDetailOnNVIC(selectedNVIC);
        el_variantSelected.innerText = `${responseVehicleDetail.Table[0].VariantName} ${responseVehicleDetail.Table[0].SeriesName} ${responseVehicleDetail.Table[0].BodyName} ${responseVehicleDetail.Table[0].Engine_ConfigName} ${responseVehicleDetail.Table[0].TransmissionName}`;
        carResultDetail.append(el_variantSelected);

        // Populate the tabs in the result
        const el_tabItem = document.createElement('div');
        el_tabItem.className = 'tab-titles-wrapper';
        const el_tabDetails = document.createElement('div');
        el_tabDetails.className = 'tab-detail-wrapper';

        [...resultsViewDescription.children].forEach((item) => {
          [...item.children].forEach((el, index) => {
            const tabItem = document.createElement('div');
            tabItem.className = 'tab-item';
            const tabItemTitle = document.createElement('div');
            tabItemTitle.className = 'tab-title';
            tabItemTitle.innerText = el.innerText;
            // Tab item click to change the details
            tabItemTitle.addEventListener('click', () => {
              document.querySelectorAll('.nl-calculator .tab-titles-wrapper .tab-title').forEach((item) => {
                item.classList.remove('selected');

                //Hide all the detail
                document.querySelectorAll('.nl-calculator .tab-detail-wrapper .tab-detail').forEach((item) => {
                  item.style.display = 'none';
                });

                document.querySelector(
                  `.nl-calculator .tab-detail-wrapper > .tab-detail:nth-child(${index + 1})`,
                ).style.display = 'block';
              });
              tabItemTitle.classList.add('selected');
            });
            const tabItemDetail = document.createElement('div');
            tabItemDetail.className = 'tab-detail';

            tabItemDetail.style.display = 'none';

            if (index === 0) {
              //Finance breakdown
              const el_keyFinanceSavingsWrapper = document.createElement('div');
              el_keyFinanceSavingsWrapper.className = 'container';

              const el_keyFinanceSavingsLabel = document.createElement('div');
              el_keyFinanceSavingsLabel.innerText = 'How much could I save?';
              el_keyFinanceSavingsLabel.className = 'title';

              const el_keyFinanceSavingsValue = document.createElement('div');
              el_keyFinanceSavingsValue.innerText = `$ ${Math.round(calculatorResponse.taxBenefits)}`;
              el_keyFinanceSavingsValue.className = 'value';

              el_keyFinanceSavingsWrapper.append(el_keyFinanceSavingsLabel);
              el_keyFinanceSavingsWrapper.append(el_keyFinanceSavingsValue);

              const el_keyFinanceCostWrapper = document.createElement('div');
              el_keyFinanceCostWrapper.className = 'finance-cost';

              const el_keyFinanceCostCol1 = document.createElement('div');
              el_keyFinanceCostCol1.className = 'col';

              const el_keyFinanceWeeklyCostLabel = document.createElement('div');
              el_keyFinanceWeeklyCostLabel.className = 'label';
              el_keyFinanceWeeklyCostLabel.innerText = 'Weekly Cost';

              const el_keyFinanceWeeklyCostValue = document.createElement('div');
              el_keyFinanceWeeklyCostValue.className = 'label-value';
              el_keyFinanceWeeklyCostValue.innerText = `$ ${Math.round(calculatorResponse.vehicleCostsPreTax / 52)}`;

              el_keyFinanceCostCol1.append(el_keyFinanceWeeklyCostLabel);
              el_keyFinanceCostCol1.append(el_keyFinanceWeeklyCostValue);

              const el_keyFinanceCostCol2 = document.createElement('div');
              el_keyFinanceCostCol2.className = 'col';

              const el_keyFinanceFortnightlyCostLabel = document.createElement('div');
              el_keyFinanceFortnightlyCostLabel.className = 'label';
              el_keyFinanceFortnightlyCostLabel.innerText = 'Fortnightly Cost';

              const el_keyFinanceFortnightlyCostValue = document.createElement('div');
              el_keyFinanceFortnightlyCostValue.className = 'label-value';
              el_keyFinanceFortnightlyCostValue.innerText = `$ ${Math.round(calculatorResponse.vehicleCostsPreTax / 26)}`;

              el_keyFinanceCostCol2.append(el_keyFinanceFortnightlyCostLabel);
              el_keyFinanceCostCol2.append(el_keyFinanceFortnightlyCostValue);

              const el_keyFinanceCostCol3 = document.createElement('div');
              el_keyFinanceCostCol3.className = 'col';

              const el_keyFinanceMonthlyCostLabel = document.createElement('div');
              el_keyFinanceMonthlyCostLabel.className = 'label';
              el_keyFinanceMonthlyCostLabel.innerText = 'Monthly Cost';

              const el_keyFinanceMonthlyCostValue = document.createElement('div');
              el_keyFinanceMonthlyCostValue.className = 'label-value';
              el_keyFinanceMonthlyCostValue.innerText = `$ ${Math.round(calculatorResponse.vehicleCostsPreTax / 12)}`;

              el_keyFinanceCostCol3.append(el_keyFinanceMonthlyCostLabel);
              el_keyFinanceCostCol3.append(el_keyFinanceMonthlyCostValue);

              el_keyFinanceCostWrapper.append(el_keyFinanceCostCol1);
              el_keyFinanceCostWrapper.append(el_keyFinanceCostCol2);
              el_keyFinanceCostWrapper.append(el_keyFinanceCostCol3);

              tabItemDetail.append(el_keyFinanceSavingsWrapper);
              tabItemDetail.append(el_keyFinanceCostWrapper);

              const el_financeDisclaimer = document.createElement('div');
              el_financeDisclaimer.className = 'disclaimer';
              el_financeDisclaimer.innerText = `*Estimated lease payment based on an annual salary of $${el_inputSalary.value} estimated annual travel of ${el_inputKmsTravelled.value}km, and a lease term of ${leaseTermSelected} years.`;

              tabItemDetail.append(el_financeDisclaimer);
            } else if (index === 1) {
              const el_keyFeatureWrapper = document.createElement('div');
              el_keyFeatureWrapper.className = 'wrapper';

              const el_keyFeatureWrappercol1 = document.createElement('div');
              el_keyFeatureWrappercol1.className = 'col';

              const el_keyFeatureWrappercol2 = document.createElement('div');
              el_keyFeatureWrappercol2.className = 'col';

              const el_keyFeatureLabel = document.createElement('div');
              el_keyFeatureLabel.className = 'label-title';
              el_keyFeatureLabel.innerText = 'Key features';

              const el_keyFeatureSpeed = document.createElement('div');
              el_keyFeatureSpeed.className = 'label';
              el_keyFeatureSpeed.innerText = `${responseVehicleDetail.Table[0].SeriesName}`;

              const el_keyFeatureFuelType = document.createElement('div');
              el_keyFeatureFuelType.className = 'label';
              el_keyFeatureFuelType.innerText = `${responseVehicleDetail.Table[0].EngineName}`;

              const el_keyFeatureSeats = document.createElement('div');
              el_keyFeatureSeats.className = 'label';
              el_keyFeatureSeats.innerText = `${responseVehicleDetail.Table[0].NoOfSeats} seats`;

              const el_keyFeatureANCAP = document.createElement('div');
              el_keyFeatureANCAP.className = 'label';
              el_keyFeatureANCAP.innerText = `${responseVehicleDetail.Table[0].ANCAP} star ANCAP safety rating`;

              const el_keyFeatureCarbonSavings = document.createElement('div');
              el_keyFeatureCarbonSavings.className = 'label';
              el_keyFeatureCarbonSavings.innerText = `${responseVehicleDetail.Table[0].CO2Emission}g/km CO2 emmissions`;

              el_keyFeatureWrappercol1.append(el_keyFeatureLabel);
              el_keyFeatureWrappercol1.append(el_keyFeatureSpeed);
              el_keyFeatureWrappercol1.append(el_keyFeatureFuelType);
              el_keyFeatureWrappercol1.append(el_keyFeatureSeats);
              el_keyFeatureWrappercol1.append(el_keyFeatureANCAP);
              el_keyFeatureWrappercol1.append(el_keyFeatureCarbonSavings);
              el_keyFeatureWrapper.append(el_keyFeatureWrappercol1);

              const el_keyNLInclusionsLabel = document.createElement('div');
              el_keyNLInclusionsLabel.className = 'label-title';
              el_keyNLInclusionsLabel.innerText = 'Novated lease inclusions';

              const el_keyNLInclusionsCarPayment = document.createElement('div');
              el_keyNLInclusionsCarPayment.className = 'label';
              el_keyNLInclusionsCarPayment.innerText = `Car payments`;

              const el_keyNLInclusionsRegularServicing = document.createElement('div');
              el_keyNLInclusionsRegularServicing.className = 'label';
              el_keyNLInclusionsRegularServicing.innerText = `Regular servicing`;

              const el_keyNLInclusionsCharging = document.createElement('div');
              el_keyNLInclusionsCharging.className = 'label';
              el_keyNLInclusionsCharging.innerText = `Charging costs`;

              const el_keyNLInclusionsTyres = document.createElement('div');
              el_keyNLInclusionsTyres.className = 'label';
              el_keyNLInclusionsTyres.innerText = `Tyres`;

              const el_keyNLInclusionsRego = document.createElement('div');
              el_keyNLInclusionsRego.className = 'label';
              el_keyNLInclusionsRego.innerText = `Rego`;

              el_keyFeatureWrappercol2.append(el_keyNLInclusionsLabel);
              el_keyFeatureWrappercol2.append(el_keyNLInclusionsCarPayment);
              el_keyFeatureWrappercol2.append(el_keyNLInclusionsRegularServicing);
              el_keyFeatureWrappercol2.append(el_keyNLInclusionsCharging);
              el_keyFeatureWrappercol2.append(el_keyNLInclusionsTyres);
              el_keyFeatureWrappercol2.append(el_keyNLInclusionsRego);

              el_keyFeatureWrapper.append(el_keyFeatureWrappercol1);
              el_keyFeatureWrapper.append(el_keyFeatureWrappercol2);

              tabItemDetail.append(el_keyFeatureWrapper);
              tabItemDetail.append(el_break);
              tabItemDetail.append(el_break);
            } else if (index === 2) {
              //Comparison View
            }

            tabItem.append(tabItemTitle);
            el_tabItem.append(tabItem);
            el_tabDetails.append(tabItemDetail);
          });
        });

        carResultDetail.append(el_tabItem);
        carResultDetail.append(el_tabDetails);

        el_calcResultDetailCol2.append(carResultDetail);

        el_calcResultDetailWrapper.append(el_calcCarDetailCol1);
        el_calcResultDetailWrapper.append(el_calcResultDetailCol2);
        el_calcResultView.append(el_calcResultDetailWrapper);

        el_calcViews.append(el_calcResultView);
      });

      el_calcAboutYouView.append(el_btnShowResult);

      el_calcViews.append(el_calcAboutYouView);
    });
    el_calcCarView.append(el_btnNext);
    el_calcViews.append(el_calcCarView);
  });

  el_searchViewCol1.append(el_btnSearch);

  el_calcSearchView.append(el_searchViewCol1);
  el_calcSearchView.append(el_searchViewCol2);

  el_calcViews.append(el_calcSearchView);

  el_calcContainer.append(el_calcViews);

  //Back to search - UI section
  const el_calcBackToSearch = document.createElement('div');
  el_calcBackToSearch.className = 'back-to-search';
  const el_linkToSearch = document.createElement('span');
  el_linkToSearch.className = 'link';
  el_linkToSearch.innerText = '< Back to search';
  el_linkToSearch.addEventListener('click', () => {
    if (typeof el_calcCarView !== 'undefined' && el_calcCarView != null) el_calcCarView.style.display = 'none';
    if (typeof el_calcAboutYouView !== 'undefined' && el_calcAboutYouView != null)
      el_calcAboutYouView.style.display = 'none';
    if (typeof el_calcResultView !== 'undefined' && el_calcResultView != null) el_calcResultView.style.display = 'none';

    el_calcSearchView.style.display = 'grid';
  });
  el_calcBackToSearch.append(el_linkToSearch);
  el_calcContainer.append(el_calcBackToSearch);

  block.append(el_calcContainer);

  /******************************** */

  [...apiDetails.children].forEach((item) => {
    [...item.children].forEach((el, index) => {
      if (index == 0) {
        localStorage.setItem('calculatorAPIUrl', el.innerHTML);
      } else if (index === 1) {
        localStorage.setItem('calculatorAPIKey', el.innerHTML);
      } else if (index === 2) {
        localStorage.setItem('maxxiacalculatorAPIKey', el.innerHTML);
      }
      el.textContent = '';
      el.style.display = 'none';
    });
  });
}
