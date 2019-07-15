<template>
  <div>
    <div v-if="loggedIn && role == 'ho'">
      <b-card class="col-xl-9 col-lg-10 col-md-11 col-sm-12 col-12 post-card" title="Claim Your House" v-if="currentClaim == 0" bg-variant="light">
        <h5>Make sure to enter a valid address</h5>
        <h6><br>Don't see the address you're looking for? Make sure to register the home first!</h6>
        <div class="row">
          <div class="col-12">
            <b-form-group description="Address">
              <b-form-input name="address" id="address" v-model="claim.addresss" :disabled="sending" placeholder="Address" v-on:keyup="toggleVisible()"/>
              <div class="options" v-if="visible">
                <ul>
                  <li v-for="(match, index) in matches" :key="index" v-text="match" @click="itemClicked(index)"></li>
                </ul>
              </div>
            </b-form-group>
          </div>
        </div>

        <b-button type="submit" v-if="!(claim.addresss)" variant="outline-success" disabled>Submit</b-button>
        <b-button type="submit" v-if="claim.addresss" variant="success" v-on:click="check()">Submit</b-button>
        &nbsp; &nbsp; <b-spinner variant="primary" v-if="sending" label="Loading..."></b-spinner>
      </b-card>

      <b-card v-if='currentClaim' class="post-card" bg-variant="light" title="'Un-claim' Your House" style="text-align: center;">
        <p>{{ unclaim.addresss }}
        <h5>No longer own this house?</h5>
        <h6><br>Unclaim it now so you can claim your new house!</h6>

        <b-button type="submit" variant="success" v-on:click="saveRecord()">Un-Claim</b-button>
        &nbsp; &nbsp; <b-spinner variant="primary" v-if="sending" label="Loading..."></b-spinner>
      </b-card>
    </div>

    <div id="denied" v-if="!loggedIn || !(role == 'ho')">
      <img style="height: 70px;" src="./icons/warning.svg" alt="warning">
      <h4>You must be logged in as a home owner to access this page</h4>
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
  mounted () {
    this.claim.assetId = localStorage.getItem('assetId')
    this.unclaim.assetId = localStorage.getItem('assetId')
    this.loggedIn = this.$parent.loggedIn
    this.role = this.$parent.accountInfo.role

    // Get current houses
    this.getHouses()
    this.checkClaims()
  },

  mixins: [localstorage],

  data () {
    return {
      sending: false,
      txnId: null,
      unsignedTxn: null,
      houses: [],
      ids: [],
      address: null,
      loggedIn: false,
      currentClaim: null,
      role: null,
      visible: true,

      claim: {
        assetId: null,
        addresss: '',
        house_assetId: null,
        active: 1
      },

      unclaim: {
        assetId: null,
        addresss: null,
        house_assetId: null,
        active: 0

      }
    }
  },
  methods: {
    // the following two methods are used for the autocomplete address search bar
    // thanks to AfikDeri for help with the autocomplete
    // https://github.com/AfikDeri/VueJS-Autocomplete
    toggleVisible () {
      this.visible = true
    },

    itemClicked (index) {
      this.claim.addresss = this.matches[index]
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
            }
          })
      } catch (e) {
        console.log(e)
      }
    },

    checkClaims () {
      let self = this
      let url = 'claim/?assetId_exact=' + this.claim.assetId
      try {
        simbaApi.getData(url)
          .then(function (response) {
            if (response.data.count != 0) {
              let result = response.data.results[0].payload.inputs
              if (result.active == 1) {
                self.currentClaim = 1
                self.unclaim.addresss = result.addresss
                self.unclaim.house_assetId = result.house_assetId
              } else {
                self.currentClaim = 0
              }
            } else {
              self.currentClaim = 0
            }
          })
      } catch (e) {
        console.log(e)
      }
    },

    // checks to make sure address entered is a resgistered address. Also checks for an acceptable date.
    check () {
      let self = this
      if (self.houses.includes(this.claim.addresss)) {
        var spot = self.houses.indexOf(self.claim.addresss)
        self.claim.house_assetId = self.ids[spot]
        self.saveRecord()
      } else {
        self.claim.addresss = ''
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
          self.$parent.makeToast('The transaction was signed, congratulations!!!', 'success', 'Claim')
          self.isSigning = false
        })
      } catch (e) {
        console.log(e)
      }
    },

    // clears all form fields
    clearForm () {
      this.address = null
      this.claim.addresss = null
      this.claim.house_assetId = null
      this.unclaim.addresss = null
      this.unclaim.house_assetId = null
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

      let method = 'claim'

      if (this. currentClaim) {
        for (let k in this.unclaim) {
          if (this.unclaim.hasOwnProperty(k)) {
            bodyFormData.append(k, this.unclaim[k])
          }
        }
      } else {
        for (let k in this.claim) {
          if (this.claim.hasOwnProperty(k)) {
            bodyFormData.append(k, this.claim[k])
          }
        }
      }

      let self = this
      try {
        simbaApi.postData(method + '/', bodyFormData).then(function (res) {
          self.txnId = res.data.id
          self.unsignedTxn = res.data.payload.raw
          self.getCurrentWallet()
          self.$parent.makeToast('The transaction was posted!!!', 'success', 'Claim')
          self.sending = false
          self.clearForm()
          self.currentClaim = !self.currentClaim
        })
      } catch (e) {
        console.log(e)
      }
    }
  },

  computed: {
    matches () {
      if (this.claim.addresss == '') {
        return []
      }
      return this.houses.filter((item) => item.toLowerCase().includes(this.claim.addresss.toLowerCase()))
    }
  }
}

</script>

<style scoped>
  .post-card {
    margin: 10px;
  }
  #denied {
    text-align: center;
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
