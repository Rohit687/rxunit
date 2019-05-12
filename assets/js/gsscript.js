const app = function () {
	const API_BASE = 'https://script.google.com/macros/s/AKfycbyjxqEQ4d0Bs9VWV4aW_5E6KLVitlmP9Uk322oFs65sCUkh4g/exec';
	const API_KEY = 'D142EAF3DB9327B6D68B318864CFD';
	const CATEGORIES = ['reactnative', 'unity'];

	const state = {activePage: 1, activeCategory: null};
	const page = {};

	function init () {
		page.notice = document.getElementById('notice');
		page.filter = document.getElementById('filter');
		page.container = document.getElementById('container');

		_buildFilter();
		_getNewPosts();
	}

	function _getNewPosts () {
		page.container.innerHTML = '';
		_getPosts();
	}

	function _getPosts () {
		_setNotice('Loading posts');

		fetch(_buildApiUrl(state.activePage, state.activeCategory))
			.then((response) => response.json())
			.then((json) => {
				if (json.status !== 'success') {
					_setNotice(json.message);
				}

				_renderPosts(json.data);
				_renderPostsPagination(json.pages);
			})
			.catch((error) => {
				_setNotice('Unexpected error loading posts');
			})
	}

	function _buildFilter () {
	    page.filter.appendChild(_buildFilterLink('no filter', true));

	    CATEGORIES.forEach(function (category) {
	    	page.filter.appendChild(_buildFilterLink(category, false));
	    });
	}

	function _buildFilterLink (label, isSelected) {
		const link = document.createElement('span');
	  	link.innerHTML = _capitalize(label);
	  	link.classList = isSelected ? 'selected tab' : 'tab';
	  	link.onclick = function (event) {
	  		let category = label === 'no filter' ? null : label.toLowerCase();

			_resetActivePage();
	  		_setActiveCategory(category);
	  		_getNewPosts();
	  	};

	  	return link;
	}

	function _buildApiUrl (page, category) {
		let url = API_BASE;
		url += '?key=' + API_KEY;
		url += '&page=' + page;
		url += category !== null ? '&category=' + category : '';

		return url;
	}

	function _setNotice (label) {
		page.notice.innerHTML = label;
	}

	function _renderPosts (posts) {
		posts.forEach(function (post) {
			const article = document.createElement('div');
			article.classList ="mobile-mb-30 col-xs-12 col-sm-6 col-md-3 animate move-fadeInUp paddingup";
			article.innerHTML = `
			<div class="single-service pt-50 pb-60 plr-20">
				<h4>${post.title}</h4>
				<div class="article-details">
					<div>By ${post.author} on ${_formatDate(post.timestamp)}</div>
					<div>Posted in ${post.category}</div>
				</div>
				${_formatContent(post.content)}
				</div>
			`;
			page.container.appendChild(article);
		});
	}

	function _renderPostsPagination (pages) {
		if (pages.next) {
			const link = document.createElement('button');
			link.classList = 'tab';
			link.innerHTML = 'More ';
			link.onclick = function (event) {
				_incrementActivePage();
				_getPosts();
			};

			page.notice.innerHTML = '';
			page.notice.appendChild(link);
		} else {
			_setNotice('No more Tutorials to display');
		}
	}

	function _formatDate (string) {
		return new Date(string).toLocaleDateString('en-GB');
	}

	function _formatContent (string) {
		return string.split('\n')
			.filter((str) => str !== '')
			.map((str) => `<p>${str}</p>`)
			.join('');
	}

	function _capitalize (label) {
		return label.slice(0, 1).toUpperCase() + label.slice(1).toLowerCase();
	}

	function _resetActivePage () {
		state.activePage = 1;
	}

	function _incrementActivePage () {
		state.activePage += 1;
	}

	function _setActiveCategory (category) {
		state.activeCategory = category;
		
		const label = category === null ? 'no filter' : category;
		Array.from(page.filter.children).forEach(function (element) {
  			element.classList = label === element.innerHTML.toLowerCase() ? 'selected tab ' : 'tab';
  		});
	}

	return {
		init: init
 	};
}();