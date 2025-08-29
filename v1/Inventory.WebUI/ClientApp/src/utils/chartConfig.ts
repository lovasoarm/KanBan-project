import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  ArcElement,
} from 'chart.js';

export const setupChartDefaults = (): void => {
  ChartJS.defaults.animation = {
    duration: 800,
    easing: 'easeInOutQuart'
  };
  ChartJS.defaults.responsive = true;
  ChartJS.defaults.maintainAspectRatio = false;
  
  ChartJS.defaults.plugins.legend = {
    ...ChartJS.defaults.plugins.legend,
    labels: {
      usePointStyle: true,
      pointStyle: 'circle',
      font: { size: 12, family: 'Inter' }
    }
  };

  ChartJS.defaults.plugins.tooltip = {
    ...ChartJS.defaults.plugins.tooltip,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    titleColor: '#FFFFFF',
    bodyColor: '#FFFFFF',
    cornerRadius: 8,
    displayColors: false,
    animation: false
  };

  ChartJS.defaults.scales = {
    ...ChartJS.defaults.scales,
    x: {
      grid: { display: false },
      ticks: { font: { size: 12, family: 'Inter' } }
    },
    y: {
      grid: { color: '#E9EEF2' },
      ticks: { font: { size: 12, family: 'Inter' } }
    }
  };
};

export const baseChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    duration: 800,
    easing: 'easeInOutQuart'
  },
  animations: {
    colors: {
      type: 'color',
      duration: 800,
      from: 'transparent'
    },
    x: {
      type: 'number',
      easing: 'easeInOutQuart',
      duration: 800,
      from: (ctx: any) => ctx.index === 0 ? ctx.chart.scales.x.getPixelForValue(ctx.index) : null
    },
    y: {
      type: 'number',
      easing: 'easeInOutQuart', 
      duration: 800,
      from: (ctx: any) => ctx.chart.scales.y.getPixelForValue(0)
    }
  },
  transitions: {
    active: {
      animation: {
        duration: 200
      }
    },
    resize: {
      animation: {
        duration: 0
      }
    }
  },
  interaction: {
    mode: 'index' as const,
    intersect: false
  }
};

export const barChartOptions = {
  ...baseChartOptions,
  plugins: {
    legend: {
      position: 'top' as const,
    },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { font: { size: 12, family: 'Inter' } }
    },
    y: {
      beginAtZero: true,
      grid: { color: '#E9EEF2' },
      ticks: { font: { size: 12, family: 'Inter' } }
    }
  }
};

export const lineChartOptions = {
  ...baseChartOptions,
  elements: {
    point: {
      radius: 4,
      hoverRadius: 6,
    },
    line: {
      tension: 0.4
    }
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { font: { size: 12, family: 'Inter' } }
    },
    y: {
      beginAtZero: true,
      grid: { color: '#E9EEF2' },
      ticks: { font: { size: 12, family: 'Inter' } }
    }
  }
};

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

