<template>
  <div>
    <div v-if="loggedIn">
      <div class="post-form">
        <md-card class="md-layout-item md-size-90 md-large-size-80 md-medium-size-100 md-small-size-100 md-xsmall-size-100">
          <md-card-header>
            <div v-if="showRE" class="title">Real Estate Agent</div>
            <div v-if="showIA" class="title">Insurance Agent</div>
            <div v-if="showIN" class="title">Inspector</div>
            <div v-if="showHO" class="title">House Owner</div>
          </md-card-header>

          <md-card-content class="post-card">
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
              <div class="md-body-2"><br>Don't see the address you're looking for? Make sure to register the home first!</div>
            <div class="md-layout md-gutter">
              <div class="md-layout-item md-size-80">
                <md-autocomplete name="address" id="address" v-model="address" :disabled="sending" :md-options="houses" md-dense><label>Search for a registered address</label></md-autocomplete>
              </div>
              <div class="md-layout-item md-size-20">
                <md-datepicker name="date" id="date" v-model="date" :disabled="sending" md-immediately/>
              </div>
            </div>

            <div v-if="showRE">
              <div class="md-layout md-gutter">
                <div class="md-layout-item md-size-50">
                  <md-field>
                    <label for="prev_owner">Previous Owner</label>
                    <md-input name="prev_owner" id="prev_owner" v-model="form2.prev_owner" :disabled="sending" />
                  </md-field>
                </div>
                <div class="md-layout-item md-size-50">
                  <md-field>
                    <label for="new_owner">New Owner</label>
                    <md-input name="new_owner" id="new_owner" v-model="form2.new_owner" :disabled="sending" />
                  </md-field>
                </div>
              </div>
              <div class="md-layout md-gutter">
                <div class="md-layout-item md-size-50">
                  <md-field>
                    <label for="real_estate_agent">Real Estate Agent's Name</label>
                    <md-input name="real_estate_agent" id="real_estate_agent" v-model="form2.real_estate_agent" :disabled="sending" />
                  </md-field>
                </div>
                <div class="md-layout-item md-size-50">
                  <md-field>
                    <label for="price">Price</label>
                    <span class="md-prefix">$</span>
                    <md-input type="number" name="price" id="price" v-model="form2.price" :disabled="sending" />
                  </md-field>
                </div>
              </div>
            </div>

            <div v-if="showIA">
              <div class="md-layout md-gutter">
                <div class="md-layout-item md-size-66">
                  <md-field>
                    <label for="incident">Type of Incident {{ $parent.number }}</label>
                    <md-input name="incident" id="incident" v-model="form3.incident" :disabled="sending" />
                  </md-field>
                </div>
                <div class="md-layout-item md-size-33">
                  <md-field>
                    <label for="estimated_damages">Estimated Damages ($)</label>
                    <span class="md-prefix">$</span>
                    <md-input type="number" name="estimated_damages" id="estimated_damages" v-model="form3.estimated_damages" :disabled="sending" />
                  </md-field>
                </div>
              </div>
              <div class="md-layout md-gutter">
                <div class="md-layout-item md-size-50">
                  <md-field>
                    <label for="insurance_agent">Insurance Agent's Name</label>
                    <md-input name="insurance_agent" id="insurance_agent" v-model="form3.insurance_agent" :disabled="sending" />
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
                    <label for="inspector">Inspector's Name</label>
                    <md-input name="inspector" id="inspector" v-model="form4.inspector" :disabled="sending" />
                  </md-field>
                </div>
                <div class="md-layout-item md-size-33">
                  <md-field>
                    <label for="value">House's Value ($)</label>
                    <span class="md-prefix">$</span>
                    <md-input type="number" name="value" id="value" v-model="form4.value" :disabled="sending" />
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
                    <label for="value_added">Value Added to House ($)</label>
                    <span class="md-prefix">$</span>
                    <md-input type="number" name="value_added" id="value_added" v-model="form5.value_added" :disabled="sending" />
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

          <md-progress-bar class="md-accent md-progress-bar" md-mode="indeterminate" v-if="sending"/>

          <md-card-actions>
            <md-button v-if="showRE" type="submit" class="md-accent md-raised" :disabled="!(address && date && form2.prev_owner && form2.new_owner && form2.real_estate_agent && form2.price)"  v-on:click="check()">Submit</md-button>
            <md-button v-if="showIA" type="submit" class="md-accent md-raised" :disabled="!(address && date && form3.incident && form3.owner && form3.insurance_agent && form3.estimated_damages && form3.notes)"  v-on:click="check()">Submit</md-button>
            <md-button v-if="showIN" type="submit" class="md-accent md-raised" :disabled="!(address && date && form4.inspector && form4.value && form4.notes)"  v-on:click="check()">Submit</md-button>
            <md-button v-if="showHO" type="submit" class="md-accent md-raised" :disabled="!(address && date && form5.owner && form5.improvement && form5.value_added && form5.notes)"  v-on:click="check()">Submit</md-button>
          </md-card-actions>
        </md-card>
          <md-snackbar :md-active.sync="recordSaved">The transaction was Posted, sign with your wallet now!!!</md-snackbar>
          <md-snackbar :md-active.sync="recordSigned">The transaction was Signed, Congratulations!!!</md-snackbar>
          <md-snackbar :md-active.sync="noWalletLogged">Please click the wallet button on the top right corner to login!!!</md-snackbar>

      </div>
    </div>
    <div id="denied" v-if="!loggedIn">
      <md-icon class="md-size-3x">warning</md-icon>
      <div class="md-title">You must be logged in to access this page</div>
      <div><md-button class="md-primary md-raised" to="/">Home</md-button>  <md-button class="md-primary md-raised" to="/account/login">Log In</md-button></div>
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
    let parent = this.$parent.$parent.$parent.$parent
    this.changePost(localStorage.getItem('role'))
    this.loggedIn = parent.loggedIn

    // Get current houses
    this.getHouses()
  },
  mixins: [localstorage],

  data: () => ({
    sending: false,
    recordSaved: false,
    recordSigned: false,
    noWalletLogged: false,
    txnId: null,
    unsignedTxn: null,
    showRE: false,
    showIA: false,
    showIN: false,
    showHO: false,
    date: null,
    houses: [],
    ids: [],
    dates: [],
    address: null,
    loggedIn: false,

    form2: {
      addresss: null,
      prev_owner: null,
      new_owner: null,
      real_estate_agent: null,
      price: null,
      date: null,
      assetId: null
    },

    form3: {
      assetId: null,
      incident: null,
      owner: null,
      insurance_agent: null,
      estimated_damages: null,
      date: null,
      notes: null
    },

    form4: {
      assetId: null,
      inspector: null,
      value: null,
      date: null,
      notes: null
    },

    form5: {
      assetId: null,
      owner: null,
      improvement: null,
      value_added: null,
      date: null,
      notes: null
    }

  }),
  methods: {
    // gets all current houses. Used to populate the autocomplete for all forms except new_house
    getHouses () {
      this.houses = []
      let self = this
      try {
        simbaApi.getData('new_house/?')
          .then(function (response) {
            let results = response.data.results
            for (let i = 0; i < results.length; i++) {
              self.houses.push(results[i].payload.inputs.addresss)
              self.ids.push(results[i].payload.inputs.assetId)
              self.dates.push(results[i].payload.inputs.date)
            }
          })
      } catch (e) {
        console.log(e)
      }
    },

    // checks to make sure address entered is a resgistered address. Also checks for an acceptable date.
    check () {
      let self = this
      if (self.houses.includes(this.address)) {
        var spot = self.houses.indexOf(self.address)
        if ((new Date(self.date) - new Date(self.dates[spot])) < 0 || (new Date() - new Date(self.date)) < 0) {
          window.alert(`Date must be after the date the house was built (${self.dates[spot]}) and can't be in the future.`)
          return
        } else {
          if (self.showRE) {
            self.form2.addresss = self.address
            self.form2.assetId = self.ids[spot]
          } else if (self.showIA) {
            self.form3.assetId = self.ids[spot]
          } else if (self.showIN) {
            self.form4.assetId = self.ids[spot]
          } else if (self.showHO) {
            self.form5.assetId = self.ids[spot]
          }
          self.date = self.date.toString().substring(4,10) + ',' + self.date.toString().substring(10,15)
          self.saveRecord()
        }
      } else {
        self.address = ''
        window.alert("Make sure to enter a registered house! Don't see the house you're looking for? Register it now!")
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

    // changes user type and what form is displayed on screen
    changePost (post) {
      switch (post) {
        case 're':
          this.showRE = true
          this.showIA = false
          this.showIN = false
          this.showHO = false
          break
        case 'ia':
          this.showRE = false
          this.showIA = true
          this.showIN = false
          this.showHO = false
          break
        case 'in':
          this.showRE = false
          this.showIA = false
          this.showIN = true
          this.showHO = false
          break
        case 'ho':
          this.showRE = false
          this.showIA = false
          this.showIN = false
          this.showHO = true
          break
      }
    },

    // clears all form fields
    clearForm () {
      this.form2.addresss = null
      this.form2.prev_owner = null
      this.form2.new_owner = null
      this.form2.real_estate_agent = null
      this.form2.price = null
      this.form3.assetId = null
      this.form3.incident = null
      this.form3.owner = null
      this.form3.insurance_agent = null
      this.form3.estimated_damages = null
      this.form3.notes = null
      this.form4.assetId = null
      this.form4.inspector = null
      this.form4.value = null
      this.form4.notes = null
      this.form5.assetId = null
      this.form5.owner = null
      this.form5.improvement = null
      this.form5.value_added = null
      this.form5.notes = null
      this.date = null
      this.address = null
    },

    // posts all the data to Simba Chain
    saveRecord (e) {
      if (!this.getWallet()) {
        this.noWalletLogged = true
        return
      }
      this.sending = true

      let bodyFormData = new FormData()
      bodyFormData.append('from', this.getAddress())

      let method = null

      if (this.showRE) {
        method = 'house_sale'
        this.form2.date = this.date
        for (let k in this.form2) {
          if (this.form2.hasOwnProperty(k)) {
            bodyFormData.append(k, this.form2[k])
          }
        }
      } else if (this.showIA) {
        method = 'accident'
        this.form3.date = this.date
        for (let k in this.form3) {
          if (this.form3.hasOwnProperty(k)) {
            bodyFormData.append(k, this.form3[k])
          }
        }
      } else if (this.showIN) {
        method = 'appraisal'
        this.form4.date = this.date
        for (let k in this.form4) {
          if (this.form4.hasOwnProperty(k)) {
            bodyFormData.append(k, this.form4[k])
          }
        }
      } else {
        method = 'improvement'
        this.form5.date = this.date
        for (let k in this.form5) {
          if (this.form5.hasOwnProperty(k)) {
            bodyFormData.append(k, this.form5[k])
          }
        }
      }

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
  #denied {
    text-align: center;
  }
</style>
