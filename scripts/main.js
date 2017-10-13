let fullGalleryOpen = false;

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

let portfolio = [
	{
		content: 'Cooper',
		type: 'text'
	},
	{
		content: 'cooper_scarf.jpg',
		type: 'image'
	},
	{
		content: 'cooper_scruff.jpg',
		type: 'image'
	},
	{
		content: 'Lucca',
		type: 'text'
	},
	{
		content: 'lucca.jpg',
		type: 'image'
	}
];

function initGallery(event) {
	let el = event.srcElement;
	let gallery = undefined;
	// Prevent clicking on hidden thumbnails
	if(!fullGalleryOpen) {
		fullGalleryOpen = true;

		gallery = new Gallery(el, portfolio);
		gallery.show();
		gallery.zoomToFull();
		gallery.createAndAttachSideImages();
	}
}

// Event Listeners:

for(let i = 0; i < thumbs.length; i++) {
	thumbs[i].addEventListener('click', initGallery);
}