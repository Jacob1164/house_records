<template>
  <div id="div_map">
    <div>
      <small class="text-muted">Enter a location. Don't see the house you're looking for? Register it now!</small>
      <b-form-input size="sm" name="search" id="search" v-model="search" placeholder="Enter a location!"/>
      <div id="map" style="height:82vh; width:100%;"></div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import simbaApi from './gateways/simba-api'

var map
export default {
  name: 'Home',
  data: () => ({
    search: null,
    searched: [],
    marked: [],
    markers: [],
    infoWindows: [],
    places: [],
    latLngs: []
  }),
  mounted () {
    let self = this
    // create a map
    map = new google.maps.Map(document.getElementById('map'), {
      center: new google.maps.LatLng(41.693206, -86.228631),
      zoom: 10,
      zoomControl: true,
      mapTypeControl: false,
      scaleControl: true,
      streetViewControl: false,
      rotateControl: false,
      fullscreenControl: false,
      styles: [{
        featureType: "poi",
        elementType: "labels",
        stylers: [{
          visibility: "off"
        }]
      }, {
        featureType: "transit",
        stylers: [{ "visibility": "off" }]
      }]
    })

    // create autocomplete
    var autocomplete = new google.maps.places.Autocomplete(search)
    autocomplete.setFields(['geometry', 'types'])
    autocomplete.addListener('place_changed', function () {
      var place = autocomplete.getPlace()
      if (!place.geometry) {
        // returns error if place has no location
        window.alert("No details available for input: '" + place.name + "'")
        return
      } else {
        map.setCenter(place.geometry.location)
        if (place.types[0] == 'continent') {
          map.setZoom(1)
        } else if (place.types[0] == 'country') {
          map.setZoom(4)
        } else if (place.types[0] == 'administrative_area_level_1') {
          map.setZoom(6)
        } else if (place.types[0] == 'administrative_area_level_2') {
          map.setZoom(10)
        } else if (self.latLngs.findIndex((item) => {
          let status = (item.la == (Math.round(place.geometry.location.lat() * 10000000) / 10000000) && item.ln == (Math.round(place.geometry.location.lng() * 10000000) / 10000000))
          return status
        }) != -1) {
          map.setZoom(17)
        } else {
          map.setZoom(14)
        }
      }
    }, {passive: false})

    // listner for map moved
    var timeout
    map.addListener('bounds_changed', function () {
      window.clearTimeout(timeout)
      timeout = window.setTimeout(function () {
        var bounds =  map.getBounds();
        self.getHomes()
      }, 200);
    }, {passive: false})
  },
  methods: {
    // get data from SIMBA Chain
    getHomes () {
      // constructs the GET url for simba
      var url = 'new_house/?'
      this.searched = []
      let self = this
      try {
        simbaApi.getData(url)
          .then(function (response) {
            self.searched = response.data.results
            self.addMarkers()
          })
      } catch (e) {
        console.log(e)
      }
    },

    // creates a marker and info window for all houses in view at the current time
    addMarkers () {
      let self = this
      for (let i = 0; i < self.searched.length; i++) {
        let lat = self.searched[i].payload.inputs.lat / 10000000
        let lng = self.searched[i].payload.inputs.lng / 10000000
        if (self.searched[i].payload.inputs.lat_neg == 1) {
          lat *= -1
        }
        if (self.searched[i].payload.inputs.lng_neg == 1) {
          lng *= -1
        }

        if (!self.marked.includes(self.searched[i].payload.inputs.addresss)) {
          self.marked.push(self.searched[i].payload.inputs.addresss)
          self.latLngs.push({
            la: lat,
            ln: lng
          })
          let marker = new google.maps.Marker({
            map: map,
            draggable: false,
            title: self.searched[i].payload.inputs.addresss,
            animation: google.maps.Animation.DROP,
            position: {lat: lat, lng: lng}
          })
          self.markers.push(marker)
          var contentString = '<div class="i_content" style="color: black;"><h6>' + self.searched[i].payload.inputs.addresss + '</h6>'
           + '<p>Date Built: ' + self.searched[i].payload.inputs.date + '</p>' + '<a href="/#/records/' + self.searched[i].payload.inputs.assetId + '"><u style="color: blue;">Get full house records</u></a>' + '</div>'

          let infoWindow = new google.maps.InfoWindow({
            content: contentString
          })
          let place = {
            marker: marker,
            iWindow: infoWindow
          }
          marker.addListener('click', function() {
            self.places.every(self.clearWindows)
            place.iWindow.open(map, marker)
          }, {passive: false})
          self.places.push(place)
        }
      }
      var markerCluster = new MarkerClusterer(map, self.markers,
            {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m',
             maxZoom: 16})
    },

    // makes sure only one info window is open at a time
    clearWindows (place) {
      place.iWindow.close()
      return true
    }
  }
}
</script>

<style lang="css" scoped>
#search {
  margin-bottom: 5px;
}
#div_map {
  margin-left: 7px;
  margin-right: 5px;
}
</style>
