import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { 
  LineChart, Line, Area, AreaChart, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, ReferenceLine 
} from 'recharts';
import { 
  TrendingUp, TrendingDown, Activity, Zap, AlertTriangle, 
  Calendar, Target, Brain, ChartLine, Lightbulb 
} from 'lucide-react';

// Données historiques simulées
const historicalData = [
  { month: 'Jan 23', actual: 85000, trend: 82000, seasonal: 78000 },
  { month: 'Fév 23', actual: 92000, trend: 88000, seasonal: 85000 },
  { month: 'Mar 23', actual: 98000, trend: 94000, seasonal: 92000 },
  { month: 'Avr 23', actual: 105000, trend: 102000, seasonal: 98000 },
  { month: 'Mai 23', actual: 112000, trend: 108000, seasonal: 105000 },
  { month: 'Jun 23', actual: 125000, trend: 118000, seasonal: 115000 },
  { month: 'Jul 23', actual: 135000, trend: 128000, seasonal: 125000 },
  { month: 'Aoû 23', actual: 142000, trend: 138000, seasonal: 135000 },
  { month: 'Sep 23', actual: 138000, trend: 145000, seasonal: 140000 },
  { month: 'Oct 23', actual: 155000, trend: 152000, seasonal: 148000 },
  { month: 'Nov 23', actual: 168000, trend: 162000, seasonal: 158000 },
  { month: 'Déc 23', actual: 185000, trend: 175000, seasonal: 170000 }
];

// Prévisions simulées
const forecastData = [
  { month: 'Jan 24', prediction: 195000, confidence: 0.92, lower: 185000, upper: 205000 },
  { month: 'Fév 24', prediction: 205000, confidence: 0.89, lower: 192000, upper: 218000 },
  { month: 'Mar 24', prediction: 215000, confidence: 0.87, lower: 198000, upper: 232000 },
  { month: 'Avr 24', prediction: 225000, confidence: 0.85, lower: 205000, upper: 245000 },
  { month: 'Mai 24', prediction: 238000, confidence: 0.82, lower: 215000, upper: 261000 },
  { month: 'Jun 24', prediction: 252000, confidence: 0.80, lower: 225000, upper: 279000 }
];

// Indicateurs de tendance
const trendIndicators = [
  {
    title: 'Croissance Tendancielle',
    value: '+15.2%',
    confidence: 92,
    direction: 'up',
    description: 'Progression annuelle prévue',
    icon: TrendingUp,
    color: 'green'
  },
  {
    title: 'Volatilité',
    value: '8.5%',
    confidence: 87,
    direction: 'stable',
    description: 'Écart-type mensuel',
    icon: Activity,
    color: 'blue'
  },
  {
    title: 'Saisonnalité',
    value: 'Forte',
    confidence: 94,
    direction: 'up',
    description: 'Pic automne-hiver',
    icon: Calendar,
    color: 'orange'
  },
  {
    title: 'Momentum',
    value: 'Positif',
    confidence: 89,
    direction: 'up',
    description: 'Accélération détectée',
    icon: Zap,
    color: 'purple'
  }
];

// Alertes et recommandations
const insights = [
  {
    type: 'opportunity',
    title: 'Opportunité de Croissance',
    description: 'Le modèle prévoit une forte demande en Q2 2024 (+18% vs 2023)',
    impact: 'Élevé',
    action: 'Augmenter les stocks de 25% avant avril',
    confidence: 0.87
  },
  {
    type: 'warning',
    title: 'Risque Saisonnier',
    description: 'Baisse probable en août (-12% vs pic estival)',
    impact: 'Moyen',
    action: 'Planifier des promotions pour maintenir les ventes',
    confidence: 0.91
  },
  {
    type: 'trend',
    title: 'Nouvelle Tendance Détectée',
    description: 'Accélération de la croissance digitale (+45% e-commerce)',
    impact: 'Élevé',
    action: 'Renforcer la stratégie omnicanale',
    confidence: 0.94
  }
];

// Données combinées historique + prévision
const combinedData = [
  ...historicalData.map(d => ({ ...d, type: 'historical' })),
  ...forecastData.map(d => ({ ...d, type: 'forecast' }))
];

export const TrendsForecasting: React.FC = () => {
  const [selectedModel, setSelectedModel] = useState('arima');
  const [forecastHorizon, setForecastHorizon] = useState('6m');
  const [selectedMetric, setSelectedMetric] = useState('sales');

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-4 border rounded-lg shadow-lg">
          <p className="font-medium mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {`${entry.name}: ${entry.value?.toLocaleString()}€`}
            </p>
          ))}
          {data.confidence && (
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Confiance: {(data.confidence * 100).toFixed(0)}%
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header avec contrôles */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Tendances & Prévisions
        </h2>
        <div className="flex items-center space-x-4">
          <Select value={selectedModel} onValueChange={setSelectedModel}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Modèle" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="arima">ARIMA</SelectItem>
              <SelectItem value="prophet">Prophet</SelectItem>
              <SelectItem value="lstm">LSTM</SelectItem>
              <SelectItem value="ensemble">Ensemble</SelectItem>
            </SelectContent>
          </Select>

          <Select value={forecastHorizon} onValueChange={setForecastHorizon}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Horizon" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3m">3 mois</SelectItem>
              <SelectItem value="6m">6 mois</SelectItem>
              <SelectItem value="1y">1 année</SelectItem>
              <SelectItem value="2y">2 années</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline">
            <Brain className="w-4 h-4 mr-2" />
            Recalculer
          </Button>
        </div>
      </div>

      {/* Indicateurs de tendance */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {trendIndicators.map((indicator, index) => (
          <motion.div
            key={indicator.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {indicator.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {indicator.value}
                    </p>
                  </div>
                  <div className={`p-2 bg-${indicator.color}-100 dark:bg-${indicator.color}-900/20 rounded-lg`}>
                    <indicator.icon className={`w-6 h-6 text-${indicator.color}-600 dark:text-${indicator.color}-400`} />
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {indicator.description}
                  </span>
                  <div className="flex items-center">
                    <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                      <div
                        className={`bg-${indicator.color}-500 h-1.5 rounded-full`}
                        style={{ width: `${indicator.confidence}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 ml-2">
                      {indicator.confidence}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Graphique principal des tendances */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <ChartLine className="w-5 h-5 mr-2" />
                Analyse Prédictive des Ventes
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline">Modèle ARIMA</Badge>
                <Badge variant="secondary">Confiance 89%</Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={combinedData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  
                  {/* Données historiques */}
                  <Line
                    type="monotone"
                    dataKey="actual"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={{ fill: '#3b82f6', r: 4 }}
                    name="Données historiques"
                  />
                  
                  {/* Tendance */}
                  <Line
                    type="monotone"
                    dataKey="trend"
                    stroke="#10b981"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ fill: '#10b981', r: 2 }}
                    name="Tendance"
                  />
                  
                  {/* Prévisions */}
                  <Line
                    type="monotone"
                    dataKey="prediction"
                    stroke="#f59e0b"
                    strokeWidth={3}
                    strokeDasharray="8 4"
                    dot={{ fill: '#f59e0b', r: 4 }}
                    name="Prévision"
                  />
                  
                  {/* Intervalle de confiance */}
                  <Area
                    type="monotone"
                    dataKey="upper"
                    stroke="none"
                    fill="#f59e0b"
                    fillOpacity={0.1}
                  />
                  <Area
                    type="monotone"
                    dataKey="lower"
                    stroke="none"
                    fill="#f59e0b"
                    fillOpacity={0.1}
                  />
                  
                  {/* Ligne de séparation */}
                  <ReferenceLine x="Déc 23" stroke="#ef4444" strokeDasharray="2 2" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <strong>Méthodologie:</strong> Modèle ARIMA(2,1,2) entraîné sur 24 mois de données historiques. 
                L'intervalle de confiance à 95% est représenté par la zone colorée. 
                La ligne rouge marque la séparation entre données historiques et prévisions.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Insights et recommandations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alertes intelligentes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lightbulb className="w-5 h-5 mr-2" />
                Insights Prédictifs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {insights.map((insight, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center">
                        {insight.type === 'opportunity' && (
                          <TrendingUp className="w-5 h-5 text-green-500 mr-2" />
                        )}
                        {insight.type === 'warning' && (
                          <AlertTriangle className="w-5 h-5 text-orange-500 mr-2" />
                        )}
                        {insight.type === 'trend' && (
                          <Activity className="w-5 h-5 text-blue-500 mr-2" />
                        )}
                        <h4 className="font-medium">{insight.title}</h4>
                      </div>
                      <Badge 
                        variant={insight.impact === 'Élevé' ? 'destructive' : 'secondary'}
                      >
                        {insight.impact}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {insight.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {insight.action}
                      </p>
                      <div className="flex items-center">
                        <div className="w-12 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mr-2">
                          <div
                            className="bg-blue-500 h-1.5 rounded-full"
                            style={{ width: `${insight.confidence * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500">
                          {(insight.confidence * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Analyse saisonnière */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Patterns Saisonniers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Saisonnalité mensuelle */}
                <div>
                  <h4 className="font-medium mb-3">Facteurs Saisonniers</h4>
                  <div className="grid grid-cols-4 gap-2">
                    {['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'].map((month, index) => {
                      const factor = [0.85, 0.92, 0.98, 1.05, 1.12, 1.25, 1.35, 1.42, 1.38, 1.55, 1.68, 1.85][index];
                      const isHigh = factor > 1.2;
                      const isLow = factor < 0.9;
                      
                      return (
                        <div key={month} className="text-center p-2 rounded">
                          <div className="text-xs text-gray-600 dark:text-gray-400">{month}</div>
                          <div className={`text-sm font-bold ${
                            isHigh ? 'text-green-600' : isLow ? 'text-red-600' : 'text-gray-600'
                          }`}>
                            {factor.toFixed(2)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Cycles détectés */}
                <div>
                  <h4 className="font-medium mb-3">Cycles Identifiés</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                      <span className="text-sm font-medium">Cycle Annuel</span>
                      <Badge variant="secondary">12 mois</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-900/20 rounded">
                      <span className="text-sm font-medium">Pic Estival</span>
                      <Badge variant="secondary">Jun-Aoû</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-orange-50 dark:bg-orange-900/20 rounded">
                      <span className="text-sm font-medium">Rush Fin d'Année</span>
                      <Badge variant="secondary">Nov-Déc</Badge>
                    </div>
                  </div>
                </div>

                {/* Prochains événements */}
                <div>
                  <h4 className="font-medium mb-3">Prochains Événements</h4>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                      <span>Pic de croissance prévu: Mars 2024</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <div className="w-3 h-3 bg-orange-500 rounded-full mr-3"></div>
                      <span>Ralentissement possible: Août 2024</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                      <span>Rush fin d'année: Novembre 2024</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Modèles et performance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Performance des Modèles Prédictifs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">Modèle</th>
                    <th className="text-right p-3">MAPE</th>
                    <th className="text-right p-3">RMSE</th>
                    <th className="text-right p-3">Précision</th>
                    <th className="text-right p-3">Stabilité</th>
                    <th className="text-right p-3">Recommandation</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="p-3 font-medium">ARIMA(2,1,2)</td>
                    <td className="text-right p-3">4.2%</td>
                    <td className="text-right p-3">8,450€</td>
                    <td className="text-right p-3">89%</td>
                    <td className="text-right p-3">
                      <Badge variant="secondary" className="bg-green-100 text-green-800">Élevée</Badge>
                    </td>
                    <td className="text-right p-3">
                      <Badge className="bg-green-500">Recommandé</Badge>
                    </td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="p-3 font-medium">Prophet</td>
                    <td className="text-right p-3">5.1%</td>
                    <td className="text-right p-3">9,200€</td>
                    <td className="text-right p-3">85%</td>
                    <td className="text-right p-3">
                      <Badge variant="secondary" className="bg-orange-100 text-orange-800">Moyenne</Badge>
                    </td>
                    <td className="text-right p-3">
                      <Badge variant="secondary">Alternatif</Badge>
                    </td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="p-3 font-medium">LSTM</td>
                    <td className="text-right p-3">6.8%</td>
                    <td className="text-right p-3">11,100€</td>
                    <td className="text-right p-3">78%</td>
                    <td className="text-right p-3">
                      <Badge variant="secondary" className="bg-red-100 text-red-800">Faible</Badge>
                    </td>
                    <td className="text-right p-3">
                      <Badge variant="outline">Non recommandé</Badge>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-start">
                <Target className="w-5 h-5 text-blue-600 mr-2 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-800 dark:text-blue-400">Recommandation</p>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Le modèle ARIMA(2,1,2) offre le meilleur compromis entre précision et stabilité pour vos données. 
                    Il capture efficacement la tendance et la saisonnalité tout en maintenant une variance prédictive faible.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
