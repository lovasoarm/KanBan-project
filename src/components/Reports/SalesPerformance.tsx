import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { 
  LineChart, Line, Area, AreaChart, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, ComposedChart 
} from 'recharts';
import { 
  TrendingUp, TrendingDown, Target, DollarSign, ShoppingCart, 
  Users, Calendar, Award, ArrowUp, ArrowDown 
} from 'lucide-react';

// Données simulées pour la performance des ventes
const salesData = [
  { date: '2024-01-01', sales: 45000, orders: 120, customers: 95, avgOrder: 375 },
  { date: '2024-01-02', sales: 52000, orders: 135, customers: 108, avgOrder: 385 },
  { date: '2024-01-03', sales: 48000, orders: 128, customers: 102, avgOrder: 375 },
  { date: '2024-01-04', sales: 61000, orders: 155, customers: 125, avgOrder: 394 },
  { date: '2024-01-05', sales: 58000, orders: 142, customers: 115, avgOrder: 408 },
  { date: '2024-01-06', sales: 65000, orders: 168, customers: 135, avgOrder: 387 },
  { date: '2024-01-07', sales: 70000, orders: 175, customers: 142, avgOrder: 400 }
];

const monthlyPerformance = [
  { month: 'Jan', sales: 1250000, orders: 3500, customers: 2800, target: 1200000 },
  { month: 'Fév', sales: 1380000, orders: 3850, customers: 3100, target: 1300000 },
  { month: 'Mar', sales: 1520000, orders: 4200, customers: 3400, target: 1400000 },
  { month: 'Avr', sales: 1420000, orders: 3950, customers: 3200, target: 1450000 },
  { month: 'Mai', sales: 1680000, orders: 4650, customers: 3800, target: 1500000 },
  { month: 'Jun', sales: 1750000, orders: 4850, customers: 3950, target: 1600000 }
];

const kpiData = [
  {
    title: 'Chiffre d\'Affaires',
    value: '1,750,000€',
    change: '+12.5%',
    trend: 'up',
    icon: DollarSign,
    color: 'green',
    description: 'vs mois précédent'
  },
  {
    title: 'Commandes Totales',
    value: '4,850',
    change: '+8.3%',
    trend: 'up',
    icon: ShoppingCart,
    color: 'blue',
    description: 'ce mois'
  },
  {
    title: 'Nouveaux Clients',
    value: '3,950',
    change: '+15.2%',
    trend: 'up',
    icon: Users,
    color: 'purple',
    description: 'acquisitions'
  },
  {
    title: 'Panier Moyen',
    value: '361€',
    change: '+4.1%',
    trend: 'up',
    icon: Target,
    color: 'orange',
    description: 'par commande'
  }
];

const topProducts = [
  { name: 'iPhone 15 Pro', sales: 125000, units: 250, growth: 23.5 },
  { name: 'MacBook Air M2', sales: 98000, units: 98, growth: 18.2 },
  { name: 'AirPods Pro', sales: 75000, units: 300, growth: 12.8 },
  { name: 'iPad Air', sales: 62000, units: 124, growth: -2.1 },
  { name: 'Apple Watch', sales: 54000, units: 180, growth: 8.9 }
];

const salesTeam = [
  { name: 'Marie Dubois', sales: 185000, target: 180000, achievement: 102.8, orders: 245 },
  { name: 'Jean Martin', sales: 172000, target: 170000, achievement: 101.2, orders: 223 },
  { name: 'Sophie Leroy', sales: 165000, target: 175000, achievement: 94.3, orders: 201 },
  { name: 'Pierre Moreau', sales: 158000, target: 160000, achievement: 98.8, orders: 195 },
  { name: 'Emma Bernard', sales: 142000, target: 150000, achievement: 94.7, orders: 178 }
];

export const SalesPerformance: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedMetric, setSelectedMetric] = useState('sales');

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value.toLocaleString()}${entry.name === 'sales' || entry.name === 'target' ? '€' : ''}`}
            </p>
          ))}
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
          Performance des Ventes
        </h2>
        <div className="flex items-center space-x-4">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Période" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">7 jours</SelectItem>
              <SelectItem value="month">30 jours</SelectItem>
              <SelectItem value="quarter">3 mois</SelectItem>
              <SelectItem value="year">1 année</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedMetric} onValueChange={setSelectedMetric}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Métrique" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sales">Ventes</SelectItem>
              <SelectItem value="orders">Commandes</SelectItem>
              <SelectItem value="customers">Clients</SelectItem>
              <SelectItem value="avgOrder">Panier moyen</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* KPIs principaux */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => (
          <motion.div
            key={kpi.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {kpi.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {kpi.value}
                    </p>
                  </div>
                  <div className={`p-2 bg-${kpi.color}-100 dark:bg-${kpi.color}-900/20 rounded-lg`}>
                    <kpi.icon className={`w-6 h-6 text-${kpi.color}-600 dark:text-${kpi.color}-400`} />
                  </div>
                </div>
                <div className="flex items-center mt-2">
                  {kpi.trend === 'up' ? (
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                  )}
                  <span className={`text-sm font-medium ${
                    kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {kpi.change}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                    {kpi.description}
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Graphiques principaux */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Évolution des ventes */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Évolution des Ventes
                <Badge variant="secondary">6 mois</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={monthlyPerformance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="target"
                      fill="#e5e7eb"
                      stroke="#9ca3af"
                      fillOpacity={0.3}
                      name="Objectif"
                    />
                    <Bar dataKey="sales" fill="#3b82f6" name="Ventes" />
                    <Line
                      type="monotone"
                      dataKey="target"
                      stroke="#ef4444"
                      strokeWidth={2}
                      dot={{ fill: '#ef4444' }}
                      name="Objectif"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Performance quotidienne */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Performance Quotidienne
                <Badge variant="secondary">7 jours</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(value) => new Date(value).toLocaleDateString('fr-FR', { 
                        day: '2-digit', 
                        month: '2-digit' 
                      })}
                    />
                    <YAxis />
                    <Tooltip 
                      labelFormatter={(value) => new Date(value).toLocaleDateString('fr-FR')}
                      content={<CustomTooltip />}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="sales"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      dot={{ fill: '#3b82f6', r: 4 }}
                      name="Ventes (€)"
                    />
                    <Line
                      type="monotone"
                      dataKey="orders"
                      stroke="#10b981"
                      strokeWidth={2}
                      dot={{ fill: '#10b981', r: 3 }}
                      name="Commandes"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Tableaux détaillés */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Produits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="w-5 h-5 mr-2" />
                Top Produits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div key={product.name} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mr-3">
                        <span className="text-sm font-bold">#{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {product.units} unités vendues
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{product.sales.toLocaleString()}€</p>
                      <div className={`flex items-center text-sm ${
                        product.growth > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {product.growth > 0 ? (
                          <ArrowUp className="w-3 h-3 mr-1" />
                        ) : (
                          <ArrowDown className="w-3 h-3 mr-1" />
                        )}
                        {Math.abs(product.growth)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Performance Équipe */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Performance Équipe
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {salesTeam.map((member, index) => (
                  <div key={member.name} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {member.orders} commandes
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{member.sales.toLocaleString()}€</p>
                        <p className={`text-sm ${
                          member.achievement >= 100 ? 'text-green-600' : 'text-orange-600'
                        }`}>
                          {member.achievement}% objectif
                        </p>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          member.achievement >= 100 ? 'bg-green-500' : 'bg-orange-500'
                        }`}
                        style={{ width: `${Math.min(member.achievement, 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Résumé performance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Résumé Performance - Juin 2024</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <h4 className="font-semibold text-green-800 dark:text-green-400 mb-2">
                  Points Forts
                </h4>
                <ul className="text-sm space-y-1">
                  <li>• Dépassement objectif mensuel (+9.4%)</li>
                  <li>• Croissance nouveaux clients (+15.2%)</li>
                  <li>• iPhone 15 Pro en forte progression</li>
                  <li>• Marie Dubois leader des ventes</li>
                </ul>
              </div>
              
              <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <h4 className="font-semibold text-orange-800 dark:text-orange-400 mb-2">
                  Points d'Attention
                </h4>
                <ul className="text-sm space-y-1">
                  <li>• iPad Air en baisse (-2.1%)</li>
                  <li>• Sophie Leroy sous objectif</li>
                  <li>• Conversion clients à améliorer</li>
                  <li>• Saisonnalité à anticiper</li>
                </ul>
              </div>
              
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h4 className="font-semibold text-blue-800 dark:text-blue-400 mb-2">
                  Actions Recommandées
                </h4>
                <ul className="text-sm space-y-1">
                  <li>• Formation équipe commerciale</li>
                  <li>• Promotion iPad Air</li>
                  <li>• Programme fidélité clients</li>
                  <li>• Optimisation catalogue produits</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
