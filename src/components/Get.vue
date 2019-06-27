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

    <div v-if="showTracking">

      <md-table class="audit-table md-layout-item md-size-70 md-large-size-70 md-medium-size-80 md-small-size-90 md-xsmall-size-100" v-model="searched" md-sort="name" md-sort-order="asc" md-fixed-header>
        <md-table-toolbar>
          <div class="md-toolbar-section-start filter-btn">
            <md-menu md-align-trigger md-size="big">
              <md-button md-menu-trigger><md-icon>filter_list</md-icon>Transactions: <span style="color:#64dd17;">{{containerFilter}}</span></md-button>
              <md-menu-content>
                <md-menu-item  @click="changefilter('all')">
                  <md-icon>all_inclusive</md-icon>
                  <span>All</span>
              </md-menu-item>
                <md-menu-item  @click="changefilter('clean')">
                  <md-icon>present_to_all</md-icon>
                  <span>Clean Container</span>
              </md-menu-item>
                <md-menu-item  @click="changefilter('withParts')">
                  <md-icon>build</md-icon>
                  <span>Container with Parts</span>
              </md-menu-item>
                <md-menu-item  @click="changefilter('dirty')">
                  <md-icon>cancel_presentation</md-icon>
                  <span>Dirty Container</span>
              </md-menu-item>
                <md-menu-item  @click="changefilter('recyeled')">
                  <md-icon>autorenew</md-icon>
                  <span>Recycled Container</span>
              </md-menu-item>

              </md-menu-content>
            </md-menu>
          </div>
          <md-field md-clearable class="md-toolbar-section-end search-bar" v-if="searchBar">
            <md-input class="search-field" v-bind:placeholder="searchBy" v-model="search" @input="searchWithApi" />
          </md-field>

          <md-field md-clearable class="md-toolbar-section-end search-bar" v-if="!searchBar">
            <md-input class="search-field" placeholder="Choose Search Category" disabled/>
          </md-field>

          <md-menu v-if="!search">
            <md-button class="md-icon-button md-mini" md-menu-trigger>
              <md-icon>list</md-icon>
            </md-button>

            <md-menu-content>
              <md-menu-item @click="triggerSearch('inventoryType')">
                <span>Inventory Type</span>
                <md-icon>search</md-icon>
              </md-menu-item>
              <md-menu-item @click="triggerSearch('inventoryQty')">
                <span>Inventory Qty</span>
                <md-icon>search</md-icon>
              </md-menu-item>
              <md-menu-item v-if="containerFilter == 'recyeled'" @click="triggerSearch('destinationServiceCenter')">
                <span>Destatination</span>
                <md-icon>search</md-icon>
              </md-menu-item>
              <md-menu-item v-if="containerFilter != 'all' && containerFilter != 'recyeled'" @click="triggerSearch('supplier')">
                <span>Supplier</span>
                <md-icon>search</md-icon>
              </md-menu-item>
              <md-menu-item v-if="containerFilter == 'withParts' || containerFilter == 'clean'" @click="triggerSearch('smartTrackTxnNo')">
                <span>Smart Track No.</span>
                <md-icon>search</md-icon>
              </md-menu-item>

            </md-menu-content>
          </md-menu>
        </md-table-toolbar>

        <div v-if="!searched.length">
          <h2 class="loading" v-if="!theBar">We cannot find any records : (</h2>
        </div>

        <md-table-row v-if="containerFilter == 'all'" slot="md-table-row" v-for="(se, i) in searched" :key="i" @click="queryRecord(se)">
          <md-table-cell md-label="No." md-numeric>{{ i + 1 }}</md-table-cell>
          <md-table-cell md-label="Method" md-sort-by="payload.method">{{ se.payload.method }}</md-table-cell>
          <md-table-cell md-label="Inv Type" md-sort-by="payload.inputs.inventoryType">{{ se.payload.inputs.inventoryType }}</md-table-cell>
          <md-table-cell md-label="Inv Qty" md-sort-by="payload.inputs.inventoryQty">{{ se.payload.inputs.inventoryQty }}</md-table-cell>
          <md-table-cell md-label="Timestamp" md-sort-by="timestamp">{{ (new Date(se.timestamp)).toLocaleString() }}</md-table-cell>
        </md-table-row>

        <md-table-row v-if="containerFilter == 'clean' || containerFilter == 'withParts'" slot="md-table-row" v-for="(se, i) in searched" :key="i" @click="queryRecord(se)">
          <md-table-cell md-label="No." md-numeric>{{ i + 1 }}</md-table-cell>
          <md-table-cell md-label="Supplier" md-sort-by="payload.inputs.supplier">{{ se.payload.inputs.supplier}}</md-table-cell>
          <md-table-cell md-label="Inv Type" md-sort-by="payload.inputs.inventoryType">{{ se.payload.inputs.inventoryType }}</md-table-cell>
          <md-table-cell md-label="Inv Qty" md-sort-by="payload.inputs.inventoryQty">{{ se.payload.inputs.inventoryQty }}</md-table-cell>
          <md-table-cell md-label="ST No." md-sort-by="payload.inputs.smartTrackTxnNo">{{ se.payload.inputs.smartTrackTxnNo }}</md-table-cell>
          <md-table-cell md-label="Timestamp" md-sort-by="timestamp">{{ (new Date(se.timestamp)).toLocaleString() }}</md-table-cell>
        </md-table-row>

        <md-table-row v-if="containerFilter == 'dirty'" slot="md-table-row" v-for="(se, i) in searched" :key="i" @click="queryRecord(se)">
          <md-table-cell md-label="No." md-numeric>{{ i + 1 }}</md-table-cell>
          <md-table-cell md-label="Supplier" md-sort-by="payload.inputs.supplier">{{ se.payload.inputs.supplier}}</md-table-cell>
          <md-table-cell md-label="Inv Type" md-sort-by="payload.inputs.inventoryType">{{ se.payload.inputs.inventoryType }}</md-table-cell>
          <md-table-cell md-label="Inv Qty" md-sort-by="payload.inputs.inventoryQty">{{ se.payload.inputs.inventoryQty }}</md-table-cell>
          <md-table-cell md-label="Timestamp" md-sort-by="timestamp">{{ (new Date(se.timestamp)).toLocaleString() }}</md-table-cell>
        </md-table-row>

        <md-table-row v-if="containerFilter == 'recyeled'" slot="md-table-row" v-for="(se, i) in searched" :key="i" @click="queryRecord(se)">
          <md-table-cell md-label="No." md-numeric>{{ i + 1 }}</md-table-cell>
          <md-table-cell md-label="Des SC" md-sort-by="payload.inputs.destinationServiceCenter">{{ se.payload.inputs.destinationServiceCenter }}</md-table-cell>
          <md-table-cell md-label="Inv Qty" md-sort-by="payload.inputs.inventoryQty">{{ se.payload.inputs.inventoryQty }}</md-table-cell>
          <md-table-cell md-label="Inv Type" md-sort-by="payload.inputs.inventoryType">{{ se.payload.inputs.inventoryType }}</md-table-cell>
          <md-table-cell md-label="Timestamp" md-sort-by="timestamp">{{ (new Date(se.timestamp)).toLocaleString() }}</md-table-cell>
        </md-table-row>

      </md-table>

      <md-dialog class="detailsDialog" :md-active.sync="showDetailsDialog">
        <md-tabs md-dynamic-height class="md-accent">
          <md-tab md-label="Basic">
            <strong style="color:#64dd17;">This Transcation is made by: </strong>
            <span>
              <span v-if="queryMethodName == 'shipCleanContainer' || queryMethodName == 'recycleContainer'">Service Center</span>
              <span v-if="queryMethodName == 'shipContainerWithParts'">Supplier</span>
              <span v-if="queryMethodName == 'shipDirtyContainer'">Manufacturer</span>
            </span>

            <div>
              <div class="md-layout md-gutter">
                <div class="md-layout-item md-size-50">
                  <md-field>
                    <label for="inventoryType">Inventory Type</label>
                    <md-input name="inventoryType" id="inventoryType" v-model="inventoryType" readonly/>
                  </md-field>
                </div>
                <div class="md-layout-item md-size-50">
                  <md-field>
                    <label for="inventoryQty">Inventory Quantity</label>
                    <md-input name="inventoryQty" id="inventoryQty" v-model="inventoryQty" readonly/>
                  </md-field>
                </div>
              </div>

              <div v-if="queryMethodName != 'recycleContainer'" class="md-layout md-gutter">
                <div class="md-layout-item md-size-33">
                  <md-field>
                    <label>Number</label>
                    <md-input name="number" id="number" v-model="number" readonly/>
                  </md-field>
                </div>
                <div class="md-layout-item md-size-33">
                  <md-field>
                    <label>Quantity</label>
                    <md-input name="quantity" id="quantity" v-model="quantity" readonly/>
                  </md-field>
                </div>
                <div class="md-layout-item md-size-33">
                  <md-field>
                    <label>Part No.</label>
                    <md-input name="partNo" id="partNo" v-model="partNo" readonly/>
                  </md-field>
                </div>
              </div>

              <div v-if="queryMethodName != 'recycleContainer'" class="md-layout md-gutter">
                <div class="md-layout-item md-size-33">
                  <md-field>
                    <label>BOL</label>
                    <md-input name="bol" id="bol" v-model="bol" readonly/>
                  </md-field>
                </div>
                <div class="md-layout-item md-size-33">
                  <md-field>
                    <label>PO No.</label>
                    <md-input name="poNo" id="poNo" v-model="poNo" readonly/>
                  </md-field>
                </div>
                <div class="md-layout-item md-size-33">
                  <md-field>
                    <label>Tm Load No.</label>
                    <md-input name="tmLoadNo" id="tmLoadNo" v-model="tmLoadNo" readonly/>
                  </md-field>
                </div>
              </div>

              <div v-if="queryMethodName != 'recycleContainer'" class="md-layout md-gutter">
                <div class="md-layout-item md-size-50">
                  <md-field>
                    <label>Supplier</label>
                    <md-input name="supplier" id="supplier" v-model="supplier" readonly/>
                  </md-field>
                </div>
                <div v-if="queryMethodName != 'shipDirtyContainer'" class="md-layout-item md-size-50">
                  <md-field>
                    <label>Smart Track Txn No.</label>
                    <md-input name="smartTrackTxnNo" id="smartTrackTxnNo" v-model="smartTrackTxnNo" readonly/>
                  </md-field>
                </div>
              </div>

              <div v-if="queryMethodName == 'recycleContainer'" class="md-layout md-gutter">
                <div class="md-layout-item md-size-80">
                  <md-field>
                    <label>Destination Service Center</label>
                    <md-input name="destinationServiceCenter" id="destinationServiceCenter" v-model="destinationServiceCenter" readonly/>
                  </md-field>
                </div>
              </div>
            </div>

          </md-tab>

          <md-tab md-label="Transaction">
            <div class="txn-details" v-if="showTxn">
              <md-field>
                <label>Transaction Hash</label>
                <md-input v-model="txnHash" readonly></md-input>
              </md-field>
              <md-field>
                <label>Transaction From</label>
                <md-input v-model="txnFrom" readonly></md-input>
              </md-field>
              <md-field>
                <label>Transaction To</label>
                <md-input v-model="txnTo" readonly></md-input>
              </md-field>
              <div class="md-caption">Transaction Status: <strong>{{txnStatus}}</strong></div>
              <div class="md-caption">Gas Used: <strong>{{gasUsed}}</strong></div>
            </div>
            <div class="txn-details" v-else>
              <div class="md-caption">Please come back later</div>
              <br>
              <div class="md-caption">You should see the details then, if the transaction has been completed</div>
            </div>
          </md-tab>

          <md-tab md-label="File Bundle">
            <div class="txn-details" v-if="showBundle">
              <img v-if="isImg" class="md-layout-item md-layout-item md-size-70 md-large-size-70 md-medium-size-80 md-small-size-80 md-xsmall-size-50 bundle-img" :src="imgData" alt="IMG"/>
              <h4 v-if="!isImg">No Preview is Available</h4>
              <md-field>
                <label>IPFS Bundle Hash</label>
                <md-input v-model="bundleHash" readonly></md-input>
                <md-button class="md-icon-button md-mini" @click="downloadToLocal()">
                  <md-icon>cloud_download</md-icon>
                  <md-tooltip md-delay="500" md-direction="bottom">Download</md-tooltip>
                </md-button>
              </md-field>
              <div class="md-caption">File Name: <strong>{{fileName}}</strong></div>
              <div class="md-caption">File Size: <strong>{{fileSize}}</strong> bytes</div>
            </div>
            <div class="txn-details" v-else>
              <div class="md-caption">Please wait...only if you have uploaded any file</div>
            </div>
          </md-tab>
        </md-tabs>

        <md-dialog-actions class="md-layout md-alignment-center-left">
          <md-button class="md-accent" @click="showDetailsDialog = false">OK</md-button>
        </md-dialog-actions>
      </md-dialog>
      <br>
    </div>

  </div>
</template>

<script>
import simbaApi from './gateways/simba-api'
import saveAs from 'file-saver'
import b64toBlob from 'b64-to-blob'

export default {
  name: 'Get',
  mounted () {
    if (!localStorage.getItem('role')) {
      this.showWarning = true
      this.showTracking = false
      return
    }
    this.showWarning = false
    this.showTracking = true
    this.getRecords()
  },
  data: () => ({
    searchBar: false,
    searchCategory: null,
    searchBy: null,
    showTracking: false,
    showWarning: false,
    showTxn: false,
    showBundle: false,
    search: null,
    methodName: null,
    queryMethodName: null,
    containerFilter: 'all',

    searched: [],
    showDetailsDialog: false,
    theBar: true,

    inventoryType: null,
    inventoryQty: null,
    number: null,
    quantity: null,
    supplier: null,
    smartTrackTxnNo: null,
    tmLoadNo: null,
    bol: null,
    poNo: null,
    partNo: null,
    destinationServiceCenter: null,

    txnFrom: null,
    txnTo: null,
    txnHash: null,
    txnStatus: null,
    gasUsed: null,

    bundleHash: null,
    fileSize: null,
    fileName: null,
    imgData: null,
    fileData: null,
    mimetype: null,

    isImg: null,
    isFileUnavailable: null
  }),
  methods: {
    triggerSearch (category) {
      this.searchBar = []
      this.searchBy = 'Search by ' + category
      this.searchCategory = category
      this.search = ''
    },
    changefilter (filter) {
      this.search = null
      this.containerFilter = filter
      this.theBar = true
      this.searchCategory = null
      this.searchBy = null
      this.searchBar = false

      switch (filter) {
        case 'clean':
          this.getByCondition('shipCleanContainer')
          this.methodName = 'shipCleanContainer'
          break
        case 'withParts':
          this.getByCondition('shipContainerWithParts')
          this.methodName = 'shipContainerWithParts'
          break
        case 'dirty':
          this.getByCondition('shipDirtyContainer')
          this.methodName = 'shipDirtyContainer'
          break
        case 'recyeled':
          this.getByCondition('recycleContainer')
          this.methodName = 'recycleContainer'
          break
        case 'all':
          this.getRecords()
          break
      }
    },
    getByCondition (condition) {
      this.searched = null
      let self = this
      try {
        simbaApi.getData(condition)
          .then(function (response) {
            self.theBar = false
            self.searched = response.data.results
          })
      } catch (e) {
        this.errors.push(e)
      }
    },
    queryRecord (res) {
      this.showDetailsDialog = true
      this.cleanAll()
      this.findTxn(res.id)
    },
    cleanAll () {
      this.inventoryType = null
      this.inventoryQty = null
      this.number = null
      this.quantity = null
      this.supplier = null
      this.smartTrackTxnNo = null
      this.tmLoadNo = null
      this.bol = null
      this.poNo = null
      this.partNo = null
      this.destinationServiceCenter = null
      this.queryMethodName = null

      this.txnFrom = null
      this.txnTo = null
      this.txnHash = null
      this.txnStatus = null
      this.gasUsed = null

      this.bundleHash = null
      this.fileSize = null
      this.fileName = null
      this.imgData = null
      this.fileData = null
      this.mimetype = null

      this.isImg = null
      this.showBundle = false
      this.isFileUnavailable = null
    },
    findTxn (id) {
      let self = this
      try {
        simbaApi.getData('transaction/' + id + '/')
          .then(function (res) {
            self.queryMethodName = res.data.payload.method
            self.setBasic(res.data.payload.inputs)
            self.setFileBundle(id)
            if (res.data.receipt == null) {
              self.showTxn = false
            } else {
              self.setTxn(res)
            }
          })
      } catch (e) {
        this.errors.push(e)
      }
    },
    setBasic (obj) {
      for (let k in obj) {
        if (obj.hasOwnProperty(k)) {
          this[k] = obj[k]
        }
      }
    },
    setTxn (res) {
      this.showTxn = true
      this.txnFrom = res.data.receipt.from
      this.txnTo = res.data.receipt.to
      this.txnHash = res.data.receipt.transactionHash
      this.txnStatus = res.data.receipt.status
      this.gasUsed = res.data.receipt.gasUsed
    },
    setFileBundle (id) {
      if (id == null) {
        return
      }
      let self = this
      try {
        simbaApi.getData('transaction/' + id + '/bundle/')
          .then(function (res) {
            if (res.data.bundle_hash) {
              console.log(res)
              self.showBundle = true
              self.bundleHash = res.data.bundle_hash
              self.fileSize = res.data.manifest[0].size
              self.fileName = res.data.manifest[0].name
              self.mimetype = res.data.manifest[0].mimetype

              let isImg = (/\.(gif|jpg|jpeg|tiff|png)$/i).test(res.data.manifest[0].name)
              if (isImg) {
                self.isImg = true
                self.imgData = 'data:image/png;base64, ' + res.data.manifest[0].data
              }
              self.fileData = res.data.manifest[0].data
            } else {
              self.showBundle = false
            }
          })
      } catch (e) {
        this.errors.push(e)
        this.isFileUnavailable = true
      }
    },
    downloadToLocal () {
      let content = this.fileData
      let filename = this.fileName
      let mimeString = this.mimetype

      let decoded = b64toBlob(content, mimeString)

      let blob = new Blob([decoded])

      saveAs(blob, filename)
    },
    searchWithApi () {
      let self = this
      let url = null
      if (this.containerFilter === 'all') {
        url = 'transaction/?'
      } else {
        url = this.methodName + '/?'
      }
      try {
        simbaApi.getData(url + this.searchCategory + '_contains=' + this.search)
          .then(function (response) {
            self.searched = response.data.results
          })
      } catch (e) {
        this.errors.push(e)
      }
    },
    getRecords (e) {
      this.searched = []
      let self = this
      try {
        simbaApi.getData('transaction/?noContractTxn=1')
          .then(function (response) {
            self.theBar = false
            self.searched = response.data.results
          })
      } catch (e) {
        this.errors.push(e)
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
  .search-btn {
    margin-bottom: -8px;
    margin-left: 10px;
  }
  .detailsDialog {
    max-width: 600px;
  }
  .txn-details {
    margin: 15px;
  }
  .get-title {
    margin: 20px;
  }
  .options {
    margin-top: 40px;
  }
  .audit-table  {
    margin-top: 40px;
    height: 550px;
  }
  .md-field {
    max-width: 300px;
    height: auto;
  }
  .md-progress-bar {
    margin: 24px;
  }
  .loading {
    margin-left: 10px;
    text-align: center;
  }
  .dialog {
    min-height: 400px;
  }
  .break {
    word-break: break-all;
  }
  .api-bar {
    margin-top: -18px;
  }
  .search-bar {
    margin-left: 15px;
    margin-top: -10px;
    margin-right: 20px;
    margin-bottom: 10px;
  }
  .bundle-img {
    display: block;
    max-height:300px;
    width: auto;
    height: auto;
  }
</style>
