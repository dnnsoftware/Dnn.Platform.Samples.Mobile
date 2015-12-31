(function () {
	window.Favorites = {
		show: function() {
			window.Books.data.filter({ field: "is_favorite", operator: "eq", value: true });
		},
		hide: function() {
			window.Books.data.filter([]);
		}
	};
}());