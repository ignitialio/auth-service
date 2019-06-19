<template>
  <div :id="id" class="auth-layout">
    <div class="tw-w-screen tw-h-screen
      tw-flex tw-flex-col tw-justify-center tw-items-center">
      <ig-paper class="md:tw-w-1/4 tw-h-1/4
        tw-flex tw-flex-col tw-items-center">
        {{ $t('Authentication service') }}
      </ig-paper>
    </div>
  </div>
</template>

<script>
export default {
  props: [ ],
  data: () => {
    return {
      id: 'auth_' + Math.random().toString(36).slice(2)
    }
  },
  computed: {

  },
  methods: {
  },
  mounted() {

  },
  beforeDestroy() {

  }
}
</script>

<style>
  .auth-layout {
    width: 100%;
    height: calc(100% - 0px);
  }
</style>
