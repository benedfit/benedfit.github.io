var posts = [{"id":"/2013/06/phases-and-atomic-design-phase-one","title":"Phases and Atomic Design: Phase One","date":"2013-06-28","displayDate":"2013-06-28","excerpt":"<p>As a follow up to my recent post on <a href=/2013/06/atomic-design-phases-and-mesophases>Phases (and Mesophases) - a possible addendum to Atomic Design</a> I recently released the first addition to <a href=https://github.com/bradfrost/patternlab target=_blank>Brad Frost's Pattern Lab</a> to allow quick switching between defined breakpoints.</p>","content":"As a follow up to my recent post on Phases (and Mesophases) - a possible addendum to Atomic Design I recently released the first addition to Brad Frost's Pattern Lab to allow quick switching between defined breakpoints.The first release includes:	Basic feature to traverse /css/scss folder structure  and find SASS variables prefixed $bp-, then render as a 'Phases' tab  in the menu bar, using remainder of variable name and value for control  e.g. $bp-small becomes 'SMALL &gt;'; 24em.	Basic support provided for detecting whether px or em value has been specified.To-do:	Provide configuration to allow user to set pattern to match variable name on.	Possibly order the options based on size rather than order of declaration	Confirm this works with .sass as well as .scss	Deal with other browser units of measureCheck out the release on GitHub and let me know what you think via Twitter.UPDATEBrad's updated patternlab.bradfrostweb.com with my first release. So try it out!"},{"id":"/2013/06/atomic-design-phases-and-mesophases","title":"Phases (and Mesophases) - a possible addendum to Atomic Design","date":"2013-06-05","displayDate":"2013-06-05","excerpt":"<p>This Monday I had the absolute pleasure of attending <a href=http://bradfrostweb.com/ target=_blank>Brad Frost</a>'s <em>Reasons to be Responsive</em> workshop (<a href=http://www.jrayson.co.uk/blog/130603-reasons-to-be-awesome target=_blank>Recap by Jake Ryan</a>). Among the 8 'awesome' hours of RWD gold, Brad introduced us to <a href=http://bradfrostweb.com/blog/link/atomic-design/ target=_blank>Atomic Design</a>, a modular approach to responsive design and development, and his brand new tool <a href=http://patternlab.bradfrostweb.com/ target=_blank>Pattern Lab</a> for forging websites using the Atomic Design approach.</p><p>One of the other topics during the day was inevitably the art of selecting breakpoints, and more importantly for this post, the naming of the SASS variables for these breakpoints, and how said names could be tied into Atomic Design.</p>","content":"This Monday I had the absolute pleasure of attending Brad Frost's Reasons to be Responsive workshop (Recap by Jake Ryan). Among the 8 'awesome' hours of RWD gold, Brad introduced us to Atomic Design, a modular approach to responsive design and development, and his brand new tool Pattern Lab for forging websites using the Atomic Design approach.One of the other topics during the day was inevitably the art of selecting breakpoints, and more importantly for this post, the naming of the SASS variables for these breakpoints, and how said names could be tied into Atomic Design.Introducing... PhasesI love a good science analogy, so following along the matter-based naming convention of Atomic Design, I settled upon Phases as a suitable term. In physics the term phase is sometimes used as a synonym for states of matter (this being another term that I considered using, until I learned of mesophases, but I'll get onto that shortly), which you may remember from GSCE physics being: solid, liquid, gas, and a new one to me, plasma.So I started experimenting with using Phases as a way to name my SASS variables, which lead to such examples as $bp-small: 24em; becoming $phase-first: 24em; and $bp-med: 46.8em; becoming $phase-second: 46.8em;.That's all very well and good Ben, by what about tweakpoints - Someone, somewhereI hear you... That's where Mesophases come along. In physics, a mesophase is a state of matter intermediate between liquid and solid.I envisage Phases as a way to describe when the layout of a page changes significantly, for example, if it changes from a one column to multi-column layout. Mesophases, on the other hand, would be the changes between those significant changes, for example, tweaking the font-size of the nav to make it fit more comfortablly.As these  are changes affecting Atomic Design organisms, molecules, or even atoms, I feel it's best to name the associated SASS variables accordingly. So what once might have been $bp-small-2: 29.75em; could become $mesophase-nav-first: 29.75em; What next?One of Brad's key aims for Pattern Lab is that he doesn't want to dictate naming conventions and development styles, and I'm keen to stick to that plan. So if you don't like the idea of Phases and Mesophases, please do ignore these musing. However, my plan is to take my fork of Pattern Lab, and work out how Phases and Mesophases can be automatically added to the UI directly by looking for them in .scss files, and provide users with the means to scale the display to the necessary dimensions to view them.Please feel free to share your thoughts with me on Twitter @benedfitP.S. I do plan on opening my blog for comments in the near future, but the Blogger comments module looks terrible out-of-the-box, and my OCD can't handle having it live in it's current state :)"},],
index = lunr(function () {
	this.field('title', 10);
	this.field('content');
}), entries;

for (var post in posts) {
	index.add(posts[post]);
}

$(function () {
	$('#header').removeClass('hide-search');
	
	$('#search button').click(function (e) {
		e.preventDefault();
		search();
	});
	
	$("#search input").keypress(function (e) {
		if (e.which == 13) {
			e.preventDefault();
			search();
		}
	});
})

function search () {
  var results = $.map(index.search($("#search input").val()), function (result) {
  	return $.grep(posts, function (entry) { 
  		return entry.id === result.ref 
  	})[0];
  }),
  $container = $('#content'),
  template = Mustache.compile($('#search-results-template').html());
  
  $container.empty();
  
  if (results && results.length > 0) {
  	$container.append(template({ posts: results }));
  }
}