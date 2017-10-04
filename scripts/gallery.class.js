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

	destroyGallery() {
		for(let i = 0; i < this.elList.length; i++) {
			let img = this.elList[i];
			if(i == this.index) { // on the center image
				// Fix to keep image from teleporting back to start
				window.requestAnimationFrame(() => {
					let rect = img.highResEl.getBoundingClientRect();
					let thumbRect = img.getThumbRect();
					let intermediateWidth = rect.right - rect.left;
					let intermediateHeight = rect.bottom - rect.top;
					let intermediateScale = intermediateWidth / thumbRect.width;
					// Find the difference between current and orig dimensions
					let intermediateX = rect.left + (intermediateWidth - thumbRect.width) / 2;
					let intermediateY = rect.top + (intermediateHeight - thumbRect.height) / 2;

					// Stop the animation in its tracks
					img.setTransition(false);
					img.setImageTransform(intermediateX, intermediateY, intermediateScale);

					// Move back to origin after allowing animation to end
					this.el.style.background = '';
					setTimeout(() => {
						img.setTransition(true);
						img.setImageTransform(thumbRect.x, thumbRect.y, 1);

						img.highResEl.addEventListener('transitionend', () => {
							img.setThumb(true);
							this.el.style.display = 'none';

							// Remove all gallery images
							// while (fullGallery.hasChildNodes()) {
							// 	fullGallery.removeChild(fullGallery.lastChild);
							// }

							// fullGalleryOpen = false;

						});
					}, 20);
				});
			} else {
				img.setThumb(true);
				// delete other images
				this.el.removeChild(img.lowResEl);
				this.el.removeChild(img.highResEl);
			}
		}
	}

	findSelectedIndex(el) {
		return this.photoList.findIndex(name => {
			return el.src && el.src.includes(name);
		});
	}

	initListeners() {
		document.addEventListener('keydown', (event) => {
			switch(event.keyCode) {
				case 27:
					this.destroyGallery();
					break;
				case 37:
					this.back();
					break;
				case 39:
					this.next();
					break;
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
			img.setThumb(false);
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