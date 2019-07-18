<template>
  <div class="page-container unselectable">
    <b-navbar :variant="color" :sticky="true" toggleable="md">
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <b-navbar-brand>House Demo</b-navbar-brand>
      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item to="/">Home</b-nav-item>
          <b-nav-item to="/register">Register a House</b-nav-item>
          <b-nav-item v-if="loggedIn" to="/post">Add Records</b-nav-item>
        </b-navbar-nav>

        <b-navbar-nav class="ml-auto">
          <b-nav-item v-if="loggedIn" class="d-none d-sm-none d-md-block">
            <b-button v-b-tooltip.hover title="Accountt" pill variant="outline-light" @click="setAccount(true)">
              <img class="icon" src="./components/icons/person.svg" alt="person">
            </b-button>
          </b-nav-item>

          <b-nav-item class="d-none d-sm-none d-md-block">
            <b-button v-b-tooltip.hover title="Info" pill variant="outline-light" @click="info = !info">
              <img class="icon" src="./components/icons/info.svg" alt="info">
            </b-button>
          </b-nav-item>

          <b-nav-item class="d-none d-sm-none d-md-block">
            <b-button v-b-tooltip.hover title="Wallet" pill variant="outline-light" @click="isWallet = !isWallet">
              <img class="icon" src="./components/icons/credit-card.svg" alt="creidt card">
            </b-button>
          </b-nav-item>
          <b-nav-item v-if="loggedIn" @click="setAccount(true)" class="d-block d-md-none">Account</b-nav-item>
          <b-nav-item class="d-block d-md-none" @click="info = !info">Info</b-nav-item>
          <b-nav-item class="d-block d-md-none" @click="isWallet = !isWallet">Wallet</b-nav-item>
        </b-navbar-nav>
        <b-navbar-nav class="ml">
          <b-nav-item v-if="loggedIn" id="logout" @click="logout()">Log Out</b-nav-item>
          <b-nav-item v-if="!loggedIn" to="/account/login" id="log">Log in</b-nav-item>
          <b-nav-item v-if="!loggedIn" to="/account/signup" id="sign">Sign up</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>

    <b-modal v-model="info" title="Website Info" :ok-only="true">
      <div class="d-block text-center">
        <small>Use the map on the main page to find a registered house.</small>
        <br><small>If you click on a pin, you can go to a page with all the records for that house.</small>
        <br><small>Go the register a house page to add a new house to the map.</small>
        <br><small>Login/Sign up as either a real estate agent, insurance agent, or inspector to add records to a house.</small>
      </div>
    </b-modal>

    <b-modal v-model="account" title="Account Info" :ok-only="true">
      <div>
        <h4>{{accountInfo.first}} {{accountInfo.last}}</h4>
        <h6><strong>Email: </strong>{{accountInfo.email}}</h6>
        <h6><strong>Role: </strong>{{accountInfo.displayRole}}</h6>
      </div>
    </b-modal>

    <b-modal class="wallet" v-model="isWallet" title="Ethereum Wallet" :ok-only="true" ok-title="Cancel">
      <div v-if="isCreate">
        <div>
          <h6>Create a new Ethereum Account</h6>
          <br>
        </div>
        <b-button variant="primary" @click="setWalletStatus('restore')">Restore</b-button>
        <b-button variant="primary" @click="createWallet()">Create</b-button>
      </div>

      <div v-if="isRestore">
        <div>
          <h6>Restore your Ethereum Account with Seed</h6>
          <small>Please type your seed (12 mnemonic words) to restore</small><br>
          <div class="md-layout-item md-size-70">
            <b-form-group>
              <label for="resotreSeed">Wallet Seed</label>
              <b-form-textarea id="resotreSeed" rows="2" max-rows="4" v-model="restoreSeed" placeholder="Wallet Seed" no-resize></b-form-textarea>
            </b-form-group>
          </div><br>
        </div>
        <b-button variant="primary" @click="setWalletStatus('create')">Create</b-button>
        <b-button variant="primary" @click="restoreWallet()">Restore</b-button>
      </div>

      <div v-if="isUnlock">
        <h6>Unlock Your Account</h6><br>
          <b-button variant="secondary" @click="logoutWallet">Logout</b-button>
          <b-button variant="primary" @click="unlockWallet">Unlock</b-button>
      </div>

      <div v-if="isCheck">
        <div>
          <h6>Ethereum Account Information</h6>
          <b-form-group>
            <label for="accountAddress">Account Address</label>
            <b-form-textarea id="accountAddress" v-model="accountAddress" :readonly="true" no-resize></b-form-textarea>
          </b-form-group>
          <div v-if="isRevealed">
            <b-form-group>
              <label for="accountPk">Private Key</label>
              <b-form-textarea id="accountPk" v-model="accountPk" :readonly="true" no-resize></b-form-textarea>
            </b-form-group>
            <b-form-group>
              <label for="accountSeed">Seed</label>
              <b-form-textarea id="accountSeed" v-model="accountSeed" :readonly="true" no-resize></b-form-textarea>
            </b-form-group>
          </div>
        </div>
        <b-button variant="secondary" @click="logoutWallet">Logout</b-button>
        <b-button variant="primary" @click="isRevealed = true">Reveal</b-button>
      </div>
    </b-modal>

    <router-view class="conent">
    </router-view>
  </div>
</template>

<style lang="css" scoped>
  .unselectable {
    user-drag: none;
    -webkit-user-drag: none;
  }
  .wallet {
    min-width: 320px;
  }
  .icon {
    width: 20px;
    height: 20px;
  }
  .fill {
    fill: green;
  }
  b-navbar {
    height: 50px;
  }
</style>

<script>
/* eslint-disable */
import { localstorage } from './components/mixins/localstorage'
import manageApi from './components/gateways/manage-api'
import simbaApi from './components/gateways/simba-api'
import ethers from 'ethers'

export default {
  name: 'App',
  mixins: [localstorage],
  data () {
    return {
      restoreSeed: null,
      accountAddress: null,
      accountPk: null,
      accountSeed: null,
      isRevealed: false,
      isWallet: false,
      isCreate: false,
      isRestore: false,
      isUnlock: false,
      isCheck: false,
      hasWallet: false,
      info: false,
      account: false,
      accountInfo: {
        first: null,
        last: null,
        email: null,
        role: null,
        displayRole: null
      },
      loggedIn: false,
      color: null
    }
  },
  methods: {
    makeToast (message, variant, title) {
    this.$bvToast.toast(message, {
      title: title,
      autoHideDelay: 4000,
      variant: variant,
      toaster: 'b-toaster-top-right'
      })
    },

    setAccount (status) {
      this.account = status
      if (status === true) {
        let role = this.accountInfo.role
        if (role == 'ia') {
          this.accountInfo.displayRole = 'Insurance Agent'
        } else if (role == 'in') {
          this.accountInfo.displayRole = 'Inspector'
        } else if (role == 're') {
          this.accountInfo.displayRole = 'Real Estate Agent'
        } else {
          this.accountInfo.displayRole = 'Home Owner'
        }
      }
    },

    setWalletStatus (status) {
      switch (status) {
        case 'create':
          this.isCreate = true
          this.isRestore = false
          this.isUnlock = false
          this.isCheck = false
          break
        case 'restore':
          this.isCreate = false
          this.isRestore = true
          this.isUnlock = false
          this.isCheck = false
          break
        case 'unlock':
          this.isCreate = false
          this.isRestore = false
          this.isUnlock = true
          this.isCheck = false
          break
        case 'check':
          this.isCreate = false
          this.isRestore = false
          this.isUnlock = false
          this.isCheck = true
          break
        case 'close':
          this.isCreate = false
          this.isRestore = false
          this.isUnlock = false
          this.isCheck = false
          this.isWallet = false
          this.cleanUp()
          break
      }
    },
    showWallet (status) {
      this.setWalletStatus('close')
      if (status) {
        this.isWallet = true
        this.getCurrentWallet()
      }
    },
    getCurrentWallet () {
      if (localStorage.getItem('keystore')) {
        this.isUnlock = true
        this.hasWallet = true
      } else {
        this.isCreate = true
        this.hasWallet = false
      }
    },
    createWallet () {
      const mnemonic = ethers.HDNode.entropyToMnemonic(ethers.utils.randomBytes(16))
      this.setWallet(mnemonic)
      this.checkWallet(mnemonic)
      this.setWalletStatus('check')
      this.hasWallet = true
      this.cleanUp()
      this.depositAccount(mnemonic)
    },
    depositAccount (mnemonic) {
      let wallet = ethers.Wallet.fromMnemonic(mnemonic)
      let address = wallet.address
      let payload = {
        account: address,
        value: '100',
        currency: 'ether'
      }
      let self = this
      try {
        manageApi.requestFund('requestFunds/', payload).then(function () {
          self.makeToast('We deposited enough Ethers on this private network for you, please wait a while', 'success', 'Ethereum Wallet')
        })
      } catch (e) {
        console.log(e)
      }
    },
    restoreWallet () {
      const mnemonic = this.restoreSeed
      if (!ethers.HDNode.isValidMnemonic(mnemonic)) {
        this.makeToast('The seed is invalid, please check again!!!', 'danger', 'Ethereum Wallet')
        this.cleanUp()
        return
      }
      this.setWallet(mnemonic)
      this.checkWallet(mnemonic)
      this.depositAccount(mnemonic)
      this.setWalletStatus('check')
      this.hasWallet = true
      this.cleanUp()
    },
    cleanUp () {
      this.restoreSeed = null
      this.isRevealed = false
    },
    unlockWallet () {
      if (this.getWallet()) {
        this.setWalletStatus('check')
        this.checkWallet(this.getWallet())
      } else {
        this.cleanUp()
      }
    },
    checkWallet (mnemonic) {
      let wallet = ethers.Wallet.fromMnemonic(mnemonic)
      this.setAddress(wallet.address)
      this.accountAddress = wallet.address
      this.accountPk = wallet.privateKey
      this.accountSeed = mnemonic
    },
    logoutWallet () {
      this.clean()
      this.setWalletStatus('create')
      this.hasWallet = false
    },
    logout () {
      this.loggedIn = false
      this.accountInfo.first = null
      this.accountInfo.last = null
      this.accountInfo.email = null
      this.accountInfo.role = null
      localStorage.setItem('assetId', null)
      localStorage.setItem('loggedIn', false)
      localStorage.setItem('role', null)
      this.$router.push('/')
    }
  },
  mounted () {
    if (!localStorage.getItem('keystore')) {
      this.createWallet()
      this.makeToast('We just created a wallet for you, check it out at the right-top corner :)', 'success', 'Ethereum Wallet')
    }
    if(localStorage.getItem('loggedIn') == true) {
      this.loggedIn = true
    }
    let num = Math.floor(Math.random() * 5)
    if (num == 0) this.color = 'primary'
    if (num == 1) this.color = 'danger'
    if (num == 2) this.color = 'warning'
    if (num == 3) this.color = 'success'
    if (num == 4) this.color = 'info'

    this.getCurrentWallet()
  }
}
</script>
