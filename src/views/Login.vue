<template>
  <div class="auth-view">
    <div class="b-form login">
      <el-form :model="loginForm">
      <el-form-item label="Имя">
        <el-input v-model="loginForm.name"></el-input>
      </el-form-item>
      <el-form-item label="Email">
        <el-input v-model="loginForm.email"></el-input>
      </el-form-item>
      <el-form-item label="Пароль">
        <el-input v-model="loginForm.password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit(loginForm)">Войти</el-button>
      </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { _setToken } from './../services/auth.js'
export default {
  name: 'login',
  data () {
    return {
      loginForm: {
        name: '',
        email: '',
        password: ''
      }
    }
  },
  methods: {
    onSubmit (form) {
      this.$http.post('/token', form)
      .then(res => {
        localStorage.setItem('id_token', JSON.stringify(res.data))
      })
      .catch(err => console.log(err))
    }
  }
}
</script>

<style lang="stylus" scoped>
  .auth-view
    height 100%
    width 100%
    background-color #7a97ab2b;
    display flex
    justify-content center
    .b-form
      background-color #fff
      max-width: 500px
      min-width: 400px
      max-height 390px
      box-shadow: 0 0 3px rgba(31, 14, 148, 0.39)
      padding: 20px
</style>
