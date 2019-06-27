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
            You need to select a party to begain
          </md-card-content>

        </md-ripple>
      </md-card>
    </div>

    <div v-if="!showWarning">
      <div class="post-form">
        <md-card class="md-layout-item md-size-50 md-large-size-50 md-medium-size-70 md-small-size-90 md-xsmall-size-100">
          <md-card-header>
            <div v-if="showSC" class="title">Service Center</div>
            <div v-if="showSU" class="title">Supplier</div>
            <div v-if="showMF" class="title">Manufacturer</div>
          </md-card-header>

          <md-card-content class="post-card">
            <div v-if="showSC" class="md-layout-item md-size-100">
              <md-radio v-model="scAction" value="ship">
                <strong style="color:#64dd17;">Ship Clean Container</strong>
              </md-radio>
              <md-radio v-model="scAction" value="recycle">
                <strong style="color:#64dd17;">Recycle Container</strong>
              </md-radio>
            </div>
            <div v-if="showSU" class="md-layout-item md-size-100">
              <strong style="color:#64dd17;">Ship Container with Parts</strong>
            </div>
            <div v-if="showMF" class="md-layout-item md-size-100">
              <strong style="color:#64dd17;">Ship Dirty Container</strong>
            </div>

            <div v-if="scAction == 'ship' || !showSC">
              <div class="md-layout md-gutter">
                <div class="md-layout-item md-size-50">
                  <md-field>
                    <label for="inventoryType">Inventory Type</label>
                    <md-input name="inventoryType" id="inventoryType" v-model="form1.inventoryType" :disabled="sending" />
                  </md-field>
                </div>
                <div class="md-layout-item md-size-50">
                  <md-field>
                    <label for="inventoryQty">Inventory Quantity</label>
                    <md-input name="inventoryQty" id="inventoryQty" v-model="form1.inventoryQty" :disabled="sending" />
                  </md-field>
                </div>
              </div>
              <div class="md-layout md-gutter">
                <div class="md-layout-item md-size-33">
                  <md-field>
                    <label>Number</label>
                    <md-input name="number" id="number" v-model="form1.number" :disabled="sending" />
                  </md-field>
                </div>
                <div class="md-layout-item md-size-33">
                  <md-field>
                    <label>Quantity</label>
                    <md-input name="quantity" id="quantity" v-model="form1.quantity" :disabled="sending" />
                  </md-field>
                </div>
                <div class="md-layout-item md-size-33">
                  <md-field>
                    <label>Part No.</label>
                    <md-input name="partNo" id="partNo" v-model="form1.partNo" :disabled="sending" />
                  </md-field>
                </div>
              </div>

              <div class="md-layout md-gutter">
                <div class="md-layout-item md-size-33">
                  <md-field>
                    <label>BOL</label>
                    <md-input name="bol" id="bol" v-model="form1.bol" :disabled="sending" />
                  </md-field>
                </div>
                <div class="md-layout-item md-size-33">
                  <md-field>
                    <label>PO No.</label>
                    <md-input name="poNo" id="poNo" v-model="form1.poNo" :disabled="sending" />
                  </md-field>
                </div>
                <div class="md-layout-item md-size-33">
                  <md-field>
                    <label>Tm Load No.</label>
                    <md-input name="tmLoadNo" id="tmLoadNo" v-model="form1.tmLoadNo" :disabled="sending" />
                  </md-field>
                </div>
              </div>

              <div class="md-layout md-gutter">
                <div class="md-layout-item md-size-50">
                  <md-field>
                    <label>Supplier</label>
                    <md-input name="supplier" id="supplier" v-model="form1.supplier" :disabled="sending" />
                  </md-field>
                </div>
                <div v-if="!showMF" class="md-layout-item md-size-50">
                  <md-field>
                    <label>Smart Track Txn No.</label>
                    <md-input name="smartTrackTxnNo" id="smartTrackTxnNo" v-model="form1.smartTrackTxnNo" :disabled="sending" />
                  </md-field>
                </div>
              </div>

            </div>

            <div v-if="scAction == 'recycle'">
              <div class="md-layout md-gutter">
                <div class="md-layout-item md-size-50">
                  <md-field>
                    <label for="inventoryType">Inventory Type</label>
                    <md-input name="inventoryType" id="inventoryType" v-model="form2.inventoryType" :disabled="sending" />
                  </md-field>
                </div>
                <div class="md-layout-item md-size-50">
                  <md-field>
                    <label for="inventoryQty">Inventory Quantity</label>
                    <md-input name="inventoryQty" id="inventoryQty" v-model="form2.inventoryQty" :disabled="sending" />
                  </md-field>
                </div>
              </div>
              <div class="md-layout md-gutter">
                <div class="md-layout-item md-size-50">
                  <md-field>
                    <label>Destination Service Center</label>
                    <md-input name="destinationServiceCenter" id="destinationServiceCenter" v-model="form2.destinationServiceCenter" :disabled="sending" />
                  </md-field>
                </div>
              </div>
            </div>

            <div class="md-layout md-gutter">
              <div class="md-layout-item md-size-50">
                <md-field>
                  <label>Attachment</label>
                  <md-file name="attachment" id="attachment" v-model="attachment"/>
                </md-field>
              </div>
            </div>

          </md-card-content>

          <md-progress-bar class="md-accent" md-mode="indeterminate" v-if="sending"/>

          <md-card-actions>
            <md-button v-if="scAction == 'ship' || showSU" type="submit" class="md-accent md-raised" :disabled="!(form1.inventoryType && form1.inventoryQty && form1.number && form1.quantity && form1.supplier && form1.smartTrackTxnNo && form1.tmLoadNo && form1.bol && form1.poNo && form1.partNo)"  v-on:click="saveRecord()">Submit</md-button>
            <md-button v-if="showMF" type="submit" class="md-accent md-raised" :disabled="!(form1.inventoryType && form1.inventoryQty && form1.number && form1.quantity && form1.supplier && form1.tmLoadNo && form1.bol && form1.poNo && form1.partNo)"  v-on:click="saveRecord()">Submit</md-button>
            <md-button v-if="scAction == 'recycle'" type="submit" class="md-accent md-raised" :disabled="!(form2.inventoryType && form2.inventoryQty && form2.destinationServiceCenter)"  v-on:click="saveRecord()">Submit</md-button>
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
    showSC: false,
    showSU: false,
    showMF: false,
    showWarning: true,

    form1: {
      inventoryType: null,
      inventoryQty: null,
      number: null,
      quantity: null,
      supplier: null,
      smartTrackTxnNo: null,
      tmLoadNo: null,
      bol: null,
      poNo: null,
      partNo: null
    },

    form2: {
      inventoryType: null,
      inventoryQty: null,
      destinationServiceCenter: null
    },

    attachment: null
  }),
  methods: {
    getCurrentWallet () {
      this.unlockWallet()
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
        case 'sc':
          this.showSC = true
          this.showSU = false
          this.showMF = false
          this.showWarning = false
          break
        case 'su':
          this.showSC = false
          this.showSU = true
          this.showMF = false
          this.showWarning = false
          break
        case 'mf':
          this.showSC = false
          this.showSU = false
          this.showMF = true
          this.showWarning = false
          break
      }
    },
    clearForm () {
      this.form1.inventoryType = null
      this.form1.inventoryQty = null
      this.form1.number = null
      this.form1.quantity = null
      this.form1.supplier = null
      this.form1.smartTrackTxnNo = null
      this.form1.tmLoadNo = null
      this.form1.bol = null
      this.form1.poNo = null
      this.form1.partNo = null

      this.form2.inventoryType = null
      this.form2.inventoryQty = null
      this.form2.destinationServiceCenter = null

      this.attachment = null
    },
    saveRecord (e) {
      if (!this.getWallet()) {
        this.noWalletLogged = true
        return
      }
      this.sending = true

      let bodyFormData = new FormData()
      bodyFormData.append('from', this.getAddress())

      if (this.attachment) {
        bodyFormData.append('file[0]', document.getElementById('attachment').files[0])
      }

      bodyFormData.append('assetId', 'usedToGenerateGraph,butYouCanIgnoreItAndFillWithAnything')

      let method = null

      if (this.showSC) {
        if (this.scAction === 'recycle') {
          method = 'recycleContainer'
        } else if (this.scAction === 'ship') {
          method = 'shipCleanContainer'
        } else {
          return
        }
      } else if (this.showSU) {
        method = 'shipContainerWithParts'
      } else if (this.showMF) {
        method = 'shipDirtyContainer'
      } else {
        return
      }

      if (method === 'recycleContainer') {
        for (let k in this.form2) {
          if (this.form2.hasOwnProperty(k)) {
            bodyFormData.append(k, this.form2[k])
          }
        }
      } else {
        for (let k in this.form1) {
          if (this.form1.hasOwnProperty(k)) {
            bodyFormData.append(k, this.form1[k])
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
