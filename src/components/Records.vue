<template>
  <div>
    <h1 class="md-size-80 post-card" v-if="records[0]">House Records: {{ records[0].payload.inputs.addresss }} </h1><br>
    <div v-if="records[0]">
      <div class="row post-card">
        <div class="col-8">
          <div v-for="record in records" v-bind:key="record.id">
            <b-card class="col-12" bg-variant="light">
              <h3 v-if="record.payload.method == 'new_house'">House Built</h3>
              <h3 v-if="record.payload.method == 'house_sale'">House Sold</h3>
              <h3 v-if="record.payload.method == 'accident'">Accident</h3>
              <h3 v-if="record.payload.method == 'appraisal'">Appraisal</h3>
              <h3 v-if="record.payload.method == 'improvement'">Home Improvement</h3>
              <small>Transaction ID: {{ record.id }}</small>
              <div>
                <div><strong>Date:</strong> {{record.payload.inputs.date }}</div>
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
              <div class="float-right">
                <b-button class="float-right" v-b-tooltip.hover title="Transaction Info" pill variant="outline-secondary" @click="openInfoDialog(record)">
                  <img class="icon" src="./icons/info.svg" alt="info">
                </b-button>
              </div>
            </b-card>
            <br>
          </div>
        </div>
        <div class="col-4">
          <h6 v-if="!claimed">This house is not currently claimed. Login as a home owner to claim this house if you own it.</h6>
          <h6 v-if="claimed">This house has been claimed by its owner.</h6><br>
          <div><img :src="img_url"/></div><br>
          <div><img :src="street_url"/></div>
        </div>
      </div>
    </div>
    <b-modal v-model="showInfoDialog" title="Transaction Details" :ok-only="true">
      <tree-view :data="infoData" :options="{maxDepth: 1}"></tree-view>
    </b-modal>
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
      street_url: '',
      claimed: 0
    }
  },

  mounted () {
    this.houseId = this.$route.params.houseId
    let url = 'transaction/?assetId_exact=' + this.houseId + '&method!=claim'
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

    let url2 = 'transaction/?method=claim&house_assetId_exact=' + this.houseId
    try {
      simbaApi.getData(url2)
        .then(function (response) {
          if (response.data.results.length != 0) {
            self.claimed = response.data.results[0].payload.inputs.active
          }
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
.tree-view-item-key {
  color: rgb(0, 108, 255);
}
.tree-view-item-value-string {
  color: rgb(51, 58, 65);
}
.tree-view-item-value-null {
  color: #f50057;
}
.tree-view-item-value-number {
  color: rgb(0, 175, 59);
}
#map_pic {
  position: fixed;
  right: 10px;
  height: 50vh;
  width: 20vw;
}
.post-card {
  margin: 10px;
}
img {
  width: 100%;
  height: auto;
}
.icon {
  width: 17px;
  height: 17px;
  fill: green;
}
</style>
