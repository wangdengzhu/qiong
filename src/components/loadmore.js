const throttle = (method, duration, delay) => {
	var timerID = null,
		begin = +new Date,
		isFirstCall = !0;

	return function() {
		var args = arguments,
			ctx = this,
			now = +new Date;
		if (isFirstCall) {
			method.apply(ctx, args);
			begin = now;
			isFirstCall = !1;
			return;
		}
		if (timerID) {
			clearTimeout(timerID);
		}
		if (now - begin > duration) {
			method.apply(ctx, args);
			begin = now;
		} else {
			timerID = setTimeout(function() {
				method.apply(ctx, args);
			}, delay);
		}
	};
};

export default {
	inserted: (el, binding, vnode) => {
		let bindTryCount = 0;
		let scrollElem = null;
		let context = vnode.context;
		let isEnableScrollExpr = el.getAttribute('is-enable-scroll');
		let isLoading = !1;
		
		context.$watch(isEnableScrollExpr, (value) => {
			isLoading = value;
		});

		const scrollHandler = () => {
			if (getScrollTop(scrollElem) + getClientHeight(window) >= (getScrollHeight(scrollElem))) {
				(!isLoading) && binding.value();
			}
		};

		const getScrollTop = (elem) => {
			let scrollTop = elem.scrollTop || 0;
			if (elem === window) {
				scrollTop = Math.max(window.pageYOffset || 0, document.documentElement.scrollTop);
			}
			return scrollTop;
		};

		const getClientHeight = (elem) => {
			let clientHeight = elem.clientHeight;
			if (elem === window) {
				clientHeight = window.innerHeight;
			}
			return clientHeight;
		};

		const getScrollHeight = (elem) => {
			let scrollHeight = elem.scrollHeight;
			if (elem === window) {
				scrollHeight = document.documentElement.scrollHeight;
			}
			return scrollHeight-300;
		};

		const getScrollElem = (elem) => {
			let retElem = null;
			if (elem.tagName === 'BODY' || elem.tagName === 'HTML') {
				retElem = window;
			} else if (['scroll', 'auto'].indexOf(getComputedStyle(elem).overflowY) > -1) {
				retElem = elem;
			}
			return retElem || getScrollElem(elem.parentNode);
		};

		/*const isAttached = function(element) {
			var currentNode = element.parentNode;
			while (currentNode) {
				if (currentNode.tagName === 'HTML') {
					return true;
				}
				if (currentNode.nodeType === 11) {
					return false;
				}
				currentNode = currentNode.parentNode;
			}
			return false;
		};

		const tryBind = function() {
			if (bindTryCount > 10) return; //eslint-disable-line
			bindTryCount++;
			if (isAttached(el)) {
				scrollElem = getScrollElem(el);
				scrollElem.addEventListener('scroll', throttle(scrollHandler, 100, 200), !1);
			} else {
				setTimeout(tryBind, 50);
			}
		};

		tryBind();*/
		
		scrollElem = getScrollElem(el);
		scrollElem.addEventListener('scroll', throttle(scrollHandler, 100, 200), !1);

	}
};