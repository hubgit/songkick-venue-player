var findArtists = function(selector) {
	var nodes = document.querySelectorAll(selector.event);

	for (var i = 0; i < nodes.length; i++) {
		var node = nodes[i];

		var artistNodes = node.querySelectorAll(selector.artist);
		if (!artistNodes.length) continue;

		var artistNode = artistNodes.item(0);
		var artist = artistNode.textContent.trim();

		addTomahawkArtistLink(artistNode.insertBefore(document.createElement("span"), artistNode.firstChild), artist);
		addTomahawkArtistEmbed(node.appendChild(document.createElement("div")), artist);
	}
};

var addTomahawkArtistLink = function(node, artist) {
	var link = document.createElement("a");
	//link.href = "tomahawk://view/artist" + buildQueryString({ name: artist });
	link.href = "http://toma.hk/artist/" + encodeURIComponent(artist);
	//link.innerHTML = "▶";
	link.style.background = "url(http://www.tomahawk-player.org/assets/ico/favicon.ico) no-repeat right center";
	link.style.marginRight = "5px";
	link.style.height = "16px";
	link.style.width = "16px";
	link.style.display = "inline-block";

	link.addEventListener("click", openNewWindow, true);
	node.appendChild(link);
};

var addTomahawkArtistEmbed = function(node, artist) {
	var object = document.createElement("object");
	object.setAttribute("type", "text/html");
	object.setAttribute("data", "http://toma.hk/embed.php" + buildQueryString({ artist: artist }));
	object.style.width = "300px";
	object.style.height = "300px";
	object.style.margin = "10px 0";
	object.style.display = "block";
	object.style.clear = "both";

	node.appendChild(object);
}

var buildQueryString = function(items) {
	var parts = [];

	var add = function(key, value) {
		parts.push(encodeURIComponent(key) + "=" + encodeURIComponent(value));
	}

	for (var key in items) {
		if (!items.hasOwnProperty(key)) continue;

   		var obj = items[key];

   		if (Array.isArray(obj)) {
   			obj.forEach(function(value) {
   				add(key, value);
   			});
   		}
   		else {
   			add(key, obj);
   		}
	}

	return parts.length ? "?" + parts.join("&").replace(/%20/g, "+") : "";
}

var openNewWindow = function(event) {
	event.preventDefault();
	event.stopPropagation();
	window.open(event.target.href, "Resolver", "menubar=no,toolbar=no,location=yes,height=500,width=800");
}

findArtists({
	"event": ".event-listings > li",
	"artist": ".artists strong",
});