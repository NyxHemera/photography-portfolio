class GalleryImage extends GalleryObj {
	constructor(index, thumb, gallery, portObj) {
		super(index, gallery, portObj);

		this.lowResEl = document.createElement('img');
		this.highResEl = document.createElement('img');
		this.thumb = thumb;

		this.setImageSrc();
		let thumbRect = this.getThumbRect();
		this.setImageDims(thumbRect.width, thumbRect.height);
		this.setImageTransform(thumbRect.x, thumbRect.y);
		this.scale = this.calcScale();
		this.translate = this.calcTranslate();
	}

	appendToGallery() {
		this.gallery.el.appendChild(this.highResEl);
		this.gallery.el.appendChild(this.lowResEl);

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
		let maxWinWidthScale = (window.innerWidth / this.thumb.width) - (this.galleryPadding / this.thumb.width);
		let maxWinHeightScale = (window.innerHeight / this.thumb.height) - (this.galleryPadding / this.thumb.height);

		return Math.min(maxWinWidthScale, maxWinHeightScale);
	}

	calcTranslate() {
		return {
			x: (window.innerWidth / 2) - (this.thumb.width / 2) ,
			y: (window.innerHeight / 2) - (this.thumb.height / 2)
		};
	}

	getThumbRect() {
		let rect = this.thumb.getBoundingClientRect();
		rect.x = rect.x ? rect.x : rect.left;
		rect.y = rect.y ? rect.y : rect.top;
		return rect;
	}

	translateAndScaleFromThumbToFull() {
		this.setThumb(false);
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
		this.lowResEl.src = paths.thumb + this.self.content;
		this.highResEl.src = paths.med + this.self.content;
	}

	setImageTransform(x, y, scale) {
		let trans = '';

		trans += x !== undefined && y !== undefined ? `translate(${x}px, ${y}px) ` : '';
		trans += scale ? `scale(${scale}) ` : '';

		this.lowResEl.style.transform = trans;
		this.highResEl.style.transform = trans;
	}

	setThumb(visible) {
		this.thumb.style.visibility = visible ? 'visible' : 'hidden';
	}

	setTransition(on) {
		this.lowResEl.style.transition = on ? 'all .5s ease' : '';
		this.highResEl.style.transition = on ? 'all .5s ease' : '';
	}

}