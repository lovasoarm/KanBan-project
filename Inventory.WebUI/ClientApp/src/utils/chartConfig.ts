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

// Configuration globale pour optimiser les performances
export const setupChartDefaults = (): void => {
  // Activer des animations simples
  ChartJS.defaults.animation = {
    duration: 800,
    easing: 'easeInOutQuart'
  };
  ChartJS.defaults.responsive = true;
  ChartJS.defaults.maintainAspectRatio = false;
  
  // Configuration des plugins par défaut
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

  // Configuration des échelles par défaut
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

// Options de base réutilisables pour tous les graphiques
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

// Options spécifiques pour les graphiques en barres
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

// Options spécifiques pour les graphiques en lignes
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

// Enregistrer les composants Chart.js nécessaires
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
