class GalleryText extends GalleryObj {
	constructor(index, gallery, portObj) {
		super(index, gallery, portObj);

		this.el = document.createElement('div');
		this.el.innerContent = portObj.content;
	}

	appendToGallery() {
		this.gallery.el.appendChild(this.el);
	}

	setImageTransform(x, y, scale) {
		let trans = '';

		trans += x !== undefined && y !== undefined ? `translate(${x}px, ${y}px) ` : '';
		trans += scale ? `scale(${scale}) ` : '';

		this.el.style.transform = trans;
	}

	setTransition(on) {
		this.el.style.transition = on ? 'all .5s ease' : '';
	}

}