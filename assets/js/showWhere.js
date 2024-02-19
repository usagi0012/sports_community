var map = new naver.maps.Map("map", {
    center: new naver.maps.LatLng(37.5665, 126.978),
    zoom: 10,
});

var marker = new naver.maps.Marker({
    map: map,
});

var infoWindow = new naver.maps.InfoWindow();

function showWhere() {
    var address = document.getElementById("address").innerText;

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
            infoWindow.open(map, marker);
        },
    );
}
