<script setup lang="ts">
import { ref } from 'vue'
import AppointmentList from '@/pagesMember/appointment/component/AppointmentList.vue'

const list = ref(['申请中', '待参观', '已参观', '已取消', '未通过'])

const curNow = ref(0)

// 定义方法，注意在 setup 中不需要 this，直接访问响应式引用
function sectionChange(index) {
  curNow.value = index
}
</script>

<template>
  <template>
    <up-subsection :list="list" :current="curNow" @change="sectionChange"></up-subsection>
  </template>
  <!--  预约列表-->
  <AppointmentList :status="curNow"></AppointmentList>
</template>

<style scoped lang="scss"></style>
