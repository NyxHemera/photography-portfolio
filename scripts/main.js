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

function initGallery(event) {
	let el = event.srcElement;
	let gallery = undefined;
	// Prevent clicking on hidden thumbnails
	if(!fullGalleryOpen) {
		fullGalleryOpen = true;

		gallery = new Gallery(el, photoList);
		gallery.show();
		gallery.zoomToFull();
		gallery.createAndAttachSideImages();
	}
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

for(let i = 0; i < thumbs.length; i++) {
	thumbs[i].addEventListener('click', initGallery);
}

document.addEventListener('keydown', function(event) {
	if(event.keyCode == 27) {
		closeGallery();
	}
});