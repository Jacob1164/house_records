<template>
  <div>
    <div v-if="loggedIn && role == 'ho'" class="post-form">
      <md-card class="md-layout-item md-size-90 md-large-size-80 md-medium-size-100 md-small-size-100 md-xsmall-size-100" v-if="currentClaim == 0">
        <md-card-header>
          <div class="title">Claim Your House</div>
        </md-card-header>

        <md-card-content class="post-card">
          <div class="md-layout-item md-size-100">
            <strong style="color:#64dd17;">Make sure to enter a valid address</strong>
          </div>
          <div class="md-body-2"><br>Don't see the address you're looking for? Make sure to register the home first!</div>
          <div class="md-layout md-gutter">
            <div class="md-layout-item md-size-100">
              <md-autocomplete name="address" id="address" v-model="address" :disabled="sending" :md-options="houses" md-dense><label>Search for a registered address</label></md-autocomplete>
            </div>
          </div>
        </md-card-content>

        <md-progress-bar class="md-accent md-progress-bar" md-mode="indeterminate" v-if="sending"/>

        <md-card-actions>
          <md-button type="submit" class="md-accent md-raised" :disabled="!(address)"  v-on:click="check()">Submit</md-button>
        </md-card-actions>
      </md-card>

      <md-card v-if='currentClaim' style="text-align: center;">
        <md-card-header>
          <div class="title">"Un-claim" Your House: <strong>{{ unclaim.addresss }}</strong></div>
        </md-card-header>

        <md-card-content class="post-card">
          <div class="md-layout-item md-size-100">
            <strong style="color:#64dd17;">No longer own this house?</strong>
          </div>
          <div class="md-body-2"><br>Unclaim it now so you can claim your new house!</div>
        </md-card-content>

        <md-button type="submit" class="md-accent md-raised" v-on:click="saveRecord()">Un-Claim</md-button>
        <md-progress-bar class="md-accent md-progress-bar" md-mode="indeterminate" v-if="sending"/>
      </md-card>

      <md-snackbar :md-active.sync="recordSaved">The transaction was Posted, sign with your wallet now!!!</md-snackbar>
      <md-snackbar :md-active.sync="recordSigned">The transaction was Signed, Congratulations!!!</md-snackbar>
      <md-snackbar :md-active.sync="noWalletLogged">Please click the wallet button on the top right corner to login!!!</md-snackbar>
    </div>

    <div id="denied" v-if="!loggedIn || !(role == 'ho')">
      <md-icon class="md-size-3x">warning</md-icon>
      <div class="md-title">You must be logged in as a home owner to access this page</div>
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
    this.claim.assetId = localStorage.getItem('assetId')
    this.unclaim.assetId = localStorage.getItem('assetId')
    this.loggedIn = parent.loggedIn
    this.role = parent.accountInfo.role

    // Get current houses
    this.getHouses()
    this.checkClaims()
  },
  mixins: [localstorage],

  data: () => ({
    sending: false,
    recordSaved: false,
    recordSigned: false,
    noWalletLogged: false,
    txnId: null,
    unsignedTxn: null,
    houses: [],
    ids: [],
    address: null,
    loggedIn: false,
    currentClaim: null,
    role: null,

    claim: {
      assetId: null,
      addresss: null,
      house_assetId: null,
      active: 1
    },

    unclaim: {
      assetId: null,
      addresss: null,
      house_assetId: null,
      active: 0

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
            let result = response.data.results[0].payload.inputs
            if (result.active == 1) {
              self.currentClaim = 1
              self.unclaim.addresss = result.addresss
              self.unclaim.house_assetId = result.house_assetId
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
      if (self.houses.includes(this.address)) {
        var spot = self.houses.indexOf(self.address)
        self.claim.house_assetId = self.ids[spot]
        self.claim.addresss = self.address
        self.saveRecord()
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
        this.noWalletLogged = true
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
          self.recordSaved = true
          self.sending = false
          self.clearForm()
          self.currentClaim = !self.currentClaim
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
