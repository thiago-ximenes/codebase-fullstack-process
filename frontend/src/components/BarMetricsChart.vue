<template>
  <Bar :data="chartData" :options="chartOptions"/>
</template>

<script lang="ts">
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
import type { MrrMetric } from "@/types/metrics.type";

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

export default {
  props: ['metric', 'label'],
  name: 'BarChart',
  components: { Bar },
  data() {
    return {
      chartData: {
        labels: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
        datasets: [
          {
            label: this.label,
            backgroundColor: [
              '#778beb',
              '#786fa6',
              '#63cdda',
              '#ea8685',
              '#cf6a87',
              '#e77f67',
              '#574b90',
              '#82ccdd',
              '#60a3bc',
              '#38ada9',
              '#b71540',
              '#e58e26'
            ],
            data: this.metric.flatMap((m: MrrMetric) => m.value),
          }
        ],
      },
      chartOptions: {
        plugins: {
          tooltip: {
            callbacks: {
              label: (context: any) => {
                return ` ${ this.metric.flatMap((m: MrrMetric) => m.displayValue)[context.dataIndex] }`;
              }
            }
          }
        }
      },
    }
  }
}
</script>