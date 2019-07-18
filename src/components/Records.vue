<template>
  <div>
    <div class="row post-card1 align-middle" v-if="records[0]"><h1 class="post-card" v-if="records[0]">House Records: {{ records[0].payload.inputs.addresss }} </h1><b-button style="height: 40px; position: relative; top: 13px;" class="align-middle" v-b-tooltip.hover title="House Info" pill variant="outline-secondary" @click="info = !info">
      <img class="icon" src="./icons/info.svg" alt="info">
    </b-button></div><br>
    <div v-if="records[0]">
      <div class="row post-card">
        <div><b-dropdown class="col-12 col-sm-5 col-md-4 col-lg-3" id="filterby" :text="'Filter By: ' + filter" variant="primary">
          <b-dropdown-item @click="changeFilter('a')">All</b-dropdown-item>
          <b-dropdown-item @click="changeFilter('s')">House Sales</b-dropdown-item>
          <b-dropdown-item @click="changeFilter('ap')">Appraisals</b-dropdown-item>
          <b-dropdown-item @click="changeFilter('ac')">Accidents</b-dropdown-item>
          <b-dropdown-item @click="changeFilter('r')">Renovations</b-dropdown-item>
        </b-dropdown></div>
        <br class="d-block d-sm-none"><br class="d-block d-sm-none">
        <b-input-group class="col-10 col-sm-7 col-md-6 col-lg-6">
          <b-dropdown id="searchType" :text="searchType + ':'" slot="prepend" variant="primary">
            <b-dropdown-item @click="searchType = 'Name'">Name</b-dropdown-item>
            <b-dropdown-item @click="searchType = 'Price'">Price</b-dropdown-item>
            <b-dropdown-item @click="searchType = 'Date'">Date</b-dropdown-item>
          </b-dropdown>
          <b-form-input v-model="query" placeholder="Filter your search" v-if="searchType != 'Price'"></b-form-input>
          <b-form-input v-model="query" placeholder="Filter your search" type="number" v-else></b-form-input>
        </b-input-group>
        <b-button class="float-right" v-b-tooltip.hover title="Expand all" pill variant="outline-secondary" v-on:click="expandAll()">
          <img class="icon" src="./icons/expand-down.svg" alt="info">
        </b-button>
      </div>
      <div class="row post-card">
        <div class="col-xl-8 col-lg-8 col-md-8 col-sm-8 col-12" v-if="displays[0]">
          <div v-for="display in displays" v-bind:key="display.id">
            <b-card class="col-12" bg-variant="light">
              <div class="row">
                <div class="col-10">
                  <h3 v-if="display.payload.method == 'new_house'">House Built</h3>
                  <h3 v-if="display.payload.method == 'house_sale'">House Sold</h3>
                  <h3 v-if="display.payload.method == 'accident'">Accident</h3>
                  <h3 v-if="display.payload.method == 'appraisal'">Appraisal</h3>
                  <h3 v-if="display.payload.method == 'improvement'">Home Improvement</h3>
                </div>
                <div class="col-2">
                  <b-button class="float-right" v-b-tooltip.hover title="Details" pill variant="outline-secondary" v-on:click="expand(display.id)">
                    <img class="icon" src="./icons/expand-down.svg" alt="info">
                  </b-button>
                </div>
              </div>
              <small>Transaction ID: {{ display.id }}</small>
              <div>
                <div><strong>Date:</strong> {{display.payload.inputs.date }}</div>
                <b-collapse :id="display.id">
                  <div v-if="display.payload.method == 'new_house'"><strong>Builder:</strong> {{ display.payload.inputs.builder }}</div>
                  <div v-if="display.payload.method == 'house_sale'">
                    <div><strong>Price:</strong> {{ formatNumber(display.payload.inputs.price) }}</div>
                    <div><strong>New Owner:</strong> {{ display.payload.inputs.new_owner }}</div>
                    <div><strong>Previous Owner:</strong> {{ display.payload.inputs.prev_owner }}</div>
                    <div><strong>Real Estate Agent:</strong> {{ display.payload.inputs.real_estate_agent }}</div>
                  </div>
                  <div v-if="display.payload.method == 'accident'">
                    <div><strong>Incident:</strong> {{ display.payload.inputs.incident }}</div>
                    <div><strong>Estimated Damages:</strong> {{ formatNumber(display.payload.inputs.estimated_damages) }}</div>
                    <div><strong>Owner:</strong> {{ display.payload.inputs.owner }}</div>
                    <div><strong>Insurance Agent:</strong> {{ display.payload.inputs.insurance_agent }}</div>
                    <div><strong>Notes:</strong> {{ display.payload.inputs.notes }}</div>
                  </div>
                  <div v-if="display.payload.method == 'appraisal'">
                    <div><strong>House's Value:</strong> {{ formatNumber(display.payload.inputs.value) }}</div>
                    <div><strong>Inspector's Name:</strong> {{ display.payload.inputs.inspector }}</div>
                    <div><strong>Notes:</strong> {{ display.payload.inputs.notes }}</div>
                  </div>
                  <div v-if="display.payload.method == 'improvement'">
                    <div><strong>Improvement made:</strong> {{ display.payload.inputs.improvement }}</div>
                    <div><strong>Value Added:</strong> {{ formatNumber(display.payload.inputs.value_added) }}</div>
                    <div><strong>Notes:</strong> {{ display.payload.inputs.notes }}</div>
                  </div>
                  <div class="float-right">
                    <b-button class="float-right" v-b-tooltip.hover title="Transaction Info" pill variant="outline-secondary" @click="openInfoDialog(display)">
                      <img class="icon" src="./icons/info.svg" alt="info">
                    </b-button>
                  </div>
                </b-collapse>
              </div>
            </b-card>
            <br>
          </div>
        </div>
        <div class="col-xl-8 col-lg-8 col-md-8 col-sm-8 col-12" v-if="!displays[0]">
          <h3>There are no results matching your search :(</h3>
        </div>
        <div class="col-xl-4 col-lg-4 col-md-4 col-sm-4 col-12">
          <div><img :src="img_url"/></div><br>
          <div><img :src="street_url"/></div>
        </div>
      </div>
    </div>
    <b-modal v-model="showInfoDialog" title="Transaction Details" :ok-only="true">
      <tree-view :data="infoData" :options="{maxDepth: 1}"></tree-view>
    </b-modal>
    <b-modal v-if="!recentReno" v-model="info" title="House Info" :ok-only="true">
      <div>
        <div><strong># of Bedrooms:</strong> {{ displays[0].payload.inputs.bedrooms }}</div>
        <div><strong># of Bathrooms:</strong> {{ displays[0].payload.inputs.bathrooms }}</div>
        <div><strong>Square Footage:</strong> {{ displays[0].payload.inputs.area }}</div>
        <div><strong># of Acres on Property:</strong> {{ displays[0].payload.inputs.acres }}</div>
      </div>
    </b-modal>
    <b-modal v-else v-model="info" title="House Info" :ok-only="true">
      <div>
        <div><strong># of Bedrooms:</strong> {{ recentReno.payload.inputs.bedrooms }}</div>
        <div><strong># of Bathrooms:</strong> {{ recentReno.payload.inputs.bathrooms }}</div>
        <div><strong>Square Footage:</strong> {{ recentReno.payload.inputs.area }}</div>
        <div><strong># of Acres on Property:</strong> {{ recentReno.payload.inputs.acres }}</div>
      </div>
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
      info: false,
      recentReno: null,
      filter: 'All',
      filterCode: 'a',
      searchType: 'Name',
      query: null
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
          self.recentReno = self.records.find((result) => {
            return result.payload.method == 'improvement'
          })
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
    expand (id) {
      this.$root.$emit('bv::toggle::collapse', id)
    },

    expandAll () {
      for (let i = 0; i < this.ids.length; i++) {
        this.expand(this.ids[i])
      }
    },

    openInfoDialog (infoData) {
      this.showInfoDialog = true
      this.infoData = infoData
    },

    changeFilter (code) {
      this.filterCode = code
      switch (code) {
        case 'a':
          this.filter = 'All'
          break
        case 's':
          this.filter = 'House Sales'
          this.filterCode = 'house_sale'
          break
        case 'ap':
          this.filter = 'Appraisals'
          this.filterCode = 'appraisal'
          break
        case 'ac':
          this.filter = 'Accidents'
          this.filterCode = 'accident'
          break
        case 'r':
          this.filter = 'Renovations'
          this.filterCode = 'improvement'
      }
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
  },

  computed: {
    displays: function () {
      let type = []
      let self = this
      if (!self.query || self.query == '') {
        for (let i = 0; i < self.records.length; i++) {
          if (self.filter == 'All') {
            type.push(self.records[i])
          } else if (self.filterCode == self.records[i].payload.method) {
            type.push(self.records[i])
          }
        }
      } else if (self.searchType == 'Name') {
        for (let j = 0; j < self.records.length; j++) {
          if (self.filterCode == 'a') {
            if (self.records[j].payload.method == 'house_sale') {
              if (self.records[j].payload.inputs.new_owner.toLowerCase().includes(self.query.toLowerCase()) || self.records[j].payload.inputs.prev_owner.toLowerCase().includes(self.query.toLowerCase()) || self.records[j].payload.inputs.real_estate_agent.toLowerCase().includes(self.query.toLowerCase())) {
                type.push(self.records[j])
              }
            } else if (self.records[j].payload.method == 'appraisal') {
              if (self.records[j].payload.inputs.inspector.toLowerCase().includes(self.query.toLowerCase())) {
                type.push(self.records[j])
              }
            } else if (self.records[j].payload.method == 'accident') {
              if (self.records[j].payload.inputs.owner.toLowerCase().includes(self.query.toLowerCase())) {
                type.push(self.records[j])
              }
            } else if (self.records[j].payload.method == 'new_house') {
              if (self.records[j].payload.inputs.builder.toLowerCase().includes(self.query.toLowerCase())) {
                type.push(self.records[j])
              }
            }
          } else if (self.filterCode == 'house_sale') {
            if (self.records[j].payload.method == self.filterCode && (self.records[j].payload.inputs.new_owner.toLowerCase().includes(self.query.toLowerCase()) || self.records[j].payload.inputs.prev_owner.toLowerCase().includes(self.query.toLowerCase()) || self.records[j].payload.inputs.real_estate_agent.toLowerCase().includes(self.query.toLowerCase()))) {
              type.push(self.records[j])
            }
          } else if (self.filterCode == 'appraisal') {
            if (self.records[j].payload.method == self.filterCode && (self.records[j].payload.inputs.inspector.toLowerCase().includes(self.query.toLowerCase()))) {
              type.push(self.records[j])
            }
          } else if (self.filterCode == 'accident') {
            if (self.records[j].payload.method == self.filterCode && (self.records[j].payload.inputs.owner.toLowerCase().includes(self.query.toLowerCase()))) {
              type.push(self.records[j])
            }
          } else if(self.filterCode != 'improvement') {
            if (self.records[j].payload.method == self.filterCode && (self.records[j].payload.inputs.builder.toLowerCase().includes(self.query.toLowerCase()))) {
              type.push(self.records[j])
            }
          }
        }
      } else if (self.searchType == 'Date') {
          for (let k = 0; k < self.records.length; k++) {
            if (self.records[k].payload.inputs.date.toLowerCase().includes(self.query.toLowerCase())) {
              type.push(self.records[k])
            }
          }
      } else {
        for (let l = 0; l < self.records.length; l++) {
          if (self.filterCode == 'a') {
            if (self.records[l].payload.method == 'house_sale') {
              if (self.records[l].payload.inputs.price.toString().includes(self.query.toString())) {
                type.push(self.records[l])
              }
            } else if (self.records[l].payload.method == 'appraisal') {
              if (self.records[l].payload.inputs.value.toString().includes(self.query.toString())) {
                type.push(self.records[l])
              }
            } else if (self.records[l].payload.method == 'accident') {
              if (self.records[l].payload.inputs.estimated_damages.toString().includes(self.query.toString())) {
                type.push(self.records[l])
              }
            } else if (self.records[l].payload.method == 'improvement') {
              if (self.records[l].payload.inputs.value_added.toString().includes(self.query.toString())) {
                type.push(self.records[l])
              }
            }
          } else if (self.filterCode == 'house_sale') {
            if (self.records[l].payload.method == self.filterCode && (self.records[l].payload.inputs.price.toString().includes(self.query.toString()))) {
              type.push(self.records[l])
            }
          } else if (self.filterCode == 'appraisal') {
            if (self.records[l].payload.method == self.filterCode && (self.records[l].payload.inputs.value.toString().includes(self.query.toString()))) {
              type.push(self.records[l])
            }
          } else if (self.filterCode == 'accident') {
            if (self.records[l].payload.method == self.filterCode && (self.records[l].payload.inputs.estimated_damages.toString().includes(self.query.toString()))) {
              type.push(self.records[l])
            }
          } else if(self.filterCode == 'improvement') {
            if (self.records[l].payload.method == self.filterCode && (self.records[l].payload.inputs.value_added.toString().includes(self.query.toString()))) {
              type.push(self.records[l])
            }
          }
        }
      }
      return type
    },

    ids: function () {
      let ids = []
      for (let i = 0; i < this.displays.length; i++) {
        ids.push(this.displays[i].id)
      }
      return ids
    }
    }
  }
</script>

<style>
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
.post-card {
  margin: 10px;
}
.post-card1 {
  margin-left: 25px;
}
img {
  width: 100%;
  height: auto;
}
.icon {
  width: 17px;
  height: 17px;
}
</style>
