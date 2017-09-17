/*
 * Reveal.js menu plugin
 * MIT licensed
 * (c) Greg Denehy 2015
 */

var RevealMenu = window.RevealMenu || (function(){
	var config = Reveal.getConfig();
	var options = config.menu || {};
	options.path = options.path || scriptPath() || 'plugin/menu';
	var initialised = false;
	
	var module = {};

	loadResource(options.path + '/menu.css', 'stylesheet', function() {
	loadResource(options.path + '/font-awesome-4.3.0/css/font-awesome.min.css', 'stylesheet', function() {
		// does not support IE8 or below
		if (!head.browser.ie || head.browser.version >= 9) {
			//
			// Set option defaults
			//
			var side = options.side || 'left';	// 'left' or 'right'
			var numbers = options.numbers || false;
			var titleSelector = 'h1, h2, h3, h4, h5';
			if (typeof options.titleSelector === 'string') titleSelector = options.titleSelector;
			var hideMissingTitles = options.hideMissingTitles || false;
			var useTextContentForMissingTitles = options.useTextContentForMissingTitles || false;
			var markers = options.markers || false;
			var custom = options.custom;
			var themes = options.themes;
			if (typeof themes === "undefined") {
				themes = [
					{ name: 'Black', theme: 'css/theme/black.css' },
					{ name: 'White', theme: 'css/theme/white.css' },
					{ name: 'League', theme: 'css/theme/league.css' },
					{ name: 'Sky', theme: 'css/theme/sky.css' },
					{ name: 'Beige', theme: 'css/theme/beige.css' },
					{ name: 'Simple', theme: 'css/theme/simple.css' },
					{ name: 'Serif', theme: 'css/theme/serif.css' },
					{ name: 'Blood', theme: 'css/theme/blood.css' },
					{ name: 'Night', theme: 'css/theme/night.css' },
					{ name: 'Moon', theme: 'css/theme/moon.css' },
					{ name: 'Solarized', theme: 'css/theme/solarized.css' }
				];
			}
			var transitions = options.transitions;
			if (typeof transitions === "undefined") transitions = true;
			if (head.browser.ie && head.browser.version <= 9) {
				// transitions aren't support in IE9 anyway, so no point in showing them
				transitions = false;
			}
			var openButton = options.openButton;
			if (typeof openButton === "undefined") openButton = true;
			var openSlideNumber = options.openSlideNumber;
			if (typeof openSlideNumber === "undefined") openSlideNumber = false;
			var keyboard = options.keyboard;
			if (typeof keyboard === "undefined") keyboard = true;
			var sticky = options.sticky;
			if (typeof sticky === "undefined") sticky = false;
			var autoOpen = options.autoOpen;
			if (typeof autoOpen === "undefined") autoOpen = true;
			var delayInit = options.delayInit;
			if (typeof delayInit === "undefined") delayInit = false;
			

			function disableMouseSelection() {
				mouseSelectionEnabled = false;
			}

			function reenableMouseSelection() {
				// wait until the mouse has moved before re-enabling mouse selection
				// to avoid selections on scroll
				select('nav.slide-menu').addEventListener('mousemove', function fn(e) {
					select('nav.slide-menu').removeEventListener('mousemove', fn);
					//XXX this should select the item under the mouse
					mouseSelectionEnabled = true;
				});
			}

			//
			// Keyboard handling
			//
			function getOffset(el) {
				var _x = 0;
				var _y = 0;
				while(el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
					_x += el.offsetLeft - el.scrollLeft;
					_y += el.offsetTop - el.scrollTop;
					el = el.offsetParent;
				}
				return { top: _y, left: _x };
			}

			function visibleOffset(el) {
				var offsetFromTop = getOffset(el).top - el.offsetParent.offsetTop;
				if (offsetFromTop < 0) return -offsetFromTop
				var offsetFromBottom = el.offsetParent.offsetHeight - (el.offsetTop - el.offsetParent.scrollTop + el.offsetHeight);
				if (offsetFromBottom < 0) return offsetFromBottom; 
				return 0;
			}

			function keepVisible(el) {
				var offset = visibleOffset(el);
				if (offset) {
					disableMouseSelection();
					el.scrollIntoView(offset > 0);
					reenableMouseSelection();	
				}
			}

			function scrollItemToTop(el) {
				disableMouseSelection();
				el.offsetParent.scrollTop = el.offsetTop;
				reenableMouseSelection();	
			}

			function scrollItemToBottom(el) {
				disableMouseSelection();
				el.offsetParent.scrollTop = el.offsetTop - el.offsetParent.offsetHeight + el.offsetHeight
				reenableMouseSelection();	
			}

			function selectItem(el) {
				el.classList.add('selected');
				keepVisible(el);
				if (sticky && autoOpen) openItem(el);
			}

			function onDocumentKeyDown(event) {
				if (event.keyCode === 77) {
					toggleMenu();
				} else if (isOpen()) {
					event.stopImmediatePropagation();
					switch( event.keyCode ) {
						// h, left - change panel
						case 72: case 37:
							prevPanel();
							break;
						// l, right - change panel
						case 76: case 39:
							nextPanel();
							break;
						// k, up
						case 75: case 38:
							var currItem = select('.active-menu-panel .slide-menu-items li.selected') || select('.active-menu-panel .slide-menu-items li.active');
							if (currItem) {
								selectAll('.active-menu-panel .slide-menu-items li').forEach(function(item) { item.classList.remove('selected') });
								var nextItem = select('.active-menu-panel .slide-menu-items li[data-item="' + (parseInt(currItem.getAttribute('data-item')) - 1) + '"]') || currItem;
								selectItem(nextItem);
							} else {
								var item = select('.active-menu-panel .slide-menu-items li.slide-menu-item');
								if (item) selectItem(item);
							}
							break;
						// j, down
						case 74: case 40:
							var currItem = select('.active-menu-panel .slide-menu-items li.selected') || select('.active-menu-panel .slide-menu-items li.active');
							if (currItem) {
								selectAll('.active-menu-panel .slide-menu-items li').forEach(function(item) { item.classList.remove('selected') });
								var nextItem = select('.active-menu-panel .slide-menu-items li[data-item="' + (parseInt(currItem.getAttribute('data-item')) + 1) + '"]') || currItem;
								selectItem(nextItem);
							} else {
								var item = select('.active-menu-panel .slide-menu-items li.slide-menu-item');
								if (item) selectItem(item);
							}
							break;
						// pageup, u
						case 33: case 85:
							var itemsAbove = selectAll('.active-menu-panel .slide-menu-items li').filter(function(item) { return visibleOffset(item) > 0; });
							var visibleItems = selectAll('.active-menu-panel .slide-menu-items li').filter(function(item) { return visibleOffset(item) == 0; });

							var firstVisible = (itemsAbove.length > 0 && Math.abs(visibleOffset(itemsAbove[itemsAbove.length-1])) < itemsAbove[itemsAbove.length-1].clientHeight ? itemsAbove[itemsAbove.length-1] : visibleItems[0]);
							if (firstVisible) {
								if (firstVisible.classList.contains('selected') && itemsAbove.length > 0) {
									// at top of viewport already, page scroll (if not at start)
									// ...move selected item to bottom, and change selection to last fully visible item at top
									scrollItemToBottom(firstVisible);
									visibleItems = selectAll('.active-menu-panel .slide-menu-items li').filter(function(item) { return visibleOffset(item) == 0; });
									if (visibleItems[0] == firstVisible) {
										// prev item is still beyond the viewport (for custom panels)
										firstVisible = itemsAbove[itemsAbove.length-1];
									} else {
										firstVisible = visibleItems[0];
									}
								}
								selectAll('.active-menu-panel .slide-menu-items li').forEach(function(item) { item.classList.remove('selected') });
								selectItem(firstVisible);
								// ensure selected item is positioned at the top of the viewport
								scrollItemToTop(firstVisible);
							}
							break;
						// pagedown, d
						case 34: case 68:
							var visibleItems = selectAll('.active-menu-panel .slide-menu-items li').filter(function(item) { return visibleOffset(item) == 0; });
							var itemsBelow = selectAll('.active-menu-panel .slide-menu-items li').filter(function(item) { return visibleOffset(item) < 0; });
							
							var lastVisible = (itemsBelow.length > 0 && Math.abs(visibleOffset(itemsBelow[0])) < itemsBelow[0].clientHeight ? itemsBelow[0] : visibleItems[visibleItems.length-1]);
							if (lastVisible) {
								if (lastVisible.classList.contains('selected') && itemsBelow.length > 0) {
									// at bottom of viewport already, page scroll (if not at end)
									// ...move selected item to top, and change selection to last fully visible item at bottom
									scrollItemToTop(lastVisible);
									visibleItems = selectAll('.active-menu-panel .slide-menu-items li').filter(function(item) { return visibleOffset(item) == 0; });
									if (visibleItems[visibleItems.length-1] == lastVisible) {
										// next item is still beyond the viewport (for custom panels)
										lastVisible = itemsBelow[0];
									} else {
										lastVisible = visibleItems[visibleItems.length-1];
									}
								}
								selectAll('.active-menu-panel .slide-menu-items li').forEach(function(item) { item.classList.remove('selected') });
								selectItem(lastVisible);
								// ensure selected item is positioned at the bottom of the viewport
								scrollItemToBottom(lastVisible);
							}
							break;
						// home
						case 36:
							selectAll('.active-menu-panel .slide-menu-items li').forEach(function(item) { item.classList.remove('selected') });
							var item = select('.active-menu-panel .slide-menu-items li:first-of-type');
							if (item) {
								item.classList.add('selected');
								keepVisible(item);
							}
							break;
						// end
						case 35:
							selectAll('.active-menu-panel .slide-menu-items li').forEach(function(item) { item.classList.remove('selected') });
							var item = select('.active-menu-panel .slide-menu-items:last-of-type li:last-of-type');
							if (item) {
								item.classList.add('selected');
								keepVisible(item);
							}
							break;
						// space, return
						case 32: case 13:
							var currItem = select('.active-menu-panel .slide-menu-items li.selected');
							if (currItem) {
								openItem(currItem, true);
							}
							break;
						// esc
						case 27: closeMenu(null, true); break;
					}
				}
			}

			if (keyboard) {
				//XXX add keyboard option for custom key codes, etc.

				document.addEventListener('keydown', onDocumentKeyDown, false);

				// handle key presses within speaker notes
				window.addEventListener( 'message', function( event ) {
					var data;
					try {
						data = JSON.parse( event.data );
					} catch (e) {
					}
					if (data && data.method === 'triggerKey') {
						onDocumentKeyDown( { keyCode: data.args[0], stopImmediatePropagation: function() {} } );
					}
				});

				// Prevent reveal from processing keyboard events when the menu is open
				if (config.keyboardCondition && typeof config.keyboardCondition === 'function') {
					// combine user defined keyboard condition with the menu's own condition
					var userCondition = config.keyboardCondition;
					config.keyboardCondition = function() {
						return userCondition() && !isOpen();
					};
				} else {
					config.keyboardCondition = function() { return !isOpen(); }
				}
			}


			//
			// Utilty functions
			//

			function openMenu(event) {
				if (event) event.preventDefault();
				if (!isOpen()) {
					select('body').classList.add('slide-menu-active');
				    select('.reveal').classList.add('has-' + options.effect + '-' + side);
				    select('.slide-menu').classList.add('active');
				    select('.slide-menu-overlay').classList.add('active');
					
				    // identify active theme
				    selectAll('div[data-panel="Themes"] li').forEach(function(i) { i.classList.remove('active') });
				    select('li[data-theme="' + select('#theme').getAttribute('href') + '"]').classList.add('active');

				    // identify active transition
				    selectAll('div[data-panel="Transitions"] li').forEach(function(i) { i.classList.remove('active') });
				    select('li[data-transition="' + Reveal.getConfig().transition + '"]').classList.add('active');

				    // set item selections to match active items
					var items = selectAll('.slide-menu-panel li.active')
					items.forEach(function(i) {
						i.classList.add('selected');
						keepVisible(i);
					});
				}
			}

			function closeMenu(event, force) {
				if (event) event.preventDefault();
				if (!sticky || force) {
					select('body').classList.remove('slide-menu-active');
					select('.reveal').classList.remove('has-' + options.effect + '-' + side);
					select('.slide-menu').classList.remove('active');
					select('.slide-menu-overlay').classList.remove('active');
					selectAll('.slide-menu-panel li.selected').forEach(function(i) { i.classList.remove('selected') });
				}
			}

			function toggleMenu(event) {
				if (isOpen()) {
					closeMenu(event, true);
				} else {
					openMenu(event);
				}
			}

			function isOpen() {
				return select('body').classList.contains('slide-menu-active');
			}

			function openPanel(e) {
				openMenu();
				var panel = e;
				if (typeof e !== "string") {
					panel = e.currentTarget.getAttribute('data-panel');
				}
				select('.slide-menu-toolbar > li.active-toolbar-button').classList.remove('active-toolbar-button');
				select('li[data-panel="' + panel + '"]').classList.add('active-toolbar-button');
				select('.slide-menu-panel.active-menu-panel').classList.remove('active-menu-panel');
				select('div[data-panel="' + panel + '"]').classList.add('active-menu-panel');
			}

			function nextPanel() {
				var next = (parseInt(select('.active-toolbar-button').getAttribute('data-button')) + 1) % buttons;
				openPanel(select('.toolbar-panel-button[data-button="' + next + '"]').getAttribute('data-panel'));
			}

			function prevPanel() {
				var next = parseInt(select('.active-toolbar-button').getAttribute('data-button')) - 1;
				if (next < 0) {
					next = buttons - 1;
				}
				openPanel(select('.toolbar-panel-button[data-button="' + next + '"]').getAttribute('data-panel'));
			}

			function openItem(item, force) {
				var h = parseInt(item.getAttribute('data-slide-h'));
				var v = parseInt(item.getAttribute('data-slide-v'));
				var theme = item.getAttribute('data-theme');
				var transition = item.getAttribute('data-transition');
				if (!isNaN(h) && !isNaN(v)) {
					Reveal.slide(h, v);
					closeMenu();
				} else if (theme) {
					select('#theme').setAttribute('href', theme);
					closeMenu();
				} else if (transition) {
					Reveal.configure({ transition: transition });
					closeMenu();
				} else {
					var link = select('a', item);
					if (link) {
						if (force || !sticky || (autoOpen && link.href.startsWith('#') || link.href.startsWith(window.location.origin + window.location.pathname + '#'))) {
							link.click();
						}
					}
					closeMenu();
				}
			}

			function clicked(event) {
				if (event.target.nodeName !== "A") {
					event.preventDefault();
				}
				openItem(event.currentTarget);
			}

			function highlightCurrentSlide() {
				var state = Reveal.getState();
				selectAll('li.slide-menu-item, li.slide-menu-item-vertical').forEach(function(item) {
					item.classList.remove('past');
					item.classList.remove('active');
					item.classList.remove('future');

					var h = parseInt(item.getAttribute('data-slide-h'));
					var v = parseInt(item.getAttribute('data-slide-v'));
					if (h < state.indexh || (h === state.indexh && v < state.indexv)) {
						item.classList.add('past');
					}
					else if (h === state.indexh && v === state.indexv) {
						item.classList.add('active');
					}
					else {
						item.classList.add('future');
					}
				});
			}

			var buttons = 0;
			function init() {
				if (!initialised) {
					var top = select('.reveal');
					var panels = create('nav', { 'class': 'slide-menu slide-menu--' + side});
					top.appendChild(panels);
					var overlay = create('div', { 'class': 'slide-menu-overlay'});
					top.appendChild(overlay);
					overlay.onclick = closeMenu;						

					var toolbar = create('ol', {'class': 'slide-menu-toolbar'});
					select('.slide-menu').appendChild(toolbar);

					function addToolbarButton(title, ref, icon, fn, active) {
						var attrs = {
							'data-button': '' + (buttons++),
							'class': 'toolbar-panel-button' + (active ? ' active-toolbar-button' : '')
						};
						if (ref) {
							attrs['data-panel'] = ref;
						}	
						var button = create('li', attrs);

						if (icon.startsWith('fa-')) {
							button.appendChild(create('i', {'class': 'fa ' + icon}));
						} else {
							button.innerHTML = icon + '</i>';
						}					
						button.insertBefore(create('span', {'class': 'slide-menu-toolbar-label'}, title), select('i', button));
						button.insertBefore(create('br'), select('i', button));
						button.onclick = fn;
						toolbar.appendChild(button);
						return button;
					}

					addToolbarButton('Slides', 'Slides', 'fa-list', openPanel, true);

					if (custom) {
						custom.forEach(function(element, index, array) {
							addToolbarButton(element.title, 'Custom' + index, element.icon, openPanel);
						});
					}

					if (themes) {
						addToolbarButton('Themes', 'Themes', 'fa-desktop', openPanel);
					}
					if (transitions) {
						addToolbarButton('Transitions', 'Transitions', 'fa-arrows-h', openPanel);
					}
					button = create('li', {id: 'close'});
					button.appendChild(create('span', {'class': 'slide-menu-toolbar-label'}, 'Close'));
					button.appendChild(create('br'));
					button.appendChild(create('i', {'class': 'fa fa-times'}));
					button.onclick = closeMenu;
					toolbar.appendChild(button);

					//
					// Slide links
					//
					function generateItem(type, section, i, h, v) {
						var link = '/#/' + h;
						if (typeof v === 'number' && !isNaN( v )) link += '/' + v;

						function text(selector, parent) {
							var el = (parent ? select(selector, section) : select(selector));
							if (el) return el.textContent;
							return null;
						}
						var title = section.getAttribute('data-menu-title') ||
							text('.menu-title', section) ||
							text(titleSelector, section);

						if (!title && useTextContentForMissingTitles) {
							// attempt to figure out a title based on the text in the slide
							title = section.textContent.trim();
							if (title) {
								title = title.split('\n')
									.map(function(t) { return t.trim() }).join(' ').trim()
									.replace(/^(.{16}[^\s]*).*/, "$1") // limit to 16 chars plus any consecutive non-whitespace chars (to avoid breaking words)
									.replace(/&/g, "&amp;")
									.replace(/</g, "&lt;")
									.replace(/>/g, "&gt;")
									.replace(/"/g, "&quot;")
									.replace(/'/g, "&#039;") + '...';
							}
						}

						if (!title) {
							if (hideMissingTitles) return '';
							type += ' no-title';
							title = "Slide " + i;
						}

						var item = create('li', {
							class: type,
							'data-item': i,
							'data-slide-h': h,
							'data-slide-v': (v === undefined ? 0 : v)
						});

						if (markers) {
							item.appendChild(create('i', {class: 'fa fa-check-circle past'}));
							item.appendChild(create('i', {class: 'fa fa-dot-circle-o active'}));
							item.appendChild(create('i', {class: 'fa fa-circle-thin future'}));
						}

						if (numbers) {
							// Number formatting taken from reveal.js
							var value = [];
							var format = 'h.v';

							// Check if a custom number format is available
							if( typeof numbers === 'string' ) {
								format = numbers;
							}
							else if (typeof config.slideNumber === 'string') {
								// Take user defined number format for slides
								format = config.slideNumber;
							}

							switch( format ) {
								case 'c':
									value.push( i );
									break;
								case 'c/t':
									value.push( i, '/', Reveal.getTotalSlides() );
									break;
								case 'h/v':
									value.push( h + 1 );
									if( typeof v === 'number' && !isNaN( v ) ) value.push( '/', v + 1 );
									break;
								default:
									value.push( h + 1 );
									if( typeof v === 'number' && !isNaN( v ) ) value.push( '.', v + 1 );
							}

							item.appendChild(create('span', {class: 'slide-menu-item-number'}, value.join('') + '. '));
						}

						item.appendChild(create('span', {class: 'slide-menu-item-title'}, title));
						
						return item;
					}

					function createSlideMenu() {
						if ( !document.querySelector('section[data-markdown]:not([data-markdown-parsed])') ) {
							var panel = create('div', {
								'data-panel': 'Slides',
								'class': 'slide-menu-panel active-menu-panel'
							});
							panel.appendChild(create('ul', {class: "slide-menu-items"}));
							panels.appendChild(panel);
							var items = select('.slide-menu-panel[data-panel="Slides"] > .slide-menu-items');
							var slideCount = 0;
							selectAll('.slides > section').forEach(function(section, h) {
								var subsections = selectAll('section', section);
								if (subsections.length > 0) {
									subsections.forEach(function(subsection, v) {
										var type = (v === 0 ? 'slide-menu-item' : 'slide-menu-item-vertical');
										var item = generateItem(type, subsection, slideCount, h, v);
										if (item) {
											slideCount++;
											items.appendChild(item);
										}
									});
								} else {
									var item = generateItem('slide-menu-item', section, slideCount, h);
									if (item) {
										slideCount++;
										items.appendChild(item);
									}
								}
							});
							selectAll('.slide-menu-item, .slide-menu-item-vertical').forEach(function(i) {
								i.onclick = clicked;
							});
							highlightCurrentSlide();
						}
						else {
						// wait for markdown to be loaded and parsed
							setTimeout( createSlideMenu, 100 );
						}
					}

					createSlideMenu();
					Reveal.addEventListener('slidechanged', highlightCurrentSlide);

					//
					// Custom menu panels
					//
					if (custom) {
						function xhrSuccess () {
							if (this.status >= 200 && this.status < 300) {
								this.panel.innerHTML = this.responseText;
								enableCustomLinks(this.panel);
							}
							else {
								showErrorMsg(this)
							}
						}
						function xhrError () {
							showErrorMsg(this)
						}
						function loadCustomPanelContent (panel, sURL) {
							var oReq = new XMLHttpRequest();
							oReq.panel = panel;
							oReq.arguments = Array.prototype.slice.call(arguments, 2);
							oReq.onload = xhrSuccess;
							oReq.onerror = xhrError;
							oReq.open("get", sURL, true);
							oReq.send(null);
						}
						function enableCustomLinks(panel) {
							selectAll('ul.slide-menu-items li.slide-menu-item', panel).forEach(function(item, i) {
								item.setAttribute('data-item', i+1);
								item.onclick = clicked;
							});
						}
						function showErrorMsg(response) {
							var msg = '<p>ERROR: The attempt to fetch ' + response.responseURL + ' failed with HTTP status ' + 
								response.status + ' (' + response.statusText + ').</p>' +
								'<p>Remember that you need to serve the presentation HTML from a HTTP server.</p>';
								response.panel.innerHTML = msg;
						}

						custom.forEach(function(element, index, array) {
							var panel = create('div', {
								'data-panel': 'Custom' + index,
								class: 'slide-menu-panel slide-menu-custom-panel'
							});
							if (element.content) {
								panel.innerHTML = element.content;
								enableCustomLinks(panel);
							}
							else if (element.src) {
								loadCustomPanelContent(panel, element.src);
							}
							panels.appendChild(panel);
						})
					}

					//
					// Themes
					//
					if (themes) {
						var panel = create('div', {
							class: 'slide-menu-panel',
							'data-panel': 'Themes'
						});
						panels.appendChild(panel);
						var menu = create('ul', {class: 'slide-menu-items'});
						panel.appendChild(menu);
						themes.forEach(function(t, i) {
							var item = create('li', {
								class: 'slide-menu-item',
								'data-theme': t.theme,
								'data-item': ''+(i+1)
							 }, t.name);
							 menu.appendChild(item);
							 item.onclick = clicked;
						})
					}

					//
					// Transitions
					//
					if (transitions) {
						var panel = create('div', {
							class: 'slide-menu-panel',
							'data-panel': 'Transitions'
						});
						panels.appendChild(panel);
						var menu = create('ul', {class: 'slide-menu-items'});
						panel.appendChild(menu);
						['None', 'Fade', 'Slide', 'Convex', 'Concave', 'Zoom', 'Cube', 'Page'].forEach(function(name, i) {
							var item = create('li', {
								class: 'slide-menu-item',
								'data-transition': name.toLowerCase(),
								'data-item': ''+(i+1)
							}, name);
							menu.appendChild(item);
							item.onclick = clicked;
						})
					}

					//
					// Open menu options
					//
					if (openButton) {
						// add menu button
						var div = create('div', {class: 'slide-menu-button'});
						var link = create('a', {href: '#'});
						link.appendChild(create('i', {class: 'fa fa-bars'}));
						div.appendChild(link);
						select('.reveal').appendChild(div);
						div.onclick = openMenu;
					}

					if (openSlideNumber) {
						// wrap slide number in link
						var slideNumber = select('div.slide-number');
						var wrapper = create('div', {class: 'slide-number-wrapper'});
						var link = create('a', {href: '#'});
						wrapper.appendChild(link);
						slideNumber.parentElement.insertBefore(wrapper, slideNumber);
						link.appendChild(slideNumber);
						link.onclick = openMenu;
					}

					//
					// Handle mouse overs
					//
					var mouseSelectionEnabled = true;
					selectAll('.slide-menu-panel .slide-menu-items li').forEach(function(item) {
						item.addEventListener("mouseenter", function(event) {
							if (mouseSelectionEnabled) {
								selectAll('.active-menu-panel .slide-menu-items li').forEach(function(i) {
									i.classList.remove('selected');
								});
								event.currentTarget.classList.add('selected');
							}
						});
					});
				}
				initialised = true;
			}

			module.toggle = toggleMenu;
			module.isOpen = isOpen;
			module.init = init;
			module.isInit = function() { return initialised };
			
			if (!delayInit) {
				init();
			}

			/**
			 * Extend object a with the properties of object b.
			 * If there's a conflict, object b takes precedence.
			 */
			function extend( a, b ) {
				for( var i in b ) {
					a[ i ] = b[ i ];
				}
			}

			/**
			 * Dispatches an event of the specified type from the
			 * reveal DOM element.
			 */
			function dispatchEvent( type, args ) {
				var event = document.createEvent( 'HTMLEvents', 1, 2 );
				event.initEvent( type, true, true );
				extend( event, args );
				document.querySelector('.reveal').dispatchEvent( event );

				// If we're in an iframe, post each reveal.js event to the
				// parent window. Used by the notes plugin
				if( config.postMessageEvents && window.parent !== window.self ) {
					window.parent.postMessage( JSON.stringify({ namespace: 'reveal', eventName: type, state: getState() }), '*' );
				}
			}

			dispatchEvent('menu-ready');
		}
	})
	});

	function select(selector, el) {
		if (!el) {
			el = document;
		}
		return el.querySelector(selector);
	}

	function selectAll(selector, el) {
		if (!el) {
			el = document;
		}
		return Array.prototype.slice.call(el.querySelectorAll(selector));
	}

	function create(tagName, attrs, content) {
		var el = document.createElement(tagName);
		if (attrs) {
			Object.getOwnPropertyNames(attrs).forEach(function(n) {
				el.setAttribute(n, attrs[n]);
			});
		}
		if (content) el.innerHTML = content;
		return el;
	}

	// modified from math plugin
	function loadResource( url, type, callback ) {
		var head = document.querySelector( 'head' );
		var resource;

		if ( type === 'script' ) {
			resource = document.createElement( 'script' );
			resource.type = 'text/javascript';
			resource.src = url;
		}
		else if ( type === 'stylesheet' ) {
			resource = document.createElement( 'link' );
			resource.rel = 'stylesheet';
			resource.href = url;
		}

		// Wrapper for callback to make sure it only fires once
		var finish = function() {
			if( typeof callback === 'function' ) {
				callback.call();
				callback = null;
			}
		}

		resource.onload = finish;

		// IE
		resource.onreadystatechange = function() {
			if ( this.readyState === 'loaded' ) {
				finish();
			}
		}

		// Normal browsers
		head.appendChild( resource );
	}

	function scriptPath() {
		// obtain plugin path from the script element
		var path;
		if (document.currentScript) {
			path = document.currentScript.src.slice(0, -7);
		} else {
			var sel = document.querySelector('script[src$="/menu.js"]')
			if (sel) {
				path = sel.src.slice(0, -7);
			}
		}
		return path;
	}

	return module;
})();
