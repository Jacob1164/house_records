<template>
  <div>
    <div class="md-display-1 move" v-if="records[0]"><span style="color: white;">House Records:</span> {{ records[0].payload.inputs.addresss }} </div><br>
    <div class="md-layout-item" v-if="records[0]">
      <div class="md-layout md-gutter">
        <div class="md-layout-item md-size-66">
          <div v-for="record in records" v-bind:key="record.id">
            <md-card class="md-size-100 md-layout-item md-primary md-raised" md-with-hover>
              <div style="margin: 10px;">
                <div class="md-title" v-if="record.payload.method == 'new_house'">House Built</div>
                <div class="md-title" v-if="record.payload.method == 'house_sale'">House Sold</div>
                <div class="md-title" v-if="record.payload.method == 'accident'">Accident</div>
                <div class="md-title" v-if="record.payload.method == 'appraisal'">Appraisal</div>
                <div class="md-title" v-if="record.payload.method == 'improvement'">Home Improvement</div>
                <div class="md-caption">Transaction ID: {{ record.id }}</div>
                <div class=" md-body-2">
                  <div class="md-layout-item"><strong>Date:</strong> {{record.payload.inputs.date }}</div>
                  <div v-if="record.payload.method == 'new_house'"><strong>Builder:</strong> {{ record.payload.inputs.builder }}</div>
                  <div v-if="record.payload.method == 'house_sale'">
                    <div><strong>Price:</strong> {{ formatNumber(record.payload.inputs.price) }}</div>
                    <div><strong>New Owner:</strong> {{ record.payload.inputs.new_owner }}</div>
                    <div><strong>Previous Owner:</strong> {{ record.payload.inputs.prev_owner }}</div>
                    <div><strong>Real Estate Agent:</strong> {{ record.payload.inputs.real_estate_agent }}</div>
                  </div>
                  <div v-if="record.payload.method == 'accident'">
                    <div><strong>Incident:</strong> {{ record.payload.inputs.incident }}</div>
                    <div><strong>Estimated Damages:</strong> {{ formatNumber(record.payload.inputs.estimated_damages) }}</div>
                    <div><strong>Owner:</strong> {{ record.payload.inputs.owner }}</div>
                    <div><strong>Insurance Agent:</strong> {{ record.payload.inputs.insurance_agent }}</div>
                    <div><strong>Notes:</strong> {{ record.payload.inputs.notes }}</div>
                  </div>
                  <div v-if="record.payload.method == 'appraisal'">
                    <div><strong>House's Value:</strong> {{ formatNumber(record.payload.inputs.value) }}</div>
                    <div><strong>Inspector's Name:</strong> {{ record.payload.inputs.inspector }}</div>
                    <div><strong>Notes:</strong> {{ record.payload.inputs.notes }}</div>
                  </div>
                  <div v-if="record.payload.method == 'improvement'">
                    <div><strong>Improvement made:</strong> {{ record.payload.inputs.improvement }}</div>
                    <div><strong>Value Added:</strong> {{ formatNumber(record.payload.inputs.value_added) }}</div>
                    <div><strong>Owner:</strong> {{ record.payload.inputs.owner }}</div>
                    <div><strong>Notes:</strong> {{ record.payload.inputs.notes }}</div>
                  </div>
                </div>
                <md-card-actions>
                  <md-button class="md-icon-button" @click="openInfoDialog(record)">
                    <md-icon>info</md-icon>
                    <md-tooltip md-direction="left">Transaction Info</md-tooltip>
                  </md-button>
                </md-card-actions>
              </div>
            </md-card>
            <br>
          </div>
        </div>
        <div class="md-layout-item md-size-33">
          <div><img :src="img_url"/></div><br>
          <div><img :src="street_url"/></div>
        </div>
      </div>
    </div>
  <md-dialog :md-active.sync="showInfoDialog">
    <md-toolbar class="md-accent md-dense">
      <h3 class="md-title" style="flex: 1">Transaction Details</h3>
    </md-toolbar>
    <md-dialog-content>
      <br>
      <tree-view :data="infoData" :options="{maxDepth: 1}"></tree-view>
      <br>
    </md-dialog-content>
    <div>
      <md-button class="md-accent" @click="showInfoDialog = false">OK</md-button>
    </div>
  </md-dialog>
  </div>
</template>

<script>
/* eslint-disable */
import simbaApi from './gateways/simba-api'

export default {
  name: 'Records',

  data () {
    return {
      houseId: null,
      records: [],
      showInfoDialog: false,
      infoData: null,
      img_url: '',
      street_url: ''
    }
  },

  mounted () {
    this.houseId = this.$route.params.houseId
    let url = 'transaction/?assetId_exact=' + this.houseId
    let self = this
    try {
      simbaApi.getData(url)
        .then(function (response) {
          self.records = response.data.results

          // this little function to sort by date comes from Phrogz on Stack Overflow
          self.records.sort(function(a,b){
            return new Date(b.payload.inputs.date) - new Date(a.payload.inputs.date);
          })
          self.records = self.records.reverse()
          self.done()
        })
    } catch (e) {
      console.log(e)
    }
  },

  methods: {
    openInfoDialog (infoData) {
      this.showInfoDialog = true
      this.infoData = infoData
    },

    formatNumber (number) {
      var formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      })
      return formatter.format(number)
    },

    done () {
      var lat = 0
      var lng = 0
      if (this.records[0].payload.inputs.lat_neg){
        lat = (this.records[0].payload.inputs.lat * -1) / 10000000
      } else {
        lat = this.records[0].payload.inputs.lat / 10000000
      }
      if (this.records[0].payload.inputs.lng_neg){
        lng = (this.records[0].payload.inputs.lng * -1) / 10000000
      } else {
        lng = this.records[0].payload.inputs.lng / 10000000
      }
      this.img_url = 'https://maps.googleapis.com/maps/api/staticmap?center=' + this.records[0].payload.inputs.addresss +
      '&zoom=18&size=1600x1600&maptype=roadmap&markers=color:red%7Clabel:%7C' + lat + ',' + lng + '&key=AIzaSyBNGgSXjtrJCMkZaqoxo2KGDe-DdJUVMa0'
      this.street_url = 'https://maps.googleapis.com/maps/api/streetview?location=' + lat + ',' + lng + '&size=1600x1600&key=AIzaSyBNGgSXjtrJCMkZaqoxo2KGDe-DdJUVMa0'
    }
  }
}
</script>

<style>
.move {
  margin-left: 14px;
}
strong {
  color: rgb(0,232,0);
}
.tree-view-item-key {
  color: #ffd600;
}
.tree-view-item-value-string {
  color: #90caf9;
}
.tree-view-item-value-null {
  color: #f50057;
}
.tree-view-item-value-number {
  color: #00c853;
}
#map_pic {
  position: fixed;
  right: 10px;
  height: 50vh;
  width: 20vw;
}
</style>
