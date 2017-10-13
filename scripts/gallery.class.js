class Gallery {
	constructor(thumb, portfolio) {
		this.portfolio = portfolio;
		this.index = this.findSelectedIndex(thumb);
		this.el = document.createElement('div');
		this.elList = [];

		this.el.id = 'fullGallery';
		document.body.appendChild(this.el);

		this.boundKeydownListener = event => this.keydownListener(event);
		this.initListeners();
	}

	back() {
		this.index = this.index == 0 ? this.portfolio.length - 1 : this.index - 1;
		this.recalculateImagePositions();
	}

	createAndAttachSideImages() {
		for(let i = 0; i < portfolio.length; i++) {
			if(i == this.index) {
				continue;
			}else {
				let el = null;

				if(portfolio[i].type == 'image') {
					el = new GalleryImage(i, thumbs[i], this, portfolio[i]);

					let targetX = window.innerWidth * 2 * el.position; // needs work
					el.setImageTransform(targetX, el.translate.y, el.scale);
				}else {
					el = new GalleryText(i, this, portfolio[i]);
				}


				el.appendToGallery();

				i < this.index ? this.elList.splice(i, 0, el) : this.elList.push(el);
			}
		}
	}

	destroyGallery() {
		for(let i = 0; i < this.elList.length; i++) {
			let img = this.elList[i];
			if(i == this.index) { // on the center image
				// Fix to keep image from teleporting back to start
				window.requestAnimationFrame(() => {
					let imgRect = img.highResEl.getBoundingClientRect();
					let thumbRect = img.getThumbRect();
					let intermediateScale = imgRect.width / thumbRect.width;
					// Find the difference between current and thumb dimensions
					let intermediateX = imgRect.left + (imgRect.width - thumbRect.width) / 2;
					let intermediateY = imgRect.top + (imgRect.height - thumbRect.height) / 2;

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
							this.el.parentNode.removeChild(this.el);
							fullGalleryOpen = false;
						});
					}, 20);
				});
			} else {
				img.setThumb(true);
			}
		}

		this.destroyListeners();
	}

	destroyListeners() {
		document.removeEventListener('keydown', this.boundKeydownListener);
	}

	findSelectedIndex(el) {
		return this.portfolio.findIndex(obj => {
			return obj.type == 'image' && el.src && el.src.includes(obj.content);
		});
	}

	initListeners() {
		document.addEventListener('keydown', this.boundKeydownListener);
	}

	keydownListener(event) {
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
	}

	next() {
		this.index = this.index == this.portfolio.length - 1 ? 0 : this.index + 1;
		this.recalculateImagePositions();
	}

	recalculateImagePositions() {
		for(let i = 0; i < portfolio.length; i++) {
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
		let img = new GalleryImage(this.index, thumbs[this.index], this, this.portfolio[this.index]);
		this.elList.push(img);
		img.appendToGallery();
		img.translateAndScaleFromThumbToFull();
	}

}