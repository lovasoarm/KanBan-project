import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  LineChart, Line, Area, AreaChart
} from 'recharts';
import { TrendingUp, TrendingDown, Package, DollarSign, Target, Users } from 'lucide-react';

// Données simulées pour les analytics par catégorie
const categoryData = [
  { name: 'Électronique', value: 35, revenue: 125000, items: 450, growth: 12.5 },
  { name: 'Vêtements', value: 25, revenue: 85000, items: 320, growth: 8.3 },
  { name: 'Maison & Jardin', value: 20, revenue: 65000, items: 280, growth: -2.1 },
  { name: 'Sports & Loisirs', value: 12, revenue: 42000, items: 180, growth: 15.7 },
  { name: 'Livres', value: 8, revenue: 18000, items: 150, growth: -5.2 }
];

const monthlyTrends = [
  { month: 'Jan', Électronique: 28000, Vêtements: 18000, 'Maison & Jardin': 12000, 'Sports & Loisirs': 8000, Livres: 3000 },
  { month: 'Fév', Électronique: 32000, Vêtements: 22000, 'Maison & Jardin': 14000, 'Sports & Loisirs': 9000, Livres: 3500 },
  { month: 'Mar', Électronique: 35000, Vêtements: 25000, 'Maison & Jardin': 16000, 'Sports & Loisirs': 11000, Livres: 4000 },
  { month: 'Avr', Électronique: 38000, Vêtements: 23000, 'Maison & Jardin': 15000, 'Sports & Loisirs': 12000, Livres: 3800 },
  { month: 'Mai', Électronique: 42000, Vêtements: 28000, 'Maison & Jardin': 18000, 'Sports & Loisirs': 13500, Livres: 4200 },
  { month: 'Jun', Électronique: 45000, Vêtements: 31000, 'Maison & Jardin': 19000, 'Sports & Loisirs': 15000, Livres: 4500 }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export const CategoryAnalytics: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('6m');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const totalRevenue = categoryData.reduce((sum, cat) => sum + cat.revenue, 0);
  const totalItems = categoryData.reduce((sum, cat) => sum + cat.items, 0);
  const averageGrowth = categoryData.reduce((sum, cat) => sum + cat.growth, 0) / categoryData.length;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{`${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.dataKey}: ${entry.value.toLocaleString()}€`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Contrôles de filtre */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Analytics par Catégorie
        </h2>
        <div className="flex items-center space-x-4">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Période" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1m">1 Mois</SelectItem>
              <SelectItem value="3m">3 Mois</SelectItem>
              <SelectItem value="6m">6 Mois</SelectItem>
              <SelectItem value="1y">1 Année</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Catégorie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les catégories</SelectItem>
              {categoryData.map((cat) => (
                <SelectItem key={cat.name} value={cat.name.toLowerCase()}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Métriques globales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Revenus Totaux
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {totalRevenue.toLocaleString()}€
                  </p>
                </div>
                <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                  <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                  +{averageGrowth.toFixed(1)}%
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                  vs mois précédent
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Articles Vendus
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {totalItems.toLocaleString()}
                  </p>
                </div>
                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <Package className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-blue-500 mr-1" />
                <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                  +185 articles
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                  cette semaine
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Catégories Actives
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {categoryData.length}
                  </p>
                </div>
                <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                  <Target className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <div className="flex items-center mt-2">
                <span className="text-sm text-purple-600 dark:text-purple-400 font-medium">
                  100% performance
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Panier Moyen
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {(totalRevenue / totalItems).toFixed(0)}€
                  </p>
                </div>
                <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                  <Users className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-orange-500 mr-1" />
                <span className="text-sm text-orange-600 dark:text-orange-400 font-medium">
                  +12€
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                  vs moyenne
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Graphique en secteurs */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                Répartition par Catégorie
                <Badge variant="secondary" className="ml-2">Revenus</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              {/* Légende personnalisée */}
              <div className="mt-4 space-y-2">
                {categoryData.map((cat, index) => (
                  <div key={cat.name} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div
                        className="w-3 h-3 rounded-full mr-3"
                        style={{ backgroundColor: COLORS[index] }}
                      />
                      <span className="text-sm font-medium">{cat.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold">{cat.revenue.toLocaleString()}€</div>
                      <div className={`text-xs flex items-center ${
                        cat.growth > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {cat.growth > 0 ? (
                          <TrendingUp className="w-3 h-3 mr-1" />
                        ) : (
                          <TrendingDown className="w-3 h-3 mr-1" />
                        )}
                        {Math.abs(cat.growth)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Graphique en barres */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                Évolution Mensuelle
                <Badge variant="secondary" className="ml-2">6 mois</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="Électronique"
                      stackId="1"
                      stroke={COLORS[0]}
                      fill={COLORS[0]}
                    />
                    <Area
                      type="monotone"
                      dataKey="Vêtements"
                      stackId="1"
                      stroke={COLORS[1]}
                      fill={COLORS[1]}
                    />
                    <Area
                      type="monotone"
                      dataKey="Maison & Jardin"
                      stackId="1"
                      stroke={COLORS[2]}
                      fill={COLORS[2]}
                    />
                    <Area
                      type="monotone"
                      dataKey="Sports & Loisirs"
                      stackId="1"
                      stroke={COLORS[3]}
                      fill={COLORS[3]}
                    />
                    <Area
                      type="monotone"
                      dataKey="Livres"
                      stackId="1"
                      stroke={COLORS[4]}
                      fill={COLORS[4]}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Tableau détaillé des performances */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Performance Détaillée par Catégorie</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">Catégorie</th>
                    <th className="text-right p-3">Revenus</th>
                    <th className="text-right p-3">Articles</th>
                    <th className="text-right p-3">Prix Moyen</th>
                    <th className="text-right p-3">Croissance</th>
                    <th className="text-right p-3">Part de Marché</th>
                  </tr>
                </thead>
                <tbody>
                  {categoryData.map((cat, index) => (
                    <tr key={cat.name} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="p-3">
                        <div className="flex items-center">
                          <div
                            className="w-3 h-3 rounded-full mr-3"
                            style={{ backgroundColor: COLORS[index] }}
                          />
                          <span className="font-medium">{cat.name}</span>
                        </div>
                      </td>
                      <td className="text-right p-3 font-mono">
                        {cat.revenue.toLocaleString()}€
                      </td>
                      <td className="text-right p-3">
                        {cat.items.toLocaleString()}
                      </td>
                      <td className="text-right p-3 font-mono">
                        {(cat.revenue / cat.items).toFixed(0)}€
                      </td>
                      <td className="text-right p-3">
                        <div className={`flex items-center justify-end ${
                          cat.growth > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {cat.growth > 0 ? (
                            <TrendingUp className="w-4 h-4 mr-1" />
                          ) : (
                            <TrendingDown className="w-4 h-4 mr-1" />
                          )}
                          {Math.abs(cat.growth)}%
                        </div>
                      </td>
                      <td className="text-right p-3">
                        {cat.value}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
