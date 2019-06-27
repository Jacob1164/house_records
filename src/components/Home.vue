<template>
  <div>
    <md-card class="md-alignment-center-center my-card" md-with-hover>
        <md-card-header>
          <div class="md-title">Quick Start</div>
          <div class="md-subhead">Select a party to begain</div>
        </md-card-header>

        <md-card-content>
          <div>
            <md-radio v-model="role" value="sc" v-on:change="changeRole"><strong>Service Center</strong></md-radio>
            <md-radio v-model="role" value="su" v-on:change="changeRole"><strong>Supplier</strong></md-radio>
            <md-radio v-model="role" value="mf" v-on:change="changeRole"><strong>Manufacturer</strong></md-radio>
          </div>
          <br>
          <br>
        </md-card-content>
    </md-card>
  </div>
</template>

<script>

export default {
  name: 'Home',
  data: () => ({
    role: null
  }),
  mounted () {
    if (localStorage.getItem('role')) {
      this.role = localStorage.getItem('role')
    }
  },
  methods: {
    changeRole () {
      localStorage.setItem('role', this.role)
    }
  }
}
</script>

<style lang="css" scoped>
  .my-card {
    margin-top: 40px;
    width: 250px;
    display: inline-block;
    vertical-align: top;
    margin-bottom: 20px;
  }
</style>
