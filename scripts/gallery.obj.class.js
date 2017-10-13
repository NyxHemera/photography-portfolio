class GalleryObj {
	constructor(index, gallery, portObj) {
		this.galleryPadding = 100;
		this.index = index;
		// Position is relative to what is being viewed. Can be negative.
		this.setPosition(gallery.index);
		this.gallery = gallery;
		this.self = portObj;
	}

	delete() {

	}

	setPosition(index) {
		this.position = this.index - index;
	}

}