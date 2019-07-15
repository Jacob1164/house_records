<template>
  <div>
    <div class="row text-center">
      <div class="col-xl-3 col-lg-3 col-md-2 col-sm-1 col-0"></div>
      <div class="col-xl-6 col-lg-6 col-md-8 col-sm-10 col-12">
        <b-card bg-variant="light" class="post-card" title="Sign Up">
          <div class="row">
            <div class="col-6">
              <b-form-group description="First Name">
                <b-form-input name="first" id="first" v-model="data.first" :disabled="sending"/>
              </b-form-group>
            </div>
            <div class="col-6">
              <b-form-group description="Last Name">
                <b-form-input name="last" id="last" v-model="data.last" :disabled="sending"/>
              </b-form-group>
            </div>
          </div>

          <div class="row">
            <div class="col-12">
              <b-form-group description="Email">
                <b-form-input name="email" id="email" type="email" v-model="data.email" :disabled="sending"/>
              </b-form-group>
            </div>
          </div>

          <div class="row">
            <div class="col-12">
              <b-form-group description="Role">
                <b-form-select v-model="data.role" :disabled="sending">
                  <option :value="null" selected disabled>Please select a role</option>
                  <option value="re">Real Estate Agent</option>
                  <option value="ia">Insurance Agent</option>
                  <option value="in">Inspector</option>
                  <option value="ho">Home Owner</option>
                </b-form-select>
              </b-form-group>
            </div>
          </div>
          <div class="row">
            <div class="col-12">
              <b-form-group description="Username">
                <b-form-input name="username" id="username" v-model="data.username" :disabled="sending"/>
              </b-form-group>
            </div>
          </div>
          <div class="row">
            <div class="col-12">
              <b-form-group description="Password">
                <b-form-input type="password" name="password" id="password" v-model="data.password" :disabled="sending"/>
              </b-form-group>
            </div>
          </div>
          <b-button variant="outline-success" v-if="!(data.username && data.password && data.first && data.last && data.email && data.role)" disabled>Sign Up</b-button>
          <b-button variant="success" v-else @click="submit()">Sign Up</b-button>
        </b-card>
        <b-spinner variant="primary" v-if="sending" label="Loading..."></b-spinner>
        <b-alert v-model="userAlreadyExists" dismissible variant="danger">The username '<strong>{{ invalid }}</strong>' already exists. Please pick another username.</b-alert>
        <b-alert v-model="passwordTooShort" dismissible variant="danger">Your password must be at least 5 characters long.</b-alert>
      </div>
      <div class="col-md-auto"></div>
    </div>
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

      sending: false,
      unsignedTxn: null,
      txnId: null,
      isSigning: false,

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
      var passwordHash = require('password-hash')
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
      self.data.password = passwordHash.generate(self.data.password)
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
          self.$parent.makeToast('The transaction was signed, congratulations!!!', 'success', 'Sign Up')
          self.isSigning = false
        })
      } catch (e) {
        console.log(e)
      }
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
          self.$parent.makeToast('The transaction was posted!!!', 'success', 'Sign Up')
          self.sending = false
          self.$router.push('/account/login')
        })
      } catch (e) {
        console.log(e)
      }
    },
  }
}
</script>

<style>
.post-card {
  margin: 10px;
}
</style>
