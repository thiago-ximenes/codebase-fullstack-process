<template>
  <Line :data="chartData" :options="chartOptions"/>
</template>

<script lang="ts">
import { Line } from 'vue-chartjs'
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip
} from 'chart.js'
import type { CrMetric } from "@/types/metrics.type";

ChartJS.register(Title, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement)

export default {
  props: ['metric', 'label'],
  name: 'BarChart',
  // eslint-disable-next-line vue/no-reserved-component-names
  components: { Line },
  data() {
    return {
      chartData: {
        labels: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
        datasets: [
          {
            label: this.label,
            data: this.metric.flatMap((m: CrMetric) => Number(m.rate.replace('%', '').replace(',', '.'))),
            backgroundColor: '#778beb',
          }
        ],
      },
      chartOptions: {
        plugins: {
          tooltip: {
            callbacks: {
              label: (context: any) => {
                return ` ${ this.metric.flatMap((m: CrMetric) => m.rate)[context.dataIndex] }`;
              }
            }
          }
        }
      },
    }
  }
}
</script>