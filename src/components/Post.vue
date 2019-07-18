<template>
  <div>
    <div v-if="loggedIn">
      <div>
        <b-card class="col-xl-9 col-lg-10 col-md-11 col-sm-12 col-12 post-card" bg-variant="light" v-if="showIN" title="Choose which form you would like to submit">
          <b-form-group>
            <b-form-radio-group buttons button-variant="outline-primary">
              <b-form-radio v-model="reno" :value="false">Inspection</b-form-radio>
              <b-form-radio v-model="reno" :value="true">Home Improvement</b-form-radio>
            </b-form-radio-group>
          </b-form-group>
        </b-card>
        <b-card bg-variant="light" class="col-xl-9 col-lg-10 col-md-11 col-sm-12 col-12 post-card" :title="title" :sub-title="subtitle" v-if="!reno">
          <p>Don't see the address you're looking for? Make sure to register the home first!</p>
          <div class="row">
            <div class="col-12 col-md-6 col-lg-9">
              <b-form-group description="Address">
                <b-form-input name="address" id="address" v-model="address" :disabled="sending" placeholder="Address" v-on:keyup="visible = true"/>
                <div class="options" v-if="visible">
                  <ul>
                    <li v-for="(match, index) in matches" :key="index" v-text="match" @click="itemClicked(index)"></li>
                  </ul>
                </div>
              </b-form-group>
            </div>
            <div class="col-12 col-md-6 col-lg-3">
              <b-form-group description="Date">
                <b-form-input type="date" name="date" id="date" v-model="date" :disabled="sending"/>
              </b-form-group>
            </div>
          </div>

          <div v-if="showRE">
            <div class="row">
              <div class="col-sm-6 col-12">
                <b-form-group description="Previous Owner">
                  <b-form-input name="prev_owner" id="prev_owner" v-model="form2.prev_owner" :disabled="sending" />
                </b-form-group>
              </div>
              <div class="col-sm-6 col-12">
                <b-form-group description="New Owner">
                  <b-form-input name="new_owner" id="new_owner" v-model="form2.new_owner" :disabled="sending" />
                </b-form-group>
              </div>
            </div>
            <div class="row">
              <div class="col-sm-6 col-12">
                <b-form-group description="Real Estate Agent's Name">
                  <b-form-input name="real_estate_agent" id="real_estate_agent" v-model="form2.real_estate_agent" :disabled="sending" />
                </b-form-group>
              </div>
              <div class="col-sm-6 col-12">
                <b-form-group description="Price">
                  <div class="input-group mb-3">
                    <div class="input-group-prepend">
                      <span class="input-group-text">$</span>
                    </div>
                    <b-form-input type="number" name="price" id="price" v-model="form2.price" :disabled="sending"/>
                  </div>
                </b-form-group>
              </div>
            </div>
          </div>

          <div v-if="showIA">
            <div class="row">
              <div class="col-12 col-md-6 col-lg-8">
                <b-form-group description="Type of Incident">
                  <b-form-input name="incident" id="incident" v-model="form3.incident" :disabled="sending" />
                </b-form-group>
              </div>
              <div class="col-12 col-md-6 col-lg-4">
                <b-form-group description="Estimated Damages ($)">
                  <div class="input-group mb-3">
                    <div class="input-group-prepend">
                      <span class="input-group-text">$</span>
                    </div>
                    <b-form-input type="number" name="estimated_damages" id="estimated_damages" v-model="form3.estimated_damages" :disabled="sending" />
                  </div>
                </b-form-group>
              </div>
            </div>
            <div class="row">
              <div class="col-12 col-sm-6">
                <b-form-group description="Insurance Agent's Name">
                  <b-form-input name="insurance_agent" id="insurance_agent" v-model="form3.insurance_agent" :disabled="sending" />
                </b-form-group>
              </div>
              <div class="col-12 col-sm-6">
                <b-form-group description="Owner">
                  <b-form-input name="owner" id="owner" v-model="form3.owner" :disabled="sending" />
                </b-form-group>
              </div>
            </div>
            <div class="row">
              <div class="col-12">
                <b-form-group description="Notes">
                  <b-form-textarea class="md-textarea" name="notes" id="notes" v-model="form3.notes" :disabled="sending"></b-form-textarea>
                </b-form-group>
              </div>
            </div>
          </div>

          <div v-if="showIN">
            <div class="row">
              <div class="col-12 col-md-6 col-lg-8">
                <b-form-group description="Inspector's Name">
                  <b-form-input name="inspector" id="inspector" v-model="form4.inspector" :disabled="sending" />
                </b-form-group>
              </div>
              <div class=" col-12 col-md-6 col-lg-4">
                <b-form-group description="House's Value">
                  <div class="input-group mb-3">
                    <div class="input-group-prepend">
                      <span class="input-group-text">$</span>
                    </div>
                    <b-form-input type="number" name="value" id="value" v-model="form4.value" :disabled="sending" />
                  </div>
                </b-form-group>
              </div>
            </div>
            <div class="row">
              <div class="col-12">
                <b-form-group description="Notes">
                  <b-form-textarea class="md-textarea" name="notes" id="notes" v-model="form4.notes" :disabled="sending"></b-form-textarea>
                </b-form-group>
              </div>
            </div>
          </div>

          <b-button v-if="showRE && !(address && date && form2.prev_owner && form2.new_owner && form2.real_estate_agent && form2.price)" variant="outline-success" disabled>Submit</b-button>
          <b-button v-if="showIA && !(address && date && form3.incident && form3.owner && form3.insurance_agent && form3.estimated_damages && form3.notes)" variant="outline-success" disabled>Submit</b-button>
          <b-button v-if="showIN && !(address && date && form4.inspector && form4.value && form4.notes)" variant="outline-success" disabled>Submit</b-button>
          <b-button v-if="showRE && (address && date && form2.prev_owner && form2.new_owner && form2.real_estate_agent && form2.price)" variant="success" v-on:click="check()">Submit</b-button>
          <b-button v-if="showIA && (address && date && form3.incident && form3.owner && form3.insurance_agent && form3.estimated_damages && form3.notes)" variant="success" v-on:click="check()">Submit</b-button>
          <b-button v-if="showIN && (address && date && form4.inspector && form4.value && form4.notes)" variant="success" v-on:click="check()">Submit</b-button>

          &nbsp; &nbsp; <b-spinner variant="primary" v-if="sending" label="Loading..."></b-spinner>
        </b-card>
        <b-card v-if="showIN && reno" bg-variant="light" title="Renovation" sub-title="Inspector/Government Assesor" class="col-xl-9 col-lg-10 col-md-11 col-sm-12 col-12 post-card">
          <div>
            <p>Don't see the address you're looking for? Make sure to register the home first!</p>
            <div class="row">
              <div class="col-12 col-md-6 col-lg-9">
                <b-form-group description="Address">
                  <b-form-input name="address" id="address" v-model="address" :disabled="sending" placeholder="Address" v-on:keyup="visible = true"/>
                  <div class="options" v-if="visible">
                    <ul>
                      <li v-for="(match, index) in matches" :key="index" v-text="match" @click="itemClicked(index)"></li>
                    </ul>
                  </div>
                </b-form-group>
              </div>
              <div class="col-12 col-md-6 col-lg-3">
                <b-form-group description="Date">
                  <b-form-input type="date" name="date" id="date" v-model="date" :disabled="sending"/>
                </b-form-group>
              </div>
            </div>
            <div class="row">
              <div class="col-12 col-sm-6">
                <b-form-group description="Type of Improvement">
                  <b-form-input name="improvement" id="improvement" v-model="form5.improvement" :disabled="sending"/>
                </b-form-group>
              </div>
              <div class="col-12 col-sm-6">
                <b-form-group description="Value Added to House">
                  <div class="input-group mb-3">
                    <div class="input-group-prepend">
                      <span class="input-group-text">$</span>
                    </div>
                    <b-form-input type="number" name="value_added" id="value_added" v-model="form5.value_added" :disabled="sending" />
                  </div>
                </b-form-group>
              </div>
            </div>
            <div class="row">
              <div class="col-12 col-sm-6">
                <b-form-group description="# of Bedrooms">
                  <b-form-input name="bedrooms" id="bedrooms" v-model="form5.bedrooms" :disabled="sending" />
                </b-form-group>
              </div>
              <div class="col-12 col-sm-6">
                <b-form-group description="# of Bathrooms">
                  <b-form-input name="bathrooms" id="bathrooms" v-model="form5.bathrooms" :disabled="sending" />
                </b-form-group>
              </div>
            </div>
            <div class="row">
              <div class="col-12 col-sm-6">
                <b-form-group description="Sqaure Footage">
                  <b-form-input name="area" id="area" v-model="form5.area" :disabled="sending" />
                </b-form-group>
              </div>
              <div class="col-12 col-sm-6">
                <b-form-group description="# Acres on Lot">
                  <b-form-input name="acres" id="acres" v-model="form5.acres" :disabled="sending" />
                </b-form-group>
              </div>
            </div>
            <div class="row">
              <div class="col-12">
                <b-form-group description="Notes/Description">
                  <b-form-textarea class="md-textarea" name="notes" id="notes" v-model="form5.notes" :disabled="sending"></b-form-textarea>
                </b-form-group>
              </div>
            </div>
          </div>
          <b-button v-if="renovation" type="submit" variant="success" v-on:click="check()">Submit</b-button>
          <b-button v-if="!renovation" variant="outline-success" disabled>Submit</b-button>
        </b-card>
      </div>
    </div>
    <div class="text-center post-card" v-if="!loggedIn">
      <img style="height: 70px;" src="./icons/warning.svg" alt="warning">
        <h4>You must be logged in to access this page</h4>
      <div class="text-center"><b-button variant="dark" to="/">Home</b-button> &nbsp; &nbsp; <b-button variant="dark" to="/account/login">Log In</b-button></div>
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
    this.changePost(localStorage.getItem('role'))
    this.loggedIn = this.$parent.loggedIn

    // Get current houses
    this.getHouses()
  },
  mixins: [localstorage],

  data: () => ({
    sending: false,
    txnId: null,
    unsignedTxn: null,
    showRE: false,
    showIA: false,
    showIN: false,
    date: null,
    houses: [],
    ids: [],
    dates: [],
    address: null,
    loggedIn: false,
    title: null,
    subtitle: null,
    visible: true,
    reno: false,

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
      improvement: null,
      value_added: null,
      date: null,
      notes: null,
      bedrooms: null,
      bathrooms: null,
      area: null,
      acres: null
    }

  }),
  methods: {
    // the following method is used for the autocomplete address search bar
    // thanks to AfikDeri for help with the autocomplete
    // https://github.com/AfikDeri/VueJS-Autocomplete
    itemClicked (index) {
      this.address = this.matches[index]
      this.visible = !this.visible
    },

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
    // makes all numbers positive and integers
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
            self.form2.price = Math.abs(Math.round(self.form2.price))
          } else if (self.showIA) {
            self.form3.assetId = self.ids[spot]
            self.form3.estimated_damages = Math.abs(Math.round(self.form3.estimated_damages))
          } else if (self.showIN && !self.renovation) {
            self.form4.assetId = self.ids[spot]
            self.form4.value = Math.abs(Math.round(self.form4.value))
          } else {
            self.form5.assetId = self.ids[spot]
            self.form5.value_added = Math.abs(Math.round(self.form5.value_added))
          }
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
          self.$parent.makeToast('The transaction was signed, congratulations!!!', 'success', 'Add Records')
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
          this.title = 'Log a Sold House'
          this.subtitle = 'Real Estate Agent'
          break
        case 'ia':
          this.showRE = false
          this.showIA = true
          this.showIN = false
          this.title = 'File An Accident'
          this.subtitle = 'Insurance Agent'
          break
        case 'in':
          this.showRE = false
          this.showIA = false
          this.showIN = true
          this.title = 'File An Inspection/Appraisal'
          this.subtitle = 'Inspector/Government Assesor'
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
      this.form5.improvement = null
      this.form5.value_added = null
      this.form5.notes = null
      this.form5.bedrooms = null
      this.form5.bathrooms = null
      this.form5.area = null
      this.form5.acres = null
      this.date = null
      this.address = null
    },

    // posts all the data to Simba Chain
    saveRecord (e) {
      if (!this.getWallet()) {
        this.$parent.makeToast('Please click the wallet button on the top right corner to login!!!', 'danger', 'Ethereum Wallet')
        return
      }
      this.sending = true

      let bodyFormData = new FormData()
      bodyFormData.append('from', this.getAddress())

      let method = null
      this.date = new Date(this.date)
      this.date = this.date.toString().substring(4,10) + ',' + this.date.toString().substring(10,15)

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
      } else if (this.showIN && !this.renovation) {
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
          self.$parent.makeToast('The transaction was posted!!!', 'success', 'Add Records')
          self.sending = false
          self.clearForm()
        })
      } catch (e) {
        console.log(e)
      }
    }
  },

  computed: {
    matches: function () {
      if (this.address === null) {
        return []
      } else {
        return this.houses.filter((item) => item.toLowerCase().includes(this.address.toLowerCase()))
      }
    },

    renovation: function () {
      if (this.address && this.date && this.form5.bedrooms && this.form5.improvement && this.form5.value_added && this.form5.notes && this.form5.bathrooms && this.form5.area && this.form5.acres) {
        return true
      } else {
        return false
      }
    }
  }
}

</script>

<style scoped>
  .post-card {
    margin: 10px;
  }
  /* the following styling is for autocomplete
  See note at top of methods */
  .options {
      max-height: 150px;
      overflow-y: scroll;
      margin-top: 5px;
  }
  .options ul {
      list-style-type: none;
      text-align: left;
      padding-left: 0;
  }
  .options ul li {
      border-bottom: 1px solid lightgray;
      padding: 10px;
      cursor: pointer;
      background: #f1f1f1;
  }
  .options ul li:first-child {
      border-top: 2px solid #d6d6d6;
  }
  .options ul li:not(.selected):hover {
      background: #8c8c8c;
      color: #fff;
  }
  .options ul li.selected {
      background: #58bd4c;
      color: #fff;
      font-weight: 600;
  }
</style>
