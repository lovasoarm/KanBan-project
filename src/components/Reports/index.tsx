import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Download, FileText, FileSpreadsheet, TrendingUp, BarChart3, PieChart } from 'lucide-react';
import { CategoryAnalytics } from './CategoryAnalytics';
import { SalesPerformance } from './SalesPerformance';
import { TrendsForecasting } from './TrendsForecasting';
import { DataExport } from './DataExport';
import { motion } from 'framer-motion';

export const Reports: React.FC = () => {
  const [activeTab, setActiveTab] = useState('analytics');
  const [loading, setLoading] = useState(false);

  const tabs = [
    {
      id: 'analytics',
      label: 'Analytics par Catégorie',
      icon: PieChart,
      description: 'Visualisations et métriques par catégorie'
    },
    {
      id: 'performance',
      label: 'Performance des Ventes',
      icon: BarChart3,
      description: 'Rapports de performance et KPIs'
    },
    {
      id: 'trends',
      label: 'Tendances & Prévisions',
      icon: TrendingUp,
      description: 'Analyses prédictives basées sur les données'
    },
    {
      id: 'export',
      label: 'Export de Données',
      icon: Download,
      description: 'Export PDF/Excel des rapports'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Rapports & Analytics
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Analyses détaillées et visualisations des données
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <FileText className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
          <Button variant="outline" size="sm">
            <FileSpreadsheet className="w-4 h-4 mr-2" />
            Export Excel
          </Button>
        </div>
      </motion.div>

      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 h-auto p-1">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="flex flex-col items-center p-4 space-y-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <tab.icon className="w-5 h-5" />
              <div className="text-center">
                <div className="font-medium text-sm">{tab.label}</div>
                <div className="text-xs opacity-70">{tab.description}</div>
              </div>
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Tab Contents */}
        <TabsContent value="analytics" className="space-y-6">
          <CategoryAnalytics />
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <SalesPerformance />
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <TrendsForecasting />
        </TabsContent>

        <TabsContent value="export" className="space-y-6">
          <DataExport />
        </TabsContent>
      </Tabs>
    </div>
  );
};
