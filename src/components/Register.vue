<template>
  <div>
    <div>
      <b-card bg-variant="light" class="col-xl-9 col-lg-10 col-md-11 col-sm-12 col-12 post-card" title="Register a Home" sub-title="Make sure to enter a valid address">
        <div class="row">
          <div class="col-12 col-lg-9">
            <b-form-group description="Address">
              <b-form-input name="address" id="address1" v-model="form1.addresss" :disabled="sending" placeholder=""/>
            </b-form-group>
          </div>
          <div class="col-12 col-sm-6 col-lg-3">
            <b-form-group description="Date">
              <b-form-input type="date" name="date" id="date" v-model="date" :disabled="sending"/>
            </b-form-group>
          </div>
          <div class="col-12 col-sm-6 col-lg-12">
            <b-form-group description="Builder's Name">
              <b-form-input name="builder" id="builder" v-model="form1.builder" :disabled="sending" />
            </b-form-group>
          </div>
        </div>

        <div class="row">
          <div class="col-12 col-sm-6">
            <b-form-group description="# of Bedrooms">
              <b-form-input name="bedrooms" id="bedrooms" v-model="form1.bedrooms" :disabled="sending" />
            </b-form-group>
          </div>
          <div class="col-12 col-sm-6">
            <b-form-group description="# of Bathrooms">
              <b-form-input name="bathrooms" id="bathrooms" v-model="form1.bathrooms" :disabled="sending" />
            </b-form-group>
          </div>
        </div>
        <div class="row">
          <div class="col-12 col-sm-6">
            <b-form-group description="Sqaure Footage">
              <b-form-input name="area" id="area" v-model="form1.area" :disabled="sending" />
            </b-form-group>
          </div>
          <div class="col-12 col-sm-6">
            <b-form-group description="# Acres on Lot">
              <b-form-input name="acres" id="acres" v-model="form1.acres" :disabled="sending" />
            </b-form-group>
          </div>
        </div>

        <div class="row">
          <b-button type="submit" variant="success" v-if="(form1.addresss && date && form1.builder && form1.lat && form1.lng && form1.bedrooms && form1.bathrooms && form1.area && form1.acres)"  v-on:click="saveRecord()">Submit</b-button>
          <b-button type="submit" variant="outline-success" v-if="!(form1.addresss && date && form1.builder && form1.lat && form1.lng && form1.bedrooms && form1.bathrooms && form1.area && form1.acres)" disabled>Submit</b-button>
          &nbsp; &nbsp; <b-spinner variant="primary" v-if="sending" label="Loading..."></b-spinner>
        </div>
      </b-card>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import { localstorage } from './mixins/localstorage'
import ethers from 'ethers'
import simbaApi from './gateways/simba-api'

export default {
  name: 'post',
  mounted () {
    let self = this

    // Google Autocomplete for registering a house
    setTimeout(function () {
      var autocomplete
      autocomplete = new google.maps.places.Autocomplete(document.getElementById('address1'))
      autocomplete.setFields(['address_component', 'geometry', 'formatted_address'])
      autocomplete.addListener('place_changed', function () {
        var place = autocomplete.getPlace()
        if (!place.geometry) {
          window.alert("No details available for input: '" + place.name + "'")
          document.getElementById('address1').value = ''
          return
        } else if (place.address_components[0].types[0] != 'street_number') {
          window.alert("All house address must start with a street number.")
          document.getElementById('address1').value = ''
          return
        } else {
          self.set(place.formatted_address)
          self.check_duplicate(place.formatted_address)
        }
      }, {passive: true})
    }, 1)
  },
  mixins: [localstorage],

  data: () => ({
    sending: false,
    txnId: null,
    unsignedTxn: null,
    date: null,
    duplicate: null,
    form1: {
      lat: null,
      date: null,
      lng: null,
      assetId: null,
      builder: null,
      lat_neg: 0,
      lng_neg: 0,
      addresss: null,
      bedrooms: null,
      bathrooms: null,
      area: null,
      acres: null

    }
  }),
  methods: {
    // gets the lattitude and longitude of an address. Used for new_house form
    set (address) {
      let self = this
      self.form1.addresss = address
      var geocoder = new google.maps.Geocoder()
      geocoder.geocode( { 'address': address}, function(results, status) {
        if (status == 'OK') {
          self.form1.assetId = results[0].place_id
          var send_lat = Math.round(results[0].geometry.location.lat() * 10000000)
          var send_lng = Math.round(results[0].geometry.location.lng() * 10000000)

          // for some reason, Simba does not accept negative integers
          // the following sets a separate boolean to true if the value is negative
          // (and makes it positive so Simba will accept it)
          self.form1.lat = Math.abs(send_lat)
          self.form1.lng = Math.abs(send_lng)
          if (send_lat < 0) {
            self.form1.lat_neg = 1
          }
          if (send_lng < 0) {
            self.form1.lng_neg = 1
          }
        } else {
          console.log('Geocode was not successful for the following reason: ' + status);
        }
      })
    },

    check_duplicate (fAddress) {
      var url = 'new_house/?addresss_exact=' + fAddress
      let self = this
      try {
        simbaApi.getData(url)
          .then(function (response) {
            self.duplicate = response.data.results.length
          })
      } catch (e) {
        console.log(e)
      }
    },

    // wallet
    getCurrentWallet () {
      this.unlockWallet()
    },

    // wallet
    unlockWallet () {
      try {
        let mnemonic = this.getWallet()
        this.sendTxn(mnemonic)
      } catch (e) {
        console.log(e)
      }
    },

    // wallet and signing simba transactions
    sendTxn (mnemonic) {
      let wallet = ethers.Wallet.fromMnemonic(mnemonic)
      let signedTxn = wallet.sign(this.unsignedTxn)
      let self = this
      let txnId = this.txnId
      let payload = {
        'payload': signedTxn
      }
      try {
        simbaApi.signTxn('transaction/' + txnId + '/', payload).then(function () {
          self.$parent.makeToast('The transaction was signed, congratulations!!!', 'success', 'Register')
          self.isSigning = false
        })
      } catch (e) {
        console.log(e)
      }
    },

    // clears all form fields
    clearForm () {
      this.form1.addresss = null
      this.form1.builder = null
      this.form1.lat = null
      this.form1.lng = null
      this.form1.lat_neg = 0
      this.form1.lng_neg = 0
      this.form1.date = null
      this.date = null
      this.form1.bedrooms = null
      this.form1.bathrooms = null
      this.form1.area = null
      this.form1.acres = null
    },

    // posts all the data to Simba Chain
    saveRecord (e) {
      if (!this.getWallet()) {
        this.$parent.makeToast('Please click the wallet button on the top right corner to login!!!', 'danger', 'Ethereum Wallet')
        return
      }
      if (this.duplicate) {
        window.alert("This house is already registered")
        document.getElementById('address1').value = ''
        this.form1.lat_neg = null
        this.form1.lng_neg = null
        this.form1.assetId = null
        this.form1.addresss = null
        return
      }

      if ((new Date() - new Date(this.date)) < 0) {
        window.alert('Date can not be in the future')
        this.date = null
        return
      } else {
        this.form1.date = new Date(this.date)
        this.form1.date = this.form1.date.toString().substring(4,10) + ',' + this.form1.date.toString().substring(10,15)
      }

      if(isNaN(this.form1.bedrooms) || isNaN(this.form1.bathrooms) || isNaN(this.form1.area) || isNaN(this.form1.acres)) {
        window.alert('# of bedrooms, bathrooms, acres and square footage must all be a numerical value.')
        return
      }
      console.log('Good Data')
      this.sending = true
      let bodyFormData = new FormData()
      bodyFormData.append('from', this.getAddress())

      this.form1.date = this.date.toString().substring(4,10) + ',' + this.date.toString().substring(10,15)
      for (let k in this.form1) {
        if (this.form1.hasOwnProperty(k)) {
          bodyFormData.append(k, this.form1[k])
        }
      }

      let self = this
      try {
        simbaApi.postData('new_house/', bodyFormData).then(function (res) {
          self.txnId = res.data.id
          self.unsignedTxn = res.data.payload.raw
          self.getCurrentWallet()
          self.$parent.makeToast('The transaction was posted!!!', 'success', 'Register')
          self.sending = false
          self.clearForm()
        })
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>

<style scoped>
.post-card {
  margin: 10px;
}
</style>
