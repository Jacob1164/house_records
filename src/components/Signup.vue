<template>
  <div>
    <div style="text-align: center;" class="md-layout md-gutter">
      <div class="md-layout-item md-large-size-25 md-medium-size-20 md-small-size-15 md-xsmall-size-5"></div>
      <md-card class="md-raised md-large-size-50 md-medium-size-60 md-small-size-70 md-xsmall-size-90 md-layout-item" id="card1">
        <div class="md-display-1" style="color: white;">Sign Up</div>

        <div class="md-layout md-gutter">
          <div class="md-layout-item md-size-50">
            <md-field>
              <label for="first">First Name</label>
              <md-input name="first" id="first" v-model="data.first" :disabled="sending"/>
            </md-field>
          </div>
          <div class="md-layout-item md-size-50">
            <md-field>
              <label for="last">Last Name</label>
              <md-input name="last" id="last" v-model="data.last" :disabled="sending"/>
            </md-field>
          </div>
        </div>

        <div class="md-layout md-gutter">
          <div class="md-layout-item md-size-100">
            <md-field>
              <label for="email">Email</label>
              <md-input name="email" id="email" v-model="data.email" :disabled="sending"/>
            </md-field>
          </div>
        </div>

        <div class="md-layout md-gutter">
          <div class="md-layout-item md-size-100">
            <md-radio v-model="data.role" value="re" unselected :disabled="sending">Real Estate Agent</md-radio>
            <md-radio v-model="data.role" value="ia" unselected :disabled="sending">Insurance Agent</md-radio>
            <md-radio v-model="data.role" value="in" unselected :disabled="sending">Inspector</md-radio>
            <md-radio v-model="data.role" value="ho" unselected :disabled="sending">Home Owner</md-radio>
          </div>
        </div>
        <div class="md-layout md-gutter">
          <div class="md-layout-item md-size-100">
            <md-field>
              <label for="username">Username</label>
              <md-input name="username" id="username" v-model="data.username" :disabled="sending"/>
            </md-field>
          </div>
        </div>
        <div class="md-layout md-gutter">
          <div class="md-layout-item md-size-100">
            <md-field>
              <label for="password">Password</label>
              <md-input type="password" name="password" id="password" v-model="data.password" :disabled="sending"/>
            </md-field>
          </div>
        </div>
        <md-progress-bar class="md-accent md-progress-bar" md-mode="indeterminate" v-if="sending"/>
        <div>
          <md-button class="md-accent md-raised" :disabled="!(data.username && data.password && data.first && data.last && data.email && data.role)" @click="submit()">Sign Up</md-button>
        </div>
      </md-card>
      <div class="md-layout-item md-large-size-25 md-medium-size-20 md-small-size-15 md-xsmall-size-5"></div>
    </div>
    <div class="errMessage" v-if="userAlreadyExists">
      <div class="md-body-2">The username '<strong>{{ invalid }}</strong>' already exists. Please pick another username.</div>
    </div>
    <div class="errMessage" v-if="passwordTooShort">
      <div class="md-body-2">Your password must be at least 5 characters long.</div>
    </div>

     <md-snackbar :md-active.sync="noWalletLogged">Please click the wallet button on the top right corner to login!!!</md-snackbar>
     <md-snackbar :md-active.sync="recordSaved">The transaction was Posted, sign with your wallet now!!!</md-snackbar>
     <md-snackbar :md-active.sync="recordSigned">The transaction was Signed, Congratulations!!!</md-snackbar>
  </div>
</template>

<script>
/* eslint-disable */
import simbaApi from './gateways/simba-api'
import { localstorage } from './mixins/localstorage'
import ethers from 'ethers'

export default {
  name: 'Signup',
  mixins: [localstorage],

  data () {
    return {
      method: null,
      data: {
        first: null,
        last: null,
        email: null,
        role: null,
        username: null,
        password: null,
        assetId: null
      },
      current_usernames: [],
      numOfUsers: null,
      userAlreadyExists: false,
      invalid: null,
      passwordTooShort: false,

      noWalletLogged: false,
      sending: false,
      unsignedTxn: null,
      txnId: null,
      recordSigned: false,
      isSigning: false,
      recordSaved: false

    }
  },

  mounted () {
    let self = this
    try {
      simbaApi.getData('create_user/?')
        .then(function (response) {
          let results = response.data.results
          self.numOfUsers = response.data.results.length
          for (let i = 0; i < results.length; i++) {
            self.current_usernames.push(results[i].payload.inputs.username)
          }
        })
    } catch (e) {
      console.log(e)
    }
  },

  methods: {
    submit () {
      this.userAlreadyExists = false
      this.passwordTooShort = false
      let self = this
      if (self.current_usernames.includes(self.data.username)) {
        self.invalid = self.data.username
        self.userAlreadyExists = true
        return
      } else if (self.data.password.length < 5) {
        self.passwordTooShort = true
        return
      }
      this.data.assetId = this.numOfUsers
      this.saveRecord()
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

    // posts all the data to Simba Chain
    saveRecord (e) {
      if (!this.getWallet()) {
        this.noWalletLogged = true
        return
      }
      this.sending = true

      let bodyFormData = new FormData()
      bodyFormData.append('from', this.getAddress())

      let method = 'create_user'

      for (let k in this.data) {
        if (this.data.hasOwnProperty(k)) {
          bodyFormData.append(k, this.data[k])
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
          setTimeout(function () {
            self.$router.push('/account/login')
          }, 1500)
        })
      } catch (e) {
        console.log(e)
      }
    },
  }
}
</script>

<style>
.md-progress-bar {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
}
#card1 {
  margin: 0 auto; /* Added */
  float: none; /* Added */
  margin-bottom: 10px; /* Added */
  padding: 8px;
}
.errMessage {
  color: white;
  background-color: rgb(255, 79, 71);
  text-align: center;
  margin: 0 auto; /* Added */
  float: none; /* Added */
  margin-bottom: 10px; /* Added */
  width: 50%;
  border-radius: 15px;
}
</style>
