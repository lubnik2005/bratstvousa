'use strict';

// Back to top button
window.addEventListener('scroll', () => {
	const backToTop = document.querySelector('.back-to-top');
	if (window.scrollY > 300) {
		backToTop.style.display = 'block';
		backToTop.style.opacity = '1';
		backToTop.style.transition = 'opacity 0.6s';
	} else {
		backToTop.style.opacity = '0';
		setTimeout(() => {
			if (window.scrollY <= 300) backToTop.style.display = 'none';
		}, 600);
	}
});

document.querySelector('.back-to-top').addEventListener('click', (e) => {
	e.preventDefault();
	window.scrollTo({
		top: 0,
		behavior: 'smooth'
	});
});
