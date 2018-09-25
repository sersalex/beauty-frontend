<template>
  <form>
    <input type="text" name="name" placeholder="name">
    <input type="text" name="email" placeholder="email">
    <input type="text" name="password" placeholder="password">
    <input @click="login" type="button" value="Регистрация">
  </form>
</template>

<script>
import { _setToken } from './../services/auth.js'
export default {
  name: 'login',
  data () {
    return {
      form: {
        name: '',
        email: '',
        password: ''
      }
    }
  },
  methods: {
    login (form) {
      this.$http.post('/token', form)
      .then(res => {
        _setToken(res.data.)
        console.log('RESPONSE', res)
      })
      .catch(err => alert(err))
    }
  }
}
</script>

<style>

</style>
