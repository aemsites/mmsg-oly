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
  const [titleBg, title, sectionNoOly, sectionWithOly] = block.children;
  debugger;
  titleBg.className = 'bg-image';
  title.className = 'fg-overlay-content';
  sectionNoOly.className = 'no-oly';
  sectionWithOly.className = 'with-oly';
  let sectionNoOnlyIndex = 0;
  [...sectionNoOly.children].forEach((item) => {
    [...item.children].forEach((p) => {
      p.setAttribute('data-aue-prop', sectionNoOlyProps[sectionNoOnlyIndex].name);
      sectionNoOnlyIndex += 1;
    });
  });
}
