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
		_setNotice('<img class="loader" src="./assets/img/lo.jpg" alt="loading"/>');

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
		const link = document.createElement('li');
	  	link.innerHTML = _capitalize(label);
	  	link.classList = isSelected ? 'selected active' : '';
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
			const a = document.createElement('div');

			post.tag=post.category=="Reactnative"?'<i class="fab fa-react"></i>':'<i class="fa fa-gamepad"></i>';
			a.target="_blank";
			a.classList="card wrapper";
			a.innerHTML = `<span onclick="changeVideo('${post.videoid}');">
				<div class="bg-img">
					<img src="https://img.youtube.com/vi/${post.videoid}/hqdefault.jpg">
				</div>
				 <div class="content">
						 <span class="cat">${post.category}</span>
								<a href="https://www.youtube.com/watch?v=${post.videoid}">
								<h4>${post.title}</h4></a>
							<div class="inside">
			   					 <div class="icon">${post.tag}</div>
								    <div class="contents">
								    ${_formatContent(post.content)}
								    </div>
	   
	  						</div>
					</div>
				</span>`;

			const model= document.createElement('div');
			model.classList="modal fade";
			model.id=post.videoid;
			post.in=post.information !=""?"<div class='contents justifiy'><pre>"+post.information+"</pre></div>":"";
			post.pro=post.projectlink!=""?`<span class="doc"><a class="link" href="`+post.projectlink+`" target="_blank">Project <i class="fab fa-github"></i></a></span>`:"";
			post.doc=`<span class="doc"><a class="link" href="`+post.documentlink+`" target="_blank">Document <i class="fa fa-file"></i></a></span>`;
			model.tabindex="-1";
			model.innerHTML=`<div class="modal-dialog" role="document">

							    <div class="modal-content">
							     <div class="modal-header">
							     <div class="col-xs-10 col-sm-10">
        							<h4 class="modal-title">${post.title}</h4></div>
        							<div class="col-xs-2 col-sm-2">
        									<button type="button" class="close" data-dismiss="modal" aria-label="Close">
         											<span aria-hidden="true"><i class="fa fa-times-circle"></i></span>
        									</button>
        									</div>
      							</div>
							      <div class="modal-body">
      								<iframe id="iframeYoutube" width="560" height="315"  
      								src="https://www.youtube.com/embed/${post.videoid}" 
      								frameborder="0" allowfullscreen></iframe> 
      							</div>
      							<div class="modal-footer">
							        <div class="container">
							                  <div class="row">
							                       <div class="col-xs-12 ">
									                        <div class="contents justifiy mb-20">
										    						${_formatContent(post.content)}
										    						  ${post.pro}
														    			${post.doc}
														    </div> 
														  
														  	${post.in}
								                    </div>
							                        
							   			 	</div>
										</div>
								</div>`;
			page.container.appendChild(a);
			page.container.appendChild(model);
		});
	}
function _formInfo(str){

}
	

	function _renderPostsPagination (pages) {
		if (pages.next) {
			const link = document.createElement('button');
			link.classList = 'tab';
			link.innerHTML = 'Load More ';
			link.onclick = function (event) {
				_incrementActivePage();
				_getPosts();
			};

			page.notice.innerHTML = '';
			page.notice.appendChild(link);
		} else {
			_setNotice('No more data to display');
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
  			element.classList = label === element.innerHTML.toLowerCase() ? 'selected active' : '';
  		});
	}

	return {
		init: init
 	};
}();