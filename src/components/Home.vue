<template>
  <div class="md-layout md-gutter">
    <md-card class="md-alignment-center-center my-card md-size-20 md-layout-item" md-with-hover>
        <md-card-header>
          <div class="md-title">Login</div>
          <div class="md-subhead">Select a group to begain</div>
        </md-card-header>

        <md-card-content>
          <div>
            <md-radio v-model="role" value="bd" v-on:change="changeRole"><strong>Builder</strong></md-radio>
            <md-radio v-model="role" value="re" v-on:change="changeRole"><strong>Real Estate Agent</strong></md-radio>
            <md-radio v-model="role" value="ia" v-on:change="changeRole"><strong>Insurance Agent</strong></md-radio>
            <md-radio v-model="role" value="in" v-on:change="changeRole"><strong>Inspector</strong></md-radio>
            <md-radio v-model="role" value="ho" v-on:change="changeRole"><strong>Home Owner</strong></md-radio>
          </div>
          <br>
          <br>
        </md-card-content>
    </md-card>
    <md-card class="md-layout-item md-size-70">
      <div>
        <div class="md-title">Find a house</div>
        <md-field>
          <md-input name="search" id="search" v-model="search"/>
        </md-field>
        <div id="map" style="height:70vh; width:100%;"></div>
      </div>
    </md-card>
  </div>
</template>

<script>
/* eslint-disable */
let latlng = [41.693206, -86.228631]
let zoom = 10

export default {
  name: 'Home',
  data: () => ({
    role: null,
    search: null,
    map: null
  }),
  mounted () {
    if (localStorage.getItem('role')) {
      this.role = localStorage.getItem('role')
    }

    var map = new google.maps.Map(document.getElementById('map'), {
      center: new google.maps.LatLng(latlng[0], latlng[1]),
      zoom: zoom,
      zoomControl: true,
      mapTypeControl: false,
      scaleControl: true,
      streetViewControl: false,
      rotateControl: false,
      fullscreenControl: false
    })

    var autocomplete = new google.maps.places.Autocomplete(search)
    autocomplete.setFields(['address_component', 'geometry', 'types'])
    autocomplete.addListener('place_changed', function () {
      var place = autocomplete.getPlace()
      console.log(place)
      if (!place.geometry) {
        // returns error if place has no location
        window.alert("No details available for input: '" + place.name + "'")
        return
      } else {
        // Helpful note: you can set position by doing map.fitBounds(place.geometry.viewport)
        map.setCenter(place.geometry.location)
        if (place.types[0] == 'continent') {
          map.setZoom(1)
        } else if (place.types[0] == 'country') {
          map.setZoom(4)
        } else if (place.types[0] == 'administrative_area_level_1') {
          map.setZoom(6)
        } else if (place.types[0] == 'administrative_area_level_2') {
          map.setZoom(9)
        } else {
          map.setZoom(11)
        }

      }
    })
  },
  methods: {
    changeRole () {
      localStorage.setItem('role', this.role)
    }
  }
}

</script>

<style lang="css" scoped>
  .my-card {
    margin-top: 40px;
    width: 250px;
    display: inline-block;
    vertical-align: top;
    margin-bottom: 20px;
  }

  #map {
    margin-bottom: 10px;
  }
</style>
