(function () {
	// Comprehensive WebSocket blocking for all contexts

	// Block WebSocket in main window
	if (window) {
		// Override WebSocket constructor
		window.WebSocket = function () {
			throw new Error('WebSocket is disabled by extension');
		};

		// Remove WebSocket from window
		delete window.WebSocket;

		// Block WebSocket in global scope
		if (typeof globalThis !== 'undefined') {
			globalThis.WebSocket = undefined;
		}

		console.log('WebSocket support disabled in main window');
	}

	// Block WebSocket in Service Workers
	if (typeof self !== 'undefined' && self.ServiceWorkerGlobalScope) {
		self.WebSocket = function () {
			throw new Error('WebSocket is disabled by extension');
		};
		console.log('WebSocket support disabled in service worker');
	}

	// Block WebSocket in Web Workers
	if (typeof importScripts !== 'undefined') {
		self.WebSocket = function () {
			throw new Error('WebSocket is disabled by extension');
		};
		console.log('WebSocket support disabled in web worker');
	}

	// Override WebSocket in all frames
	function blockWebSocketInFrame(frame) {
		try {
			if (frame && frame.WebSocket) {
				frame.WebSocket = function () {
					throw new Error('WebSocket is disabled by extension');
				};
			}
		} catch (e) {
			// Cross-origin frames may throw errors, ignore them
		}
	}

	// Block WebSocket in all existing frames
	for (let i = 0; i < window.frames.length; i++) {
		blockWebSocketInFrame(window.frames[i]);
	}

	// Monitor for new frames
	const observer = new MutationObserver(function (mutations) {
		mutations.forEach(function (mutation) {
			mutation.addedNodes.forEach(function (node) {
				if (node.tagName === 'IFRAME' || node.tagName === 'FRAME') {
					setTimeout(() => blockWebSocketInFrame(node.contentWindow), 100);
				}
			});
		});
	});

	observer.observe(document.body || document.documentElement, {
		childList: true,
		subtree: true
	});

})();
