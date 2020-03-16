//constants
const imageBaseUrl = "https://image.tmdb.org/t/p/w500";
const baseUrl = "https://api.themoviedb.org/3/movie/";
const apiKey = "de7353291fb04d7775e1befde23811b9";
const urlPopular =
  baseUrl + "popular?api_key=" + apiKey + "&language=en-US&page=1";
//
const Http = new XMLHttpRequest();
//get popular movies
Http.open("GET", urlPopular);
Http.send();
Http.onreadystatechange = e => {
  var responce = Http.responseText;
  if (responce != "") {
    var popularFilms = JSON.parse(responce);
    if (popularFilms.results.length > 0) {
      //get popular movies and create list with it
      var allFilms = '<ul id="parent-list">';
      popularFilms.results.forEach(element => {
        allFilms +=
          '<li><a id="' +
          element.id +
          '" href="javascript:void(0);" >' +
          element.title +
          "</a></li>";
      });
      allFilms += "</ul>";
      document.getElementById("demo").innerHTML = allFilms;
      //event on select item in list

      document
        .getElementById("parent-list")
        .addEventListener("click", function(e) {
          if (e.target && e.target.nodeName == "A") {
            popularFilms.results.forEach(element => {
              if (element.id == e.target.id) {
                ShowMovie(element, e);
              }
            });
          }
        });
      //Show movie and description
      function ShowMovie(element, e) {
        var newPageHtml =
          '<p><img src="' +
          imageBaseUrl +
          element.poster_path +
          '" alt="' +
          element.original_title +
          '"/></p>';
        newPageHtml += "<p><h1>" + element.original_title + "</h1></p>";
        newPageHtml += "<p>" + element.overview + "</p>";

        function recomenadationDownloadCallback(value) {
          newPageHtml += value;
          document.getElementById("demo").innerHTML = newPageHtml;
        }

        DownloadRecomendation(e.target.id, recomenadationDownloadCallback);
      }

      function SearchMovie() {
        var searchFilms = document.getElementById("inputSearch").value;
        var checkSerchFilm = false;
        var allFilms = '<ul id="parent-list">';
        popularFilms.results.forEach(element => {
          if (
            element.title.toUpperCase().search(searchFilms.toUpperCase()) != -1
          ) {
            allFilms +=
              '<li><a id="' +
              element.id +
              '" href="javascript:void(0);" >' +
              element.title +
              "</a></li>";
            checkSerchFilm = true;
          }
        });
        if (!checkSerchFilm) {
          alert("фільм не знайденно");
          return;
        }
        allFilms += "</ul>";
        document.getElementById("demo").innerHTML = allFilms;
        document
          .getElementById("parent-list")
          .addEventListener("click", function(e) {
            if (e.target && e.target.nodeName == "A") {
              popularFilms.results.forEach(element => {
                if (element.id == e.target.id) {
                  ShowMovie(element, e);
                }
              });
            }
          });
      }
      //event on click search button
      document.getElementById("btnSearch").onclick = SearchMovie;
    }
  }
};

function DownloadRecomendation(id, callback) {
  const urlRecommendations =
    baseUrl +
    id +
    "/recommendations?api_key=" +
    apiKey +
    "&language=en-US&page=1";
  var checkSomething = true;
  Http.open("GET", urlRecommendations);
  Http.send();

  Http.onreadystatechange = e => {
    var responce = Http.responseText;
    var numberForRecomendation = 0;

    if (responce != "" && checkSomething) {
      var recomenadtionFilm = JSON.parse(responce);
      if (recomenadtionFilm.results.length > 0) {
        var newWindow = '<p><h3>Recommendations</h3></p><ul id="parent-list">';
        recomenadtionFilm.results.forEach(element => {
          if (numberForRecomendation < 3) {
            newWindow +=
              '<li><a id="' +
              element.id +
              '" href="javascript:void(0);" >' +
              element.title +
              "</a></li>";
            numberForRecomendation++;
          }
        });
        newWindow += "</ul>";
        checkSomething = false;
        callback.apply(this, [newWindow]);
        document
          .getElementById("parent-list")
          .addEventListener("click", function(e) {
            if (e.target && e.target.nodeName == "A") {
              recomenadtionFilm.results.forEach(element => {
                if (element.id == e.target.id) {
                  ShowMovie(element, e);
                }
              });
            }
          });
        function ShowMovie(element, e) {
          var newPageHtml =
            '<p><img src="' +
            imageBaseUrl +
            element.poster_path +
            '" alt="' +
            element.original_title +
            '"/></p>';
          newPageHtml += "<p><h1>" + element.original_title + "</h1></p>";
          newPageHtml += "<p>" + element.overview + "</p>";

          function recomenadationDownloadCallback(value) {
            newPageHtml += value;
            document.getElementById("demo").innerHTML = newPageHtml;
          }

          DownloadRecomendation(e.target.id, recomenadationDownloadCallback);
        }
      }
    }
  };
}
