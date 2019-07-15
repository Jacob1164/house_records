<template>
  <div>
    <div class="row text-center">
      <div class="col-xl-3 col-lg-3 col-md-2 col-sm-1 col-0"></div>
      <div class="col-xl-6 col-lg-6 col-md-8 col-sm-10 col-12">
        <b-card bg-variant="light" class="post-card" title="Log In">
          <div class="row">
            <div class="col-12">
              <b-form-group description="Username">
                <b-form-input name="username" id="username" v-model="username"/>
              </b-form-group>
            </div>
          </div>
          <div class="row">
            <div class="col-12">
              <b-form-group description="Password">
                <b-form-input type="password" name="password" id="password" v-model="password"/>
              </b-form-group>
            </div>
          </div>
          <b-button variant="outline-primary" v-if="!(username && password)" @click="submit()" disabled>Log In</b-button>
          <b-button variant="primary" v-if="(username && password)" @click="submit()">Log In</b-button>
        </b-card>
        <b-spinner variant="primary" v-if="loading" label="Loading..."></b-spinner>
        <b-alert v-model="noUserMatch" dismissible variant="danger">There are no accounts with username '<strong>{{ wrong }}</strong>'.</b-alert>
        <b-alert v-model="wrongPass" dismissible variant="danger">The password entered is incorrect.</b-alert>
      </div>
      <div class="col-md-auto"></div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import simbaApi from './gateways/simba-api'
import { localstorage } from './mixins/localstorage'

export default {
  name: 'Login',
  mixins: [localstorage],

  data () {
    return {
      method: null,
      username: null,
      password: null,
      results: null,
      noUserMatch: false,
      wrong: null,
      wrongPass: false,
      loading: false
    }
  },

  mounted () {
  },

  methods: {
    submit () {
      this.loading = true
      var url = 'create_user/?username_exact=' + this.username
      var passwordHash = require('password-hash')
      this.noUserMatch = false
      this.wrongPass = false
      let self = this
      let parent = this.$parent
      try {
        simbaApi.getData(url)
          .then(function (response) {
            let results = response.data.results
            self.loading = false
            if (results.length != 1) {
              self.noUserMatch = true
              self.wrong = self.username
              return
            } else if (!(passwordHash.verify(self.password, results[0].payload.inputs.password))) {
              self.wrongPass = true
              return
            } else {
              localStorage.setItem('loggedIn', true)
              parent.loggedIn = true
              parent.accountInfo.first = results[0].payload.inputs.first
              parent.accountInfo.last = results[0].payload.inputs.last
              parent.accountInfo.email = results[0].payload.inputs.email
              parent.accountInfo.role = results[0].payload.inputs.role
              localStorage.setItem('role', results[0].payload.inputs.role)
              localStorage.setItem('assetId', results[0].payload.inputs.assetId)
              self.$router.push('/post')
              return
            }
          })
      } catch (e) {
        console.log(e)
        self.loading = false
      }
    }
  }
}
</script>

<style>
.post-card {
  margin: 10px;
}
</style>
