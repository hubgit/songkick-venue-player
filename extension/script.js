var findArtists = function(selector) {
	var nodes = document.querySelectorAll(selector.event);

	for (var i = 0; i < nodes.length; i++) {
		var node = nodes[i];

		var artistNodes = node.querySelectorAll(selector.artist);
		if (!artistNodes.length) continue;

		var artistNode = artistNodes.item(0);
		var artist = artistNode.textContent.trim();

		addTomahawkArtistLink(artistNode.insertBefore(document.createElement("span"), artistNode.firstChild), artist);
		addSpotifyTrackLinks(node.appendChild(document.createElement("div")), artist);
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

/*
var addTomahawkEmbed = function(node, artist) {
	var object = document.createElement("object");
	object.setAttribute("type", "text/html");
	object.setAttribute("data", "http://toma.hk/embed.php" + buildQueryString({ artist: artist }));
	object.style.width = "100%";
	object.style.height = "200px";
	object.style.margin = "10px 0";

	node.appendChild(object);
}
*/

var addSpotifyTrackLinks = function(node, artist) {
	var query = 'artist:"' + artist + '"';

	var xhr = new XMLHttpRequest();
	xhr.open("GET", "http://ws.spotify.com/search/1/track.json" + buildQueryString({ q: query }), true);
	xhr.onreadystatechange = function(){
		if(xhr.readyState == 4){
			var data = JSON.parse(xhr.responseText);
			if (!data.tracks || !data.tracks.length) return;

			data.tracks.slice(0, 1).forEach(function(track) {
				node.appendChild(buildSpotifyTrackEmbed(track, artist));
			});
		}
	};
	xhr.send(null);
};

var buildSpotifyTrackEmbed = function(track, artist) {
	var object = document.createElement("iframe");
	object.setAttribute("type", "text/html");

	var url = "http://toma.hk/embed.php?artist="+encodeURIComponent(artist)+"&title="+encodeURIComponent(track.name);

	object.setAttribute("scrolling", "no");
	object.setAttribute("frameborder", "0");
	object.setAttribute("allowtransparency", "true");
	object.setAttribute("src", url);

	object.setAttribute("data", "https://embed.spotify.com/" + buildQueryString({ uri: track.href }));
	object.style.width = "300px";
	object.style.height = "300px";
	object.style.margin = "10px 0";
	object.style.display = "block";
	object.style.clear = "both";
	return object;
};

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