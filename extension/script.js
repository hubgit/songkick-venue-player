var findArtists = function(selector) {
	var nodes = document.querySelectorAll(selector.event);

	for (var i = 0; i < nodes.length; i++) {
		var node = nodes[i];

		var artistNodes = node.querySelectorAll(selector.artist);
		if (!artistNodes.length) continue;

		var artistNode = artistNodes.item(0);
		var artist = artistNode.textContent.trim();

		addTomahawkArtistLink(artistNode.insertBefore(document.createElement("span"), artistNode.firstChild), artist);
		addSpotifyTrackEmbed(node.appendChild(document.createElement("div")), artist);
	}
};

var addTomahawkArtistLink = function(node, artist) {
	var link = document.createElement("a");
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

var addSpotifyTrackEmbed = function(node, artist) {
	var query = 'artist:"' + artist + '"';

	var xhr = new XMLHttpRequest();
	xhr.open("GET", "http://ws.spotify.com/search/1/track.json" + buildQueryString({ q: query }), true);
	xhr.onreadystatechange = function(){
		if(xhr.readyState == 4){
			var data = JSON.parse(xhr.responseText);
			if (!data.tracks || !data.tracks.length) return;

			data.tracks.slice(0, 1).forEach(function(track) {
				node.appendChild(buildSpotifyTrackEmbed(track));
			});
		}
	};
	xhr.send(null);
};

var buildSpotifyTrackEmbed = function(track) {
	var object = document.createElement("object");
	object.setAttribute("type", "text/html");
	object.setAttribute("data", "https://embed.spotify.com/" + buildQueryString({ uri: track.href }));
	object.style.width = "300px";
	object.style.height = "80px";
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
	window.open(event.target.href, "Resolver", "menubar=no,toolbar=no,location=no,height=500,width=800");
}

findArtists({
	"event": ".event-listings > li",
	"artist": ".artists strong",
});