<template>
  <div>
    <div class="post-form">
      <md-card class="md-layout-item md-size-90 md-large-size-80 md-medium-size-100 md-small-size-100 md-xsmall-size-100">
        <md-card-header>
          <div class="title">Register a Home</div>
        </md-card-header>

        <md-card-content class="post-card">
          <div class="md-layout-item md-size-100">
            <strong style="color:#64dd17;" id="setTest">Make sure to enter a valid address</strong>
          </div>
          <div class="md-layout md-gutter">
            <div class="md-layout-item md-size-80">
              <md-field>
                <label for="address">Address</label>
                <md-input name="address" id="address1" v-model="form1.addresss" :disabled="sending" placeholder=""/>
              </md-field>
            </div>
            <div class="md-layout-item md-size-20">
              <md-datepicker name="date" id="date" v-model="date" :disabled="sending" md-immediately/>
            </div>
          </div>

          <div>
            <div class="md-layout md-gutter">
              <div class="md-layout-item md-size-100">
                <md-field>
                  <label for="builder">Builder's Name</label>
                  <md-input name="builder" id="builder" v-model="form1.builder" :disabled="sending" />
                </md-field>
              </div>
            </div>
          </div>

        </md-card-content>

        <md-progress-bar class="md-accent" md-mode="indeterminate" v-if="sending"/>

        <md-card-actions>
          <md-button type="submit" class="md-accent md-raised" :disabled="!(form1.addresss && date && form1.builder && form1.lat && form1.lng)"  v-on:click="saveRecord()">Submit</md-button>
        </md-card-actions>
      </md-card>

        <md-snackbar :md-active.sync="recordSaved">The transaction was Posted, sign with your wallet now!!!</md-snackbar>
        <md-snackbar :md-active.sync="recordSigned">The transaction was Signed, Congratulations!!!</md-snackbar>
        <md-snackbar :md-active.sync="noWalletLogged">Please click the wallet button on the top right corner to login!!!</md-snackbar>

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
    scAction: null,
    sending: false,
    recordSaved: false,
    recordSigned: false,
    noWalletLogged: false,
    accountBalance: null,
    txnId: null,
    unsignedTxn: null,
    showWarning: true,
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
          var lat = results[0].geometry.viewport.na
          var lng = results[0].geometry.viewport.ga

          var send_lat = Math.round(((lat.j + lat.l) / 2) * 10000000)
          var send_lng = Math.round(((lng.j + lng.l) / 2) * 10000000)

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
          self.recordSigned = true
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
      this.form1.lat_neg = null
      this.form1.lng_neg = null
      this.date = null
    },

    // posts all the data to Simba Chain
    saveRecord (e) {
      if (!this.getWallet()) {
        this.noWalletLogged = true
        return
      }
      if (this.duplicate) {
        window.alert("This house is already registered")
        document.getElementById('address1').value = ''
        this.form1.lat_neg = null
        this.form1.lng_neg = null
        this.form1.assetId = null
        return
      }

      if ((new Date() - new Date(this.date)) < 0) {
        window.alert('Date can not be in the future')
        this.form1.date = null
        this.date = null
        return
      }

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
          self.recordSaved = true
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
.md-progress-bar {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
}
.post-form {
  margin-top: 40px;
  height: 550px;
}
.title {
  font-size: 20px;
  margin-left: 10px;
  margin-top: 7px;
}
.post-card {
  margin: 10px;
}
</style>
