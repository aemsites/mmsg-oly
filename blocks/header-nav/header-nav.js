export default function decorate(block) {
	const isAboveMobile = window.matchMedia('(min-width: 768px)');
	const divider = document.createElement('span');
	const dividerInner = document.createElement('span');
	dividerInner.classList.add('divider');
	divider.classList.add('divider');
	divider.classList.add('divider-row');
	
	[...block.children].forEach((row, index) => {
		if (index === 1) {
			if (!isAboveMobile.matches) {
				row.addEventListener('click', function () {
					this.nextElementSibling.classList.toggle('inactive');
				});
			}
		} else if (index === 2) {
			row.parentNode.insertBefore(divider, row.nextSibling);
			!isAboveMobile.matches ? row.classList.add('inactive') : null;
			let links = [...row.firstElementChild.firstElementChild.children];
			links.forEach((col,index) => {
				if(links.length-1 !== index){
					col.insertAdjacentHTML("afterend", dividerInner.outerHTML); 
				}
			})
			if (row.firstElementChild?.firstElementChild?.children?.length > 8) {
				row.firstElementChild?.firstElementChild?.classList.add('link-arrows');
			}
		}
	});
}
