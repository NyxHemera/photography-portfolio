function initGallery(event) {
	console.log(event);
	let el = event.srcElement;
	let gallery = document.getElementById('fullGallery');
	let img = document.createElement("img");
	let highResImg = document.createElement("img");


	createAndAttachImage(el, img, highResImg, gallery);
	scaleAndTranslateImageToFull(el, img, highResImg);
}

function createAndAttachImage(el, img, highResImg, gallery) {
	let elRect = el.getBoundingClientRect();

	img.src = './assets/luccaSmall.jpg';
	highResImg.src = './assets/luccaMed.jpg';

	gallery.appendChild(highResImg);
	gallery.appendChild(img);

	img.style.transform = `translate(${elRect.x}px, ${elRect.y}px`;
	img.style.width = el.width + 'px';
	img.style.height = el.height + 'px';

	highResImg.style.transform = `translate(${elRect.x}px, ${elRect.y}px`;
	highResImg.style.width = el.width + 'px';
	highResImg.style.height = el.height + 'px';

	gallery.style.display = 'inline';

	highResImg.onload = function() {
		img.style.opacity = 0;
  };
}

function scaleAndTranslateImageToFull(el, img, highResImg) {
	let scale = calcScale(1770, 2825, el.width, el.height, 100);
	let translate = calcTranslate(scale, el.width, el.height);

	el.style.visibility = 'hidden';
	img.style.transition = 'all .5s ease';
	img.style.transform = `translate(${translate.x}px, ${translate.y}px) scale(${scale})`;
	highResImg.style.transition = 'all .5s ease';
	highResImg.style.transform = `translate(${translate.x}px, ${translate.y}px) scale(${scale})`;
}

document.addEventListener("keydown", function(event) {
	if(event.keyCode == 27) {
		// closeThumbs();
	}
});

function calcScale(imgWidth, imgHeight, currWidth, currHeight, padding) {
	let windowWidth = window.innerWidth;
	let windowHeight = window.innerWidth;

	let maxWinWidthScale = windowWidth / currWidth - padding / currWidth;
	let maxWinHeightScale = windowHeight / currHeight - padding / currHeight;
	let maxImgWidthScale = imgWidth / currWidth - padding / currWidth;
	let maxImgHeightScale = imgHeight / currHeight - padding / currHeight;

	return Math.min(maxWinWidthScale, maxWinHeightScale, maxImgWidthScale, maxImgHeightScale) - 1;
}

function calcTranslate(scale, currWidth, currHeight) {
	let winXCenter = window.innerWidth / 2;
	let winYCenter = window.innerHeight / 2;

	return {
		x: winXCenter - currWidth / 2 ,
		y: winYCenter - currHeight / 2
	};
}




new Vue({
	el: '.photoThumb',
	data: {}
});

let thumbs = document.getElementsByClassName('photoThumb');

for(let i = 0; i < thumbs.length; i++) {
	thumbs[i].addEventListener("click", initGallery);
}