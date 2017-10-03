class Gallery {
	constructor(thumb, photoList) {
		this.photoList = photoList;
		this.index = this.findSelectedIndex(thumb);
		this.el = document.createElement('div');
		this.elList = [];

		this.el.id = 'fullGallery';
		document.body.appendChild(this.el);

		this.initListeners();
	}

	back() {
		this.index = this.index == 0 ? this.photoList.length - 1 : this.index - 1;
		this.recalculateImagePositions();
	}

	createAndAttachSideImages() {
		for(let i = 0; i < photoList.length; i++) {
			if(i == this.index) {
				continue;
			}else {
				let img = new GalleryImage(i, thumbs[i], this);
				let targetX = window.innerWidth * 2 * img.position; // needs work

				img.setImageTransform(targetX, img.translate.y, img.scale);
				img.appendToGallery();

				i < this.index ? this.elList.unshift(img) : this.elList.push(img);
			}
		}
	}

	findSelectedIndex(el) {
		return this.photoList.findIndex(name => {
			return el.src && el.src.includes(name);
		});
	}

	hide() {

	}

	initListeners() {
		document.addEventListener('keydown', (event) => {
			if(event.keyCode == 37) {
				this.back();
			}else if(event.keyCode == 39) {
				this.next();
			}
		});
	}

	next() {
		this.index = this.index == this.photoList.length - 1 ? 0 : this.index + 1;
		this.recalculateImagePositions();
	}

	recalculateImagePositions() {
		for(let i = 0; i < photoList.length; i++) {
			let img = this.elList[i];
			img.setTransition(true);
			img.setPosition(this.index);
			let targetX = window.innerWidth * 2 * img.position;

			if(img.position == 0) {
				img.setImageTransform(img.translate.x, img.translate.y, img.scale);
			}else {
				img.setImageTransform(targetX, img.translate.y, img.scale);
			}
		}
	}

	show() {
		this.el.style.display = 'inline';
		setTimeout(() => {
			this.el.style.background = 'black';
		}, 10);
	}

	zoomToFull() {
		let img = new GalleryImage(this.index, thumbs[this.index], this);
		this.elList.push(img);
		img.appendToGallery();
		img.translateAndScaleFromThumbToFull();
	}

}