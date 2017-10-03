let origImgObj = {
	el: undefined,
	selectedIndex: 0,
	scale: 1,
	translate: {
		x: 0,
		y: 0
	}
};

let fullGalleryOpen = false;

let fullGallery = document.getElementById('fullGallery');
let thumbs = document.getElementsByClassName('photoThumb');

let photoList = [
	'cooper_scarf.jpg',
	'lucca.jpg',
	'cooper_scruff.jpg'
];

let paths = {
	thumb : './assets/thumb/',
	med 	: './assets/med/',
	large : './assets/large/'
};

const galleryPadding = 100;


function initGallery(event) {
	let el = event.srcElement;
	let img = document.createElement('img');
	let highResImg = document.createElement('img');

	// Prevent clicking on hidden thumbnails
	if(!fullGalleryOpen) {
		fullGalleryOpen = true;
		origImgObj.el = el;

		origImgObj.selectedIndex = findSelectedIndex(el);

		createAndAttachImage(el, img, highResImg);
		scaleAndTranslateImageToFull(el, img, highResImg);
		// createAndAttachSideImages();
	}
}

function createAndAttachSideImages() {
	for(let i = 0; i < photoList.length; i++) {
		if(i == origImgObj.selectedIndex) {
			continue;
		}else {
			let range = i - origImgObj.selectedIndex;
			let img = document.createElement('img');
			let highResImg = document.createElement('img');
			let scale = calcScale(thumbs[i].width, thumbs[i].height);

			setImageSrc(img, highResImg, origImgObj.selectedIndex);
			setImageDims(img, highResImg, thumbs[i].width, thumbs[i].height);
		}
	}
}

function setImageSrc(img, highResImg, index) {
	img.src = paths.thumb + photoList[index];
	highResImg.src = paths.med + photoList[index];
}

function setImageDims(img, highResImg, width, height) {
	img.style.width = width + 'px';
	img.style.height = height + 'px';
	highResImg.style.width = width + 'px';
	highResImg.style.height = height + 'px';
}

// Attaches the gallery image to the thumbnail location
function createAndAttachImage(el, img, highResImg) {
	let elRect = el.getBoundingClientRect();

	// The following manages transitioning between low and high quality images
	// All transformations must be applied to both images, since we don't know
	// how long it will take the image to load and they must stay together.
	setImageSrc(img, highResImg, origImgObj.selectedIndex);

	fullGallery.appendChild(highResImg);
	fullGallery.appendChild(img);

	setImageDims(img, highResImg, el.width, el.height);

	img.style.transform = `translate(${el.x}px, ${el.y}px`;
	highResImg.style.transform = `translate(${el.x}px, ${el.y}px`;


	fullGallery.style.display = 'inline';
	setTimeout(function() {
		fullGallery.style.background = 'black';
	}, 10);

	highResImg.onload = function() {
		img.style.opacity = 0;

		// Delete low quality image
		img.addEventListener('transitionend', function() {
			if(img && img.parentNode) {
				img.parentNode.removeChild(img);
			}
		});
  };
}

function scaleAndTranslateImageToFull(el, img, highResImg) {
	let scale = calcScale(el.width, el.height);
	let translate = calcTranslate(scale, el.width, el.height);

	el.style.visibility = 'hidden';
	img.style.transition = 'all .5s ease';
	img.style.transform = `translate(${translate.x}px, ${translate.y}px) scale(${scale})`;
	highResImg.style.transition = 'all .5s ease';
	highResImg.style.transform = `translate(${translate.x}px, ${translate.y}px) scale(${scale})`;
}

function calcScale(currWidth, currHeight) {
	let maxWinWidthScale = (window.innerWidth / currWidth) - (galleryPadding / currWidth);
	let maxWinHeightScale = (window.innerHeight / currHeight) - (galleryPadding / currHeight);

	return Math.min(maxWinWidthScale, maxWinHeightScale);
}

function calcTranslate(scale, currWidth, currHeight) {
	let winXCenter = window.innerWidth / 2;
	let winYCenter = window.innerHeight / 2;

	return {
		x: winXCenter - currWidth / 2 ,
		y: winYCenter - currHeight / 2
	};
}

function closeGallery() {
	let childNodes = fullGallery.childNodes;

	for(let i = 0; i < childNodes.length; i++) {
		if(childNodes[i].nodeType == 1) { // 1 = image
			// Fix to keep image from teleporting back to start
			window.requestAnimationFrame(function() {
				let rect = childNodes[i].getBoundingClientRect();
				let intermediateWidth = rect.right - rect.left;
				let intermediateHeight = rect.bottom - rect.top;
				let intermediateScale = intermediateWidth / origImgObj.el.width;
				// Find the difference between current and orig dimensions
				let intermediateX = rect.left + (intermediateWidth - origImgObj.el.width) / 2;
				let intermediateY = rect.top + (intermediateHeight - origImgObj.el.height) / 2;

				// Stop the animation in its tracks
				childNodes[i].style.transition = '';
				childNodes[i].style.transform = `translate(${intermediateX}px, ${intermediateY}px) scale(${intermediateScale})`;

				// Move back to origin after allowing animation to end
				fullGallery.style.background = '';
				setTimeout(function() {
					childNodes[i].style.transition = 'all .5s ease';
					childNodes[i].style.transform = `translate(${origImgObj.el.x}px, ${origImgObj.el.y}px) scale(1)`;

					childNodes[i].addEventListener('transitionend', function() {
						origImgObj.el.style.visibility = 'visible';
						fullGallery.style.display = 'none';

						// Remove all gallery images
						while (fullGallery.hasChildNodes()) {
							fullGallery.removeChild(fullGallery.lastChild);
						}

						fullGalleryOpen = false;

					});
				}, 20);
			});
		}
	}
}

function findSelectedIndex(el) {
	return photoList.findIndex(name => {
		return el.src && el.src.includes(name);
	});
}


// Event Listeners:

for(let i = 0; i < thumbs.length; i++) {
	thumbs[i].addEventListener('click', initGallery);
}

document.addEventListener('keydown', function(event) {
	if(event.keyCode == 27) {
		closeGallery();
	}
});