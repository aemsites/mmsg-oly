export default function decorate(block) {
  const sectionNoOlyProps = [
    { name: 'no_oly_badge' },
    { name: 'no_oly_vehicle_image' },
    { name: 'no_oly_description' },
    { name: 'no_oly_vehicle_price' },
    { name: 'no_oly_vehicle_price_description' },
    { name: 'no_oly_figure_title' },
    { name: 'no_oly_salary_title' },
    { name: 'no_oly_salary_value' },
    { name: 'no_oly_car_title' },
    { name: 'no_oly_car_value' },
    { name: 'no_oly_lease_title' },
    { name: 'no_oly_lease_value' },
  ];
  const sectionWithOlyProps = [
    { name: 'with_oly_badge' },
    { name: 'with_oly_vehicle_image' },
    { name: 'with_oly_description' },
    { name: 'with_oly_vehicle_price' },
    { name: 'with_oly_vehicle_price_description' },
    { name: 'with_oly_figure_title' },
    { name: 'with_oly_salary_title' },
    { name: 'with_oly_salary_value' },
    { name: 'with_oly_car_title' },
    { name: 'with_oly_car_value' },
    { name: 'with_oly_lease_title' },
    { name: 'with_oly_lease_value' },
  ];
  const [sectionNoOly, sectionWithOly] = block.children;
  sectionNoOly.className = 'no-oly';
  sectionWithOly.className = 'with-oly';
  let sectionNoOnlyIndex = 0;

  [...sectionNoOly.children].forEach((item) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'wrapper';
    [...item.children].forEach((p) => {
      p.setAttribute('data-aue-prop', sectionNoOlyProps[sectionNoOnlyIndex].name);
      if (
        sectionNoOlyProps[sectionNoOnlyIndex].name === 'no_oly_vehicle_price' ||
        sectionNoOlyProps[sectionNoOnlyIndex].name === 'no_oly_vehicle_price_description'
      ) {
        wrapper.append(p);
        item.append(wrapper);
      } else {
        item.append(p);
      }
      sectionNoOnlyIndex += 1;
    });
  });

  let sectionWithOnlyIndex = 0;
  [...sectionWithOly.children].forEach((item) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'wrapper';
    [...item.children].forEach((p) => {
      p.setAttribute('data-aue-prop', sectionWithOlyProps[sectionWithOnlyIndex].name);
      if (
        sectionWithOlyProps[sectionWithOnlyIndex].name === 'with_oly_vehicle_price' ||
        sectionWithOlyProps[sectionWithOnlyIndex].name === 'with_oly_vehicle_price_description'
      ) {
        wrapper.append(p);
        item.append(wrapper);
      } else {
        item.append(p);
      }
      sectionWithOnlyIndex += 1;
    });
  });
}
