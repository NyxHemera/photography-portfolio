let origImgObj = {
	el: undefined,
	scale: 1,
	translate: {
		x: 0,
		y: 0
	}
};

let fullGalleryOpen = false;

let fullGallery = document.getElementById('fullGallery');


function initGallery(event) {
	let el = event.srcElement;
	let img = document.createElement("img");
	let highResImg = document.createElement("img");

	// Prevent clicking on hidden thumbnails
	if(!fullGalleryOpen) {
		fullGalleryOpen = true;
		origImgObj.el = el;

		createAndAttachImage(el, img, highResImg);
		scaleAndTranslateImageToFull(el, img, highResImg);
	}
}

// Attaches the gallery image to the thumbnail location
function createAndAttachImage(el, img, highResImg) {
	let elRect = el.getBoundingClientRect();

	// The following manages transitioning between low and high quality images
	// All transformations must be applied to both images, since we don't know
	// how long it will take the image to load and they must stay together.
	img.src = './assets/luccaSmall.jpg';
	highResImg.src = './assets/luccaMed.jpg';

	fullGallery.appendChild(highResImg);
	fullGallery.appendChild(img);

	img.style.transform = `translate(${el.x}px, ${el.y}px`;
	img.style.width = el.width + 'px';
	img.style.height = el.height + 'px';

	highResImg.style.transform = `translate(${el.x}px, ${el.y}px`;
	highResImg.style.width = el.width + 'px';
	highResImg.style.height = el.height + 'px';

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
	let scale = calcScale(1770, 2825, el.width, el.height, 100);
	let translate = calcTranslate(scale, el.width, el.height);

	el.style.visibility = 'hidden';
	img.style.transition = 'all .5s ease';
	img.style.transform = `translate(${translate.x}px, ${translate.y}px) scale(${scale})`;
	highResImg.style.transition = 'all .5s ease';
	highResImg.style.transform = `translate(${translate.x}px, ${translate.y}px) scale(${scale})`;
}

function calcScale(imgWidth, imgHeight, currWidth, currHeight, padding) {
	let windowWidth = window.innerWidth;
	let windowHeight = window.innerHeight;

	let maxWinWidthScale = windowWidth / currWidth - padding / currWidth;
	let maxWinHeightScale = windowHeight / currHeight - padding / currHeight;
	let maxImgWidthScale = imgWidth / currWidth - padding / currWidth;
	let maxImgHeightScale = imgHeight / currHeight - padding / currHeight;

	console.log(windowWidth);
	console.log(windowHeight);
	console.log(maxWinWidthScale);
	console.log(maxWinHeightScale);
	console.log(maxImgWidthScale);
	console.log(maxImgHeightScale);

	return Math.min(maxWinWidthScale, maxWinHeightScale, maxImgWidthScale, maxImgHeightScale);
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


// Event Listeners:

let thumbs = document.getElementsByClassName('photoThumb');

for(let i = 0; i < thumbs.length; i++) {
	thumbs[i].addEventListener("click", initGallery);
}

document.addEventListener("keydown", function(event) {
	if(event.keyCode == 27) {
		closeGallery();
	}
});