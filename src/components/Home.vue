<template>
  <div class="md-layout md-gutter">
    <md-card class="md-layout-item md-size-100">
      <div>
        <md-field>
          <label for="search">Enter a location. Don't see the house you're looking for? Register it now!</label>
          <md-input name="search" id="search" v-model="search" placeholder=""/>
        </md-field>
        <div id="map" style="height:76vh; width:100%;"></div>
      </div>
    </md-card>
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
    searched: null,
    marked: [],
    markers: [],
    infoWindows: [],
    places: [],
  }),
  mounted () {
    // create a map
    map = new google.maps.Map(document.getElementById('map'), {
      center: new google.maps.LatLng(41.693206, -86.228631),
      zoom: 10,
      zoomControl: true,
      mapTypeControl: false,
      scaleControl: true,
      streetViewControl: false,
      rotateControl: false,
      fullscreenControl: false
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
        } else {
          map.setZoom(14)
        }

      }
    }, {passive: false})

    // listner for map moved
    let self = this
    var timeout
    map.addListener('bounds_changed', function () {
      window.clearTimeout(timeout)
      timeout = window.setTimeout(function () {
        var bounds =  map.getBounds();
        self.getHomes(Math.round(bounds.ga.j * 10000000), Math.round(bounds.ga.l * 10000000), Math.round(bounds.na.j * 10000000), Math.round(bounds.na.l * 10000000))
      }, 200);
    }, {passive: false})
  },
  methods: {
    // get data from SIMBA Chain
    getHomes (lng_min, lng_max, lat_min, lat_max,) {
      // constructs the GET url for simba
      var url = 'new_house/?'
      if (lat_min < 0 && lat_max < 0) {
        lat_min *= -1
        lat_max *= -1
        url += ('lat_lte=' + lat_min + '&lat_gte=' +lat_max + '&lat_neg_equals=1')
      } else {
        url += ('lat_gte=' + lat_min + '&lat_lte=' +lat_max + '&lat_neg_equals=0')
      }

      if (lng_min < 0 && lng_max < 0) {
        lng_min *= -1
        lng_max *= -1
        url += ('&lng_lte=' + lng_min + '&lng_gte=' +lng_max + '&lng_neg_equals=1')
      } else {
        url += ('&lng_gte=' + lng_min + '&lng_lte=' +lng_max + '&lng_neg_equals=0')
      }

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
          let marker = new google.maps.Marker({
            map: map,
            draggable: false,
            title: self.searched[i].payload.inputs.addresss,
            animation: google.maps.Animation.DROP,
            position: {lat: lat, lng: lng}
          })
          self.markers.push(marker)
          var contentString = '<div class="i_content" style="color: black;"><div class="md-subheading">' + self.searched[i].payload.inputs.addresss + '</div><br>'
           + '<div class="md-body-1">Date Built: ' + self.searched[i].payload.inputs.date + '</div><br>' + '<a href="/#/records/' + self.searched[i].payload.inputs.assetId + '">Get full house records</a>' + '</div>'

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
            {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'})
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
</style>
