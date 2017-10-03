const galleryPadding = 100;

class GalleryImage {
	constructor(index, thumb, gallery) {
		this.lowResEl = document.createElement('img');
		this.highResEl = document.createElement('img');
		this.index = index;
		this.setPosition(gallery.index);
		this.thumb = thumb;
		this.gallery = gallery;

		this.setImageSrc();
		let thumbRect = thumb.getBoundingClientRect();
		this.setImageDims(thumbRect.width, thumbRect.height);
		this.setImageTransform(thumbRect.x, thumbRect.y);
		this.scale = this.calcScale();
		this.translate = this.calcTranslate();
	}

	appendToGallery() {
		this.gallery.el.appendChild(this.lowResEl);
		this.gallery.el.appendChild(this.highResEl);

		this.highResEl.onload = () => {
			this.lowResEl.style.opacity = 0;

			// Delete low quality image
			this.lowResEl.addEventListener('transitionend', function() {
				if(this.lowResEl && this.lowResEl.parentNode) {
					this.lowResEl.parentNode.removeChild(this.lowResEl);
				}
			});
	  };
	}

	calcScale() {
		let maxWinWidthScale = (window.innerWidth / this.thumb.width) - (galleryPadding / this.thumb.width);
		let maxWinHeightScale = (window.innerHeight / this.thumb.height) - (galleryPadding / this.thumb.height);

		return Math.min(maxWinWidthScale, maxWinHeightScale);
	}

	calcTranslate() {
		return {
			x: (window.innerWidth / 2) - (this.thumb.width / 2) ,
			y: (window.innerHeight / 2) - (this.thumb.height / 2)
		};
	}

	delete() {

	}

	translateAndScaleFromThumbToFull() {
		this.toggleThumb();
		this.setTransition(true);
		// If this isn't a timeout, it transitions too quickly, causing the image to jump
		setTimeout(() => {
			this.setImageTransform(this.translate.x, this.translate.y, this.scale);
		}, 0)
	}

	setImageDims(width, height) {
		this.lowResEl.style.width = width + 'px';
		this.lowResEl.style.height = height + 'px';
		this.highResEl.style.width = width + 'px';
		this.highResEl.style.height = height + 'px';
	}

	setImageSrc() {
		this.lowResEl.src = paths.thumb + this.gallery.photoList[this.index];
		this.highResEl.src = paths.med + this.gallery.photoList[this.index];
	}

	setImageTransform(x, y, scale) {
		let trans = '';

		trans += x !== undefined && y !== undefined ? `translate(${x}px, ${y}px) ` : '';
		trans += scale ? `scale(${scale}) ` : '';

		this.lowResEl.style.transform = trans;
		this.highResEl.style.transform = trans;
	}

	setPosition(index) {
		this.position = this.index - index;
	}

	setTransition(on) {
		this.lowResEl.style.transition = on ? 'all .5s ease' : '';
		this.highResEl.style.transition = on ? 'all .5s ease' : '';
	}

	toggleThumb() {
		this.thumb.style.visibility = this.thumb.style.visibility == 'hidden' ? 'visible' : 'hidden';
	}
}