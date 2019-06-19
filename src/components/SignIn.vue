<template>
  <transition name="fade">
    <div :id="id" class="login-layout">
      <div v-if="ready" class="tw-w-screen tw-h-screen
        tw-flex tw-flex-col tw-justify-center tw-items-center">
        <ig-paper class="md:tw-w-1/4 tw-h-1/4
          tw-flex tw-flex-col tw-items-center">
          <div class="tw-font-medium tw-text-gray-700 tw-select-none
            tw-p-2 tw-w-full tw-text-center md:tw-text-left">{{ $t('Sign in') }}</div>

          <ig-input :label="$t('Username')"
            v-model="username"></ig-input>
          <ig-input :label="$t('Password')"
            v-model="password" type="password"></ig-input>

          <div class="tw-flex tw-w-full tw-justify-center tw-items-center">
            <button class="focus:tw-outline-none tw-m-2 tw-p-1 tw-px-4
              tw-bg-yellow-600 tw-text-white
              hover:tw-bg-yellow-700 active:tw-bg-yellow-900
              tw-shadow active:tw-shadow-none
              tw-rounded"
              :class="{ 'tw-opacity-50': !validationAuthorized }"
              :disabled="!validationAuthorized"
              @click="handleApplyClick">
              {{ $t('Apply') }}</button>
            <button class="focus:tw-outline-none tw-m-2 tw-p-1 tw-px-4
              tw-text-sm
              tw-text-gray-700 hover:tw-text-yellow-700 active:tw-text-yellow-900">
              {{ $t('Sign up') }}</button>
          </div>
        </ig-paper>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: [ ],
  data: () => {
    return {
      id: 'auth_' + Math.random().toString(36).slice(2),
      ready: false,
      username: null,
      password: null
    }
  },
  computed: {
    validationAuthorized() {
      return this.username && this.password &&
        this.username !== '' && this.password !== ''
    }
  },
  methods: {
    handleApplyClick() {
      this.$services.auth.signin(this.username, this.password).then(token => {
        this.$services.emit('signin', token)
        console.log(token)
      }).catch(err => console.log(err))
    },
    handleSignUpClick() {
      this.$router.push('/signup')
    }
  },
  mounted() {
    this.ready = true
  },
  beforeDestroy() {

  }
}
</script>

<style>
.login-layout {
  width: 100%;
  height: calc(100% - 0px);
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 1s;
}

.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
