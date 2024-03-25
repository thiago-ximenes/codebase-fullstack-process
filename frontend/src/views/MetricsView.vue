<template>
  <h1 class="text-5xl text-center text-white mb-6 pt-6">Métricas</h1>
  <h2 class="text-2xl text-center text-white mb-6">Monthly Recurring Revenue</h2>
  <div class="p-6 grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <div v-for="(metric, index) in mrr" :key="index" class="bg-white rounded-lg shadow-md p-6">
      <BarMetricsChart :metric="metric" :label="keys[index]"/>
    </div>
  </div>
    <h2 class="text-2xl text-center text-white mb-6">Churn Rate</h2>
  <div class="p-6 grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

    <div v-for="(metric, index) in cr" :key="index" class="bg-white rounded-lg shadow-md p-6">
      <LineMetricsChart :metric="metric" :label="keysCr[index]"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import BarMetricsChart from '@/components/BarMetricsChart.vue';
import LineMetricsChart from "@/components/LineMetricsChart.vue";
import { useMetricsStore } from "@/store/metrics.store";
import { watchEffect } from "vue";
import { useRouter } from "vue-router";

const metricsStore = useMetricsStore();
const router = useRouter();

watchEffect(() => {
  if (!Object.values(metricsStore.metrics).length) {
    router.push({ name: "Home" });
  }
});

const mrr = Object.values(metricsStore.metrics?.mrr || {})
const keys = Object.keys(metricsStore.metrics?.mrr || {})

const cr = Object.values(metricsStore.metrics?.cr || {})

const keysCr = Object.keys(metricsStore?.metrics.cr || {})

</script>