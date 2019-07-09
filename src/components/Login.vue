<template>
  <div>
    <div style="text-align: center;" class="md-layout md-gutter">
      <div class="md-layout-item md-large-size-25 md-medium-size-20 md-small-size-10 md-xsmall-size-0"></div>
      <md-card class="md-raised md-large-size-50 md-medium-size-60 md-small-size-80 md-xsmall-size-100 md-layout-item" id="card1">
        <div class="md-display-1" style="color: white;">Log In</div>
        <div class="md-layout md-gutter">
          <div class="md-layout-item md-size-100">
            <md-field>
              <label for="username">Username</label>
              <md-input name="username" id="username" v-model="username"/>
            </md-field>
          </div>
        </div>
        <div class="md-layout md-gutter">
          <div class="md-layout-item md-size-100">
            <md-field>
              <label for="password">Password</label>
              <md-input type="password" name="password" id="password" v-model="password"/>
            </md-field>
          </div>
        </div>
        <div>
          <md-button to="" class="md-accent md-raised" :disabled="!(username && password)" @click="submit()">Log In</md-button>
        </div>
      </md-card>
      <div class="md-layout-item md-large-size-25 md-medium-size-20 md-small-size-10 md-xsmall-size-0"></div>
    </div>
    <div class="errMessage" v-if="noUserMatch">
      <div class="md-body-2">There are no accounts with username '<strong>{{ wrong }}</strong>'</div>
    </div>
    <div class="errMessage" v-if="wrongPass">
      <div class="md-body-2">The password entered is incorrect</div>
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
      wrongPass: false
    }
  },

  methods: {
    submit () {
      var url = 'create_user/?username_exact=' + this.username
      this.noUserMatch = false
      this.wrongPass = false
      let self = this
      let parent = this.$parent.$parent.$parent.$parent
      try {
        simbaApi.getData(url)
          .then(function (response) {
            let results = response.data.results
            if (results.length != 1) {
              self.noUserMatch = true
              self.wrong = self.username
              return
            } else if (!(results[0].payload.inputs.password == self.password)) {
              self.wrongPass = true
              return
            } else {
              localStorage.setItem('loggedIn', true)
              parent.loggedIn = true
              localStorage.setItem('role', results[0].payload.inputs.role)
              localStorage.setItem('assetId', results[0].payload.inputs.assetId)
              self.$router.push('/post')
              return
            }
          })
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>

<style>
#card1 {
  margin: 0 auto; /* Added */
  float: none; /* Added */
  margin-bottom: 10px; /* Added */
  padding: 8px;
}

.errMessage {
  color: white;
  background-color: rgb(255, 79, 71);
  text-align: center;
  margin: 0 auto; /* Added */
  float: none; /* Added */
  margin-bottom: 10px; /* Added */
  width: 50%;
  border-radius: 15px;
}
</style>
