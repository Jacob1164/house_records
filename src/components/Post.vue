<template>
  <div>
    <div v-if="showWarning">
      <md-card class="my-card" md-with-hover>
        <md-ripple>
          <md-card-header>
            <md-card-header-text>
              <div class="md-title">Warning</div>
              <div class="md-subhead">Please go back to Home Page</div>
            </md-card-header-text>
            <md-card-media>
              <md-icon class="md-size-3x">
                warning
              </md-icon>
            </md-card-media>
          </md-card-header>
          <md-card-content>
            You need to select a group to begain
          </md-card-content>

        </md-ripple>
      </md-card>
    </div>

    <div v-if="!showWarning">
      <div class="post-form">
        <md-card class="md-layout-item md-size-90 md-large-size-80 md-medium-size-100 md-small-size-100 md-xsmall-size-100">
          <md-card-header>
            <div v-if="showBD" class="title">Register a Home</div>
            <div v-if="showRE" class="title">Real Estate Agent</div>
            <div v-if="showIA" class="title">Insurance Agent</div>
            <div v-if="showIN" class="title">Inspector</div>
            <div v-if="showHO" class="title">House Owner</div>
          </md-card-header>

          <md-card-content class="post-card">
            <div v-if="showBD" class="md-layout-item md-size-100">
              <strong style="color:#64dd17;" id="setTest">Make sure to enter a valid address</strong>
            </div>
            <div v-if="showRE" class="md-layout-item md-size-100">
              <strong style="color:#64dd17;">Log A Sold House</strong>
            </div>
            <div v-if="showIA" class="md-layout-item md-size-100">
              <strong style="color:#64dd17;">File An Accident</strong>
            </div>
            <div v-if="showIN" class="md-layout-item md-size-100">
              <strong style="color:#64dd17;">File An Inspection</strong>
            </div>
            <div v-if="showHO" class="md-layout-item md-size-100">
              <strong style="color:#64dd17;">Report A Home Improvement</strong>
            </div>

            <div class="md-layout md-gutter">
              <div class="md-layout-item md-size-80">
                <md-field>
                  <label for="address">Address</label>
                  <md-input v-if="showBD" name="address" id="address1" v-model="form1.addresss" :disabled="sending" placeholder=""/> <!--v-on:change="set" -->
                  <md-input v-if="showRE" name="address" id="address2" v-model="form2.addresss" :disabled="sending" />
                  <md-input v-if="showIA" name="address" id="address3" v-model="form3.addresss" :disabled="sending" />
                  <md-input v-if="showIN" name="address" id="address4" v-model="form4.addresss" :disabled="sending" />
                  <md-input v-if="showHO" name="address" id="address5" v-model="form5.addresss" :disabled="sending" />
                </md-field>
              </div>
              <div class="md-layout-item md-size-20">

                  <md-datepicker v-if="showBD" name="date" id="date1" v-model="form1.date" :disabled="sending" />
                  <md-datepicker v-if="showRE" name="date" id="date2" v-model="form2.date" :disabled="sending" />
                  <md-datepicker v-if="showIA" name="date" id="date3" v-model="form3.date" :disabled="sending" />
                  <md-datepicker v-if="showIN" name="date" id="date4" v-model="form4.date" :disabled="sending" />
                  <md-datepicker v-if="showHO" name="date" id="date5" v-model="form5.date" :disabled="sending" />

              </div>
            </div>

            <div v-if="showBD">
              <div class="md-layout md-gutter">
                <div class="md-layout-item md-size-100">
                  <md-field>
                    <label for="builder">Builder's Name</label>
                    <md-input name="builder" id="builder" v-model="form1.builder" :disabled="sending" />
                  </md-field>
                </div>
              </div>
            </div>

            <div v-if="showRE">
              <div class="md-layout md-gutter">
                <div class="md-layout-item md-size-50">
                  <md-field>
                    <label for="previousOwner">Previous Owner</label>
                    <md-input name="previousOwner" id="previousOwner" v-model="form2.previousOwner" :disabled="sending" />
                  </md-field>
                </div>
                <div class="md-layout-item md-size-50">
                  <md-field>
                    <label for="newOWner">New Owner</label>
                    <md-input name="newOWner" id="danewOWnerte" v-model="form2.newOWner" :disabled="sending" />
                  </md-field>
                </div>
              </div>
              <div class="md-layout md-gutter">
                <div class="md-layout-item md-size-50">
                  <md-field>
                    <label for="agentName">Real Estate Agent's Name</label>
                    <md-input name="agentName" id="agentName" v-model="form2.agentName" :disabled="sending" />
                  </md-field>
                </div>
                <div class="md-layout-item md-size-50">
                  <md-field>
                    <label for="price">Price</label>
                    <md-input name="price" id="price" v-model="form2.price" :disabled="sending" />
                  </md-field>
                </div>
              </div>
            </div>

            <div v-if="showIA">
              <div class="md-layout md-gutter">
                <div class="md-layout-item md-size-66">
                  <md-field>
                    <label for="incident">Type of Incident</label>
                    <md-input name="incident" id="incident" v-model="form3.incident" :disabled="sending" />
                  </md-field>
                </div>
                <div class="md-layout-item md-size-33">
                  <md-field>
                    <label for="damages">Estimated Damages ($)</label>
                    <md-input name="damages" id="damages" v-model="form3.damages" :disabled="sending" />
                  </md-field>
                </div>
              </div>
              <div class="md-layout md-gutter">
                <div class="md-layout-item md-size-50">
                  <md-field>
                    <label for="agentName">Insurance Agent's Name</label>
                    <md-input name="agentName" id="agentName" v-model="form3.agentName" :disabled="sending" />
                  </md-field>
                </div>
                <div class="md-layout-item md-size-50">
                  <md-field>
                    <label for="owner">Owner</label>
                    <md-input name="owner" id="owner" v-model="form3.owner" :disabled="sending" />
                  </md-field>
                </div>
              </div>
              <div class="md-layout md-gutter">
                <div class="md-layout-item md-size-100">
                  <md-field>
                    <label for="notes">Notes</label>
                    <md-textarea class="md-textarea" name="notes" id="notes" v-model="form3.notes" :disabled="sending"></md-textarea>
                  </md-field>
                </div>
              </div>
            </div>

            <div v-if="showIN">
              <div class="md-layout md-gutter">
                <div class="md-layout-item md-size-66">
                  <md-field>
                    <label for="inspectorName">Inspector's Name</label>
                    <md-input name="inspectorName" id="inspectorName" v-model="form4.inspectorName" :disabled="sending" />
                  </md-field>
                </div>
                <div class="md-layout-item md-size-33">
                  <md-field>
                    <label for="value">House's Value ($)</label>
                    <md-input name="value" id="value" v-model="form4.value" :disabled="sending" />
                  </md-field>
                </div>
              </div>
              <div class="md-layout md-gutter">
                <div class="md-layout-item md-size-100">
                  <md-field>
                    <label for="notes">Notes</label>
                    <md-textarea class="md-textarea" name="notes" id="notes" v-model="form4.notes" :disabled="sending"></md-textarea>
                  </md-field>
                </div>
              </div>
            </div>

            <div v-if="showHO">
              <div class="md-layout md-gutter">
                <div class="md-layout-item md-size-50">
                  <md-field>
                    <label for="owner">Owner</label>
                    <md-input name="owner" id="owner" v-model="form5.owner" :disabled="sending" />
                  </md-field>
                </div>
                <div class="md-layout-item md-size-50">
                  <md-field>
                    <label for="valueAdded">Value Added to House ($)</label>
                    <md-input name="valueAdded" id="valueAdded" v-model="form5.valueAdded" :disabled="sending" />
                  </md-field>
                </div>
              </div>
              <div class="md-layout md-gutter">
                <div class="md-layout-item md-size-100">
                  <md-field>
                    <label for="improvement">Improvement made</label>
                    <md-input name="improvement" id="improvement" v-model="form5.improvement" :disabled="sending" />
                  </md-field>
                </div>
              </div>
              <div class="md-layout md-gutter">
                <div class="md-layout-item md-size-100">
                  <md-field>
                    <label for="notes">Notes</label>
                    <md-textarea class="md-textarea" name="notes" id="notes" v-model="form5.notes" :disabled="sending"></md-textarea>
                  </md-field>
                </div>
              </div>
            </div>

          </md-card-content>

          <md-progress-bar class="md-accent" md-mode="indeterminate" v-if="sending"/>

          <md-card-actions>
            <md-button v-if="showBD" type="submit" class="md-accent md-raised" :disabled="!(form1.addresss && form1.date && form1.builder && form1.lat && form1.lng)"  v-on:click="saveRecord()">Submit</md-button>
            <md-button v-if="showRE" type="submit" class="md-accent md-raised" :disabled="!(form2.addresss && form2.date && form2.previousOwner && form2.newOWner && form2.agentName && form2.price)"  v-on:click="saveRecord()">Submit</md-button>
            <md-button v-if="showIA" type="submit" class="md-accent md-raised" :disabled="!(form3.addresss && form3.date && form3.incident && form3.owner && form3.agentName && form3.damages && form3.notes)"  v-on:click="saveRecord()">Submit</md-button>
            <md-button v-if="showIN" type="submit" class="md-accent md-raised" :disabled="!(form4.addresss && form4.date && form4.inspectorName && form4.value && form4.notes)"  v-on:click="saveRecord()">Submit</md-button>
            <md-button v-if="showHO" type="submit" class="md-accent md-raised" :disabled="!(form5.addresss && form5.date && form5.owner && form5.improvement && form5.valueAdded && form5.notes)"  v-on:click="saveRecord()">Submit</md-button>
          </md-card-actions>
        </md-card>

          <md-snackbar :md-active.sync="recordSaved">The transaction was Posted, sign with your wallet now!!!</md-snackbar>
          <md-snackbar :md-active.sync="recordSigned">The transaction was Signed, Congratulations!!!</md-snackbar>
          <md-snackbar :md-active.sync="noWalletLogged">Please click the wallet button on the top right corner to login!!!</md-snackbar>

      </div>
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
    if (!localStorage.getItem('role')) {
      this.showWarning = true
      return
    }
    this.changePost(localStorage.getItem('role'))

    let self = this

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
        }
      })
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
    showBD: false,
    showRE: false,
    showIA: false,
    showIN: false,
    showHO: false,
    showWarning: true,

    form1: {
      lat: null,
      lng: null,
      date: null,
      assetId: 10,
      builder: null,
      addresss: null,


    },

    form2: {
      addresss: null,
      previousOwner: null,
      newOwner: null,
      agentName: null,
      price: null,
      date: null
    },

    form3: {
      addresss: null,
      incident: null,
      owner: null,
      agentName: null,
      damages: null,
      date: null,
      notes: null
    },

    form4: {
      addresss: null,
      inspectorName: null,
      value: null,
      date: null,
      notes: null
    },

    form5: {
      addresss: null,
      owner: null,
      improvement: null,
      valueAdded: null,
      date: null,
      notes: null
    }

  }),
  methods: {
    getCurrentWallet () {
      this.unlockWallet()
    },

    set (address) {
      let self = this
      self.form1.addresss = address
      var geocoder = new google.maps.Geocoder()
      geocoder.geocode( { 'address': address}, function(results, status) {
        if (status == 'OK') {
          var lat = results[0].geometry.viewport.na
          var lng = results[0].geometry.viewport.ga
          self.form1.lat = (lat.j + lat.l) / 2
          self.form1.lng = (lat.j + lat.l) / 2
        } else {
          console.log('Geocode was not successful for the following reason: ' + status);
        }
      })
    },

    unlockWallet () {
      try {
        let mnemonic = this.getWallet()
        this.sendTxn(mnemonic)
      } catch (e) {
        console.log(e)
      }
    },
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
    changePost (post) {
      switch (post) {
        case 'bd':
          this.showBD = true
          this.showRE = false
          this.showIA = false
          this.showIN = false
          this.showHO = false
          this.showWarning = false
          break
        case 're':
          this.showBD = false
          this.showRE = true
          this.showIA = false
          this.showIN = false
          this.showHO = false
          this.showWarning = false
          break
        case 'ia':
          this.showBD = false
          this.showRE = false
          this.showIA = true
          this.showIN = false
          this.showHO = false
          this.showWarning = false
          break
        case 'in':
          this.showBD = false
          this.showRE = false
          this.showIA = false
          this.showIN = true
          this.showHO = false
          this.showWarning = false
          break
        case 'ho':
          this.showBD = false
          this.showRE = false
          this.showIA = false
          this.showIN = false
          this.showHO = true
          this.showWarning = false
          break
      }
    },
    clearForm () {
      this.form1.addresss = null
      this.form1.builder = null
      this.form1.date = null
      this.form1.lat = null
      this.form1.lng = null
      this.form2.addresss = null
      this.form2.previousOwner = null
      this.form2.newOWner = null
      this.form2.agentName = null
      this.form2.price = null
      this.form2.date = null
      this.form3.addresss = null
      this.form3.incident = null
      this.form3.owner = null
      this.form3.agentName = null
      this.form3.damages = null
      this.form3.date = null
      this.form3.notes = null
      this.form4.addresss = null
      this.form4.inspectorName = null
      this.form4.value = null
      this.form4.date = null
      this.form4.notes = null
      this.form5.addresss = null
      this.form5.owner = null
      this.form5.improvement = null
      this.form5.valueAdded = null
      this.form5.date = null
      this.form5.notes = null
    },
    saveRecord (e) {
      if (!this.getWallet()) {
        this.noWalletLogged = true
        return
      }
      this.sending = true

      let bodyFormData = new FormData()
      bodyFormData.append('from', this.getAddress())

      let method = null

      if (this.showBD) {
        method = 'new_house'
        for (let k in this.form1) {
          if (this.form1.hasOwnProperty(k)) {
            bodyFormData.append(k, this.form1[k])
          }
        }
      } else if (this.showRE) {
        method = 'houseSale'
        for (let k in this.form2) {
          if (this.form2.hasOwnProperty(k)) {
            bodyFormData.append(k, this.form2[k])
          }
        }
      } else if (this.showIA) {
        method = 'accident'
        for (let k in this.form3) {
          if (this.form3.hasOwnProperty(k)) {
            bodyFormData.append(k, this.form3[k])
          }
        }
      } else if (this.showIN) {
        method = 'appraisal'
        for (let k in this.form4) {
          if (this.form4.hasOwnProperty(k)) {
            bodyFormData.append(k, this.form4[k])
          }
        }
      } else {
        method = 'improvement'
        for (let k in this.form5) {
          if (this.form5.hasOwnProperty(k)) {
            bodyFormData.append(k, this.form5[k])
          }
        }
      }

      console.log(bodyFormData)
      let self = this
      try {
        simbaApi.postData(method + '/', bodyFormData).then(function (res) {
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
  .my-card {
    margin-top: 40px;
    width: 300px;
    display: inline-block;
    vertical-align: top;
    margin-bottom: 20px;
  }
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
  .options {
    margin-top: 40px;
  }
  .wallet {
    min-width: 320px;
  }
  .wallet-content {
    margin: 20px;
  }
</style>
