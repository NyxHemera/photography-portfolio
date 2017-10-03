class GalleryImage {
	constructor(index, thumb) {
		this.lowResEl = document.createElement('img');
		this.highResEl = document.createElement('img');
		this.index = index;
		this.thumb = thumb;

		this.setImageSrc();
		this.setImageDims(this.thumb.width, this.thumb.height);
		this.setImageTransform(this.thumb.x, this.thumb.y);
	}

	appendToElement(fullGallery) {
		fullGallery.appendChild(this.lowResEl);
		fullGallery.appendChild(this.highResEl);

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
		let scale = this.calcScale();
		let translate = this.calcTranslate();

		this.toggleThumb();
		this.toggleTransition();
		this.setImageTransform(translate.x, translate.y, scale);
	}

	setImageDims(width, height) {
		this.lowResEl.style.width = width + 'px';
		this.lowResEl.style.height = height + 'px';
		this.highResEl.style.width = width + 'px';
		this.highResEl.style.height = height + 'px';
	}

	setImageSrc() {
		this.lowResEl.src = paths.thumb + photoList[this.index];
		this.highResEl.src = paths.med + photoList[this.index];
	}

	setImageTransform(x, y, scale) {
		let trans = '';

		trans += x !== undefined && y !== undefined ? `translate(${x}px, ${y}px) ` : '';
		trans += scale ? `scale(${scale}) ` : '';

		this.lowResEl.style.transform = trans;
		this.highResEl.style.transform = trans;
	}

	toggleThumb() {
		this.thumb.style.visibility = this.thumb.style.visibility == 'hidden' ? 'visible' : 'hidden';
	}

	toggleTransition() {
		this.lowResEl.style.transition = this.lowResEl.style.transition == '' ? 'all .5s ease' : '';
		this.highResEl.style.transition = this.highResEl.style.transition == '' ? 'all .5s ease' : '';
	}
}