function getCurrentLocation() {
    navigator.geolocation.getCurrentPosition(
        function (position) {
            var userLatLng = new naver.maps.LatLng(
                position.coords.latitude,
                position.coords.longitude,
            );
            setInitialMarker(userLatLng);
        },
        function (error) {
            console.error("Error getting current location:", error);
        },
    );
}

function setInitialMarker(latlng) {
    marker.setPosition(latlng);
    map.setCenter(latlng);
    searchCoordinateToAddress(latlng);
}
getCurrentLocation();

$("#getCurrentLocation").on("click", function () {
    getCurrentLocation();
});

const currentlocation = getCurrentLocation();

var map = new naver.maps.Map("map", {
    center: new naver.maps.LatLng(),
    zoom: 10,
});

var marker = new naver.maps.Marker({
    position: new naver.maps.LatLng(),
    map: map,
});

naver.maps.Event.addListener(map, "click", function (e) {
    marker.setPosition(e.latlng);
    searchCoordinateToAddress(e.latlng);
});

var infoWindow = new naver.maps.InfoWindow({
    anchorSkew: true,
});

map.setCursor("pointer");

function searchCoordinateToAddress(latlng) {
    infoWindow.close();

    naver.maps.Service.reverseGeocode(
        {
            coords: latlng,
            orders: [
                naver.maps.Service.OrderType.ADDR,
                naver.maps.Service.OrderType.ROAD_ADDR,
            ].join(","),
        },
        function (status, response) {
            if (status === naver.maps.Service.Status.ERROR) {
                console.error("Something went wrong:", response);
                return;
            }

            var items = response.v2.results,
                address = "",
                htmlAddresses = [];

            for (var i = 0, ii = items.length, item, addrType; i < ii; i++) {
                item = items[i];
                address = makeAddress(item) || "";
                addrType =
                    item.name === "roadaddr" ? "[도로명 주소]" : "[지번 주소]";

                htmlAddresses.push(i + 1 + ". " + addrType + " " + address);
            }

            htmlAddresses.push(
                "<br/><strong>위도:</strong> " +
                    latlng.lat() +
                    "<br/><strong>경도:</strong> " +
                    latlng.lng(),
            );

            infoWindow.setContent(
                [
                    '<div style="padding:10px;min-width:200px;line-height:150%;">',
                    '<h4 style="margin-top:5px;">검색 좌표</h4><br />',
                    htmlAddresses.join("<br />"),
                    "</div>",
                ].join("\n"),
            );

            infoWindow.open(map, latlng);
        },
    );
}

function searchAddressToCoordinate(address) {
    naver.maps.Service.geocode(
        {
            query: address,
        },
        function (status, response) {
            if (status === naver.maps.Service.Status.ERROR) {
                console.error("Something went wrong:", response);
                return;
            }

            if (response.v2.meta.totalCount === 0) {
                alert("No results found for the address: " + address);
                return;
            }

            var item = response.v2.addresses[0];
            var point = new naver.maps.Point(item.x, item.y);

            marker.setPosition(point);

            var htmlAddresses = [];

            if (item.roadAddress) {
                htmlAddresses.push("[도로명 주소] " + item.roadAddress);
            }

            if (item.jibunAddress) {
                htmlAddresses.push("[지번 주소] " + item.jibunAddress);
            }

            if (item.englishAddress) {
                htmlAddresses.push("[영문명 주소] " + item.englishAddress);
            }

            htmlAddresses.push(
                "<br/><strong>위도:</strong> " +
                    point.y +
                    "<br/><strong>경도:</strong> " +
                    point.x,
            );

            infoWindow.setContent(
                [
                    '<div style="padding:10px;min-width:200px;line-height:150%;">',
                    '<h4 style="margin-top:5px;">검색 주소 : ' +
                        address +
                        "</h4><br />",
                    htmlAddresses.join("<br />"),
                    "</div>",
                ].join("\n"),
            );

            map.setCenter(point);
            infoWindow.open(map, point);

            // Update the confirmDORO and confirmJUSO elements
            $("#confirmDORO").text(item.roadAddress);
            $("#confirmJUSO").text(item.jibunAddress);
        },
    );
}

function initGeocoder() {
    map.addListener("click", function (e) {
        searchCoordinateToAddress(e.coord);
    });

    $("#address").on("keydown", function (e) {
        var keyCode = e.which;

        if (keyCode === 13) {
            searchAddressToCoordinate($("#address").val());
        }
    });

    $("#submit").on("click", function (e) {
        e.preventDefault();

        searchAddressToCoordinate($("#address").val());
    });

    $("#confirm").on("click", function (e) {
        e.preventDefault();

        var latlng = marker.getPosition();

        naver.maps.Service.reverseGeocode(
            {
                coords: latlng,
                orders: [
                    naver.maps.Service.OrderType.ADDR,
                    naver.maps.Service.OrderType.ROAD_ADDR,
                ].join(","),
            },
            function (status, response) {
                if (status === naver.maps.Service.Status.ERROR) {
                    console.error("Something went wrong:", response);
                    return;
                }

                var items = response.v2.results,
                    jibunAddress = "",
                    roadAddress = "";

                for (var i = 0, ii = items.length, item; i < ii; i++) {
                    item = items[i];
                    if (item.name === "roadaddr") {
                        roadAddress = makeAddress(item) || "";
                    } else {
                        jibunAddress = makeAddress(item) || "";
                    }
                }

                $("#confirmDORO").text(roadAddress);
                $("#confirmJUSO").text(jibunAddress);
            },
        );
    });

    searchAddressToCoordinate(currentlocation);
}

function makeAddress(item) {
    if (!item) {
        return;
    }

    var name = item.name,
        region = item.region,
        land = item.land,
        isRoadAddress = name === "roadaddr";

    var sido = "",
        sigugun = "",
        dongmyun = "",
        ri = "",
        rest = "";

    if (hasArea(region.area1)) {
        sido = region.area1.name;
    }

    if (hasArea(region.area2)) {
        sigugun = region.area2.name;
    }

    if (hasArea(region.area3)) {
        dongmyun = region.area3.name;
    }

    if (hasArea(region.area4)) {
        ri = region.area4.name;
    }

    if (land) {
        if (hasData(land.number1)) {
            if (hasData(land.type) && land.type === "2") {
                rest += "산";
            }

            rest += land.number1;

            if (hasData(land.number2)) {
                rest += "-" + land.number2;
            }
        }

        if (isRoadAddress === true) {
            if (checkLastString(dongmyun, "면")) {
                ri = land.name;
            } else {
                dongmyun = land.name;
                ri = "";
            }

            if (hasAddition(land.addition0)) {
                rest += " " + land.addition0.value;
            }
        }
    }

    return [sido, sigugun, dongmyun, ri, rest].join(" ");
}

function hasArea(area) {
    return !!(area && area.name && area.name !== "");
}

function hasData(data) {
    return !!(data && data !== "");
}

function checkLastString(word, lastString) {
    return new RegExp(lastString + "$").test(word);
}

function hasAddition(addition) {
    return !!(addition && addition.value);
}

naver.maps.onJSContentLoaded = initGeocoder;
