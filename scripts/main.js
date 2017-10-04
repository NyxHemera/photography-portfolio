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

// Event Listeners:

for(let i = 0; i < thumbs.length; i++) {
	thumbs[i].addEventListener('click', initGallery);
}