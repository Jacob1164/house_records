<template>
  <div class="page-container unselectable">
    <md-app md-waterfall md-mode="fixed-last">
      <md-app-toolbar class="md-dense md-primary tool-bar">
        <div class="md-toolbar-row">
          <div class="md-toolbar-section-start">
            <md-button class="md-icon-button" @click="menuVisible = !menuVisible">
              <md-icon>menu</md-icon>
            </md-button>
            <h3 class="md-title">House Dem</h3>
            <md-button to="/">Home</md-button>
            <md-button to="/register">Register a House</md-button>
            <md-button v-if="loggedIn" to="/post">Add Records</md-button>
            <md-button v-if="loggedIn && accountInfo.role == 'ho'" to="/claim">Claim Your House</md-button>
          </div>

          <div class="md-toolbar-section-end">
            <span v-if="loggedIn">
              <md-button class="md-icon-button" @click="setAccount(true)">
                <md-icon>account_circle</md-icon>
              </md-button>
              <md-tooltip md-delay="500" md-direction="left">Account</md-tooltip>
            </span>
            <span>
              <md-button class="md-icon-button" @click="setInfo(true)">
                <md-icon>info</md-icon>
              </md-button>
              <md-tooltip md-delay="500" md-direction="left">Info</md-tooltip>
            </span>
            <span>
              <md-button class="md-icon-button" @click="showWallet(true)">
                <span v-if="hasWallet">
                  <md-icon style="color: #00c853;">account_balance_wallet</md-icon>
                </span>
                <span v-else>
                  <md-icon>account_balance_wallet</md-icon>
                </span>
              </md-button>
              <md-tooltip md-delay="500" md-direction="left">Wallet</md-tooltip>
            </span>
            <md-button v-if="loggedIn" id="logout" @click="logout()">Log Out</md-button>
            <md-button v-if="!loggedIn" to="/account/login" id="log">Log in</md-button>
            <md-button v-if="!loggedIn" to="/account/signup" id="sign">Sign up</md-button>
          </div>

          <md-dialog :md-active.sync="info">
            <md-toolbar class="md-accent md-dense">
              <h3 class="md-title" style="flex: 1">Website Info</h3>
              <md-button class="md-icon-button" @click="setInfo(false)">
                <md-icon>close</md-icon>
              </md-button>
            </md-toolbar>
            <div class="md-body-2 space">
              <div>Use the map on the main page to find a registered house.</div>
              <div>If you click on a pin, you can go to a page with all the records for that house.</div>
              <div>Go the register a house page to add a new house to the map.</div>
              <div>Login/Sign up as either a real estate agent, insurance agent, inspector, or home owner to add records to a house.</div>
            </div>
          </md-dialog>

          <md-dialog :md-active.sync="account">
            <md-toolbar class="md-accent md-dense">
              <h3 class="md-title" style="flex: 1">Account Info</h3>
              <md-button class="md-icon-button" @click="setAccount(false)">
                <md-icon>close</md-icon>
              </md-button>
            </md-toolbar>
            <div class="space">
              <div class="md-title">{{accountInfo.first}} {{accountInfo.last}}</div>
              <div class="md-body-1"><strong>Email: </strong>{{accountInfo.email}}</div>
              <div class="md-body-1"><strong>Role: </strong>{{accountInfo.displayRole}}</div>
            </div>
          </md-dialog>

          <md-dialog class="wallet" :md-active.sync="isWallet">
            <md-toolbar class="md-accent md-dense">
              <h3 class="md-title" style="flex: 1">Ethereum Wallet</h3>
                <md-button class="md-icon-button" @click="setWalletStatus('close')">
                  <md-icon>close</md-icon>
                </md-button>
            </md-toolbar>

            <div v-if="isCreate">
              <div class="wallet-content">
                <div class="md-subheading">
                  Create a new Ethereum Account
                </div>
                <br>
                <br>
                <br>
              </div>
              <md-dialog-actions class="md-layout md-alignment-center-space-between">
                <md-button class="md-accent" @click="setWalletStatus('restore')">Restore</md-button>
                <md-button class="md-accent md-raised" @click="createWallet()">Create</md-button>
              </md-dialog-actions>
            </div>

            <div v-if="isRestore">
              <div class="wallet-content">
                <div class="md-subheading">
                  Restore your Ethereum Account with Seed
                </div>
                <br>
                <div class="md-caption">
                  Please type your seed (12 mnemonic words) to restore
                </div>
                <div class="md-layout-item md-size-70">
                  <md-field>
                    <label>Wallet Seed</label>
                    <md-textarea md-autogrow v-model="restoreSeed"></md-textarea>
                  </md-field>
                </div>
                <br>
                <br>
                <br>
              </div>
              <md-dialog-actions class="md-layout md-alignment-center-space-between">
                <md-button class="md-accent" @click="setWalletStatus('create')">Create</md-button>
                <md-button class="md-accent md-raised" @click="restoreWallet()">Restore</md-button>
              </md-dialog-actions>
              <md-snackbar :md-active.sync="invalidSeed">The seed is invalid, please check again!!!</md-snackbar>
            </div>

            <div v-if="isUnlock">
              <div class="wallet-content">
                <div class="md-subheading">
                  Unlock Your Account
                </div>
                <br>
                <br>
                <br>
              </div>
              <md-dialog-actions class="md-layout md-alignment-center-space-between">
                <md-button @click="logoutWallet">Logout</md-button>
                <md-button class="md-accent md-raised" @click="unlockWallet">Unlock</md-button>
              </md-dialog-actions>
            </div>

            <div v-if="isCheck">
              <div class="wallet-content">
                <div class="md-subheading">
                  Ethereum Account Information
                </div>
                <br>
                <div class="md-layout-item md-size-90">
                  <md-field>
                    <label>Account Address</label>
                    <md-textarea md-autogrow v-model="accountAddress" readonly></md-textarea>
                  </md-field>
                </div>
                <div v-if="isRevealed">
                  <div class="md-layout-item md-size-90">
                    <md-field>
                      <label>Private Key</label>
                      <md-textarea md-autogrow v-model="accountPk" readonly></md-textarea>
                    </md-field>
                  </div>
                  <div class="md-layout-item md-size-90">
                    <md-field>
                      <label>Seed</label>
                      <md-textarea md-autogrow v-model="accountSeed" readonly></md-textarea>
                    </md-field>
                  </div>
                </div>
              </div>
              <md-dialog-actions class="md-layout md-alignment-center-space-between">
                <md-button @click="logoutWallet">Logout</md-button>
                <md-button class="md-accent md-raised" @click="isRevealed = true">Reveal</md-button>
              </md-dialog-actions>
            </div>
          </md-dialog>
        </div>
      </md-app-toolbar>

      <md-app-drawer :md-active.sync="menuVisible">
        <md-toolbar class="md-transparent avatar" md-elevation="0">
          <md-icon class="md-size-3x">house</md-icon>
        </md-toolbar>
        <div id="menuTitle" class="md-subheading title md-size-3x">House Demo</div>
        <md-list>
          <md-list-item href="https://app.simbachain.com/" target="_blank" @click="menuVisible = false">
            <md-icon>apps</md-icon>
            <span class="md-list-item-text">SIMBA&#8482; Dashboard</span>
          </md-list-item>
          <md-list-item href="https://developers.google.com/maps/documentation/" target="_blank" @click="menuVisible = false">
            <md-icon>place</md-icon>
            <span class="md-list-item-text">Google Maps API</span>
          </md-list-item>
        </md-list>
      </md-app-drawer>

      <md-app-content>
        <router-view class="conent">
        </router-view>
      </md-app-content>
    </md-app>
      <md-snackbar :md-active.sync="createdWallet">We just created a wallet for you, check it out at the right-top corner : )</md-snackbar>
      <md-snackbar :md-active.sync="depositedWallet">We deposited enough Ethers on this private network for you, please wait a while</md-snackbar>
  </div>
</template>

<style lang="css" scoped>
  .md-app {
    height: 100vh;
  }
  .unselectable {
    user-drag: none;
    -webkit-user-drag: none;
  }
  .wallet {
    min-width: 320px;
  }
  .wallet-content {
    margin: 20px;
  }
  #menuTitle {
    text-align: center;
  }
  .space {
    padding: 8px;
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
      invalidSeed: null,
      accountAddress: null,
      accountPk: null,
      accountSeed: null,
      menuVisible: false,
      isRevealed: false,
      isWallet: false,
      isCreate: false,
      isRestore: false,
      isUnlock: false,
      isCheck: false,
      hasWallet: false,
      createdWallet: false,
      depositedWallet: false,
      info: false,
      account: false,
      accountInfo: {
        first: null,
        last: null,
        email: null,
        role: null,
        displayRole: null
      },
      loggedIn: false
    }
  },
  methods: {
    setInfo (status) {
      this.info = status
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
          self.depositedWallet = true
        })
      } catch (e) {
        console.log(e)
      }
    },
    restoreWallet () {
      const mnemonic = this.restoreSeed
      if (!ethers.HDNode.isValidMnemonic(mnemonic)) {
        this.invalidSeed = true
        this.cleanUp()
        return
      }
      this.invalidSeed = false
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
    toggleMenu () {
      this.menuVisible = !this.menuVisible
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
      this.createdWallet = true
    }
    if(localStorage.getItem('loggedIn') == true) {
      this.loggedIn = true
    }

    this.getCurrentWallet()
  }
}
</script>
