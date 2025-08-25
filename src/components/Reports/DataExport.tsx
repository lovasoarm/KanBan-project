import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { motion } from 'framer-motion';
import { 
  FileText, FileSpreadsheet, Download, Settings, Calendar, 
  Filter, Layout, Palette, Clock, CheckCircle, AlertCircle,
  FileDown, Mail, Share, Eye
} from 'lucide-react';

// Types d'export disponibles
const exportTypes = [
  {
    id: 'pdf',
    name: 'PDF Report',
    icon: FileText,
    description: 'Rapport complet avec graphiques et analyses',
    formats: ['A4', 'A3', 'Letter'],
    color: 'red'
  },
  {
    id: 'excel',
    name: 'Excel Workbook',
    icon: FileSpreadsheet,
    description: 'Données brutes avec feuilles multiples',
    formats: ['XLSX', 'XLS', 'CSV'],
    color: 'green'
  },
  {
    id: 'powerpoint',
    name: 'PowerPoint',
    icon: Layout,
    description: 'Présentation exécutive avec slides',
    formats: ['PPTX', 'PPT'],
    color: 'orange'
  }
];

// Sections de données disponibles
const dataSections = [
  { id: 'overview', label: 'Vue d\'ensemble', description: 'KPIs et métriques principales' },
  { id: 'categories', label: 'Analytics par catégorie', description: 'Détails par catégorie de produits' },
  { id: 'performance', label: 'Performance des ventes', description: 'Données de performance et tendances' },
  { id: 'forecasting', label: 'Prévisions', description: 'Modèles prédictifs et projections' },
  { id: 'products', label: 'Analyse produits', description: 'Performance par produit' },
  { id: 'customers', label: 'Données clients', description: 'Segments et comportements clients' },
  { id: 'financial', label: 'Données financières', description: 'Revenus, marges, coûts' }
];

// Templates prédéfinis
const templates = [
  {
    id: 'executive',
    name: 'Rapport Exécutif',
    description: 'Synthèse pour direction générale',
    sections: ['overview', 'performance', 'forecasting'],
    format: 'pdf'
  },
  {
    id: 'operational',
    name: 'Rapport Opérationnel',
    description: 'Analyse détaillée pour équipes',
    sections: ['categories', 'products', 'customers'],
    format: 'excel'
  },
  {
    id: 'financial',
    name: 'Rapport Financier',
    description: 'Focus sur les métriques financières',
    sections: ['financial', 'performance', 'overview'],
    format: 'pdf'
  },
  {
    id: 'complete',
    name: 'Rapport Complet',
    description: 'Toutes les sections incluses',
    sections: dataSections.map(s => s.id),
    format: 'pdf'
  }
];

// Historique des exports
const exportHistory = [
  {
    id: 1,
    name: 'Rapport_Mensuel_Juin_2024.pdf',
    type: 'PDF',
    size: '2.4 MB',
    date: '2024-07-01 10:30',
    status: 'completed'
  },
  {
    id: 2,
    name: 'Analytics_Categorie_Q2.xlsx',
    type: 'Excel',
    size: '1.8 MB',
    date: '2024-06-28 15:45',
    status: 'completed'
  },
  {
    id: 3,
    name: 'Performance_Team_Mai.pptx',
    type: 'PowerPoint',
    size: '3.2 MB',
    date: '2024-06-25 09:15',
    status: 'completed'
  },
  {
    id: 4,
    name: 'Previsions_H2_2024.pdf',
    type: 'PDF',
    size: '1.9 MB',
    date: '2024-06-20 14:20',
    status: 'processing'
  }
];

export const DataExport: React.FC = () => {
  const [selectedType, setSelectedType] = useState('pdf');
  const [selectedTemplate, setSelectedTemplate] = useState('executive');
  const [selectedSections, setSelectedSections] = useState<string[]>(['overview', 'performance', 'forecasting']);
  const [exportFormat, setExportFormat] = useState('A4');
  const [dateRange, setDateRange] = useState('last_month');
  const [fileName, setFileName] = useState('Rapport_Mensuel');
  const [description, setDescription] = useState('');
  const [includeCharts, setIncludeCharts] = useState(true);
  const [includeRawData, setIncludeRawData] = useState(false);
  const [emailNotification, setEmailNotification] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  const handleSectionToggle = (sectionId: string) => {
    setSelectedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(templateId);
      setSelectedSections(template.sections);
      setSelectedType(template.format);
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    
    // Simulation de l'export
    setTimeout(() => {
      setIsExporting(false);
      // Ici on déclencherait le vrai export
      alert('Export démarré ! Vous recevrez une notification par email une fois terminé.');
    }, 2000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'processing':
        return <Clock className="w-4 h-4 text-orange-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Export de Données
        </h2>
        <Button onClick={handleExport} disabled={isExporting}>
          {isExporting ? (
            <>
              <Clock className="w-4 h-4 mr-2 animate-spin" />
              Export en cours...
            </>
          ) : (
            <>
              <Download className="w-4 h-4 mr-2" />
              Lancer l'Export
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuration de l'export */}
        <div className="lg:col-span-2 space-y-6">
          {/* Type d'export */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileDown className="w-5 h-5 mr-2" />
                  Type d'Export
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {exportTypes.map((type) => (
                    <div
                      key={type.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedType === type.id
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200 dark:border-gray-700'
                      }`}
                      onClick={() => setSelectedType(type.id)}
                    >
                      <div className="flex items-center mb-2">
                        <type.icon className={`w-6 h-6 text-${type.color}-500 mr-2`} />
                        <h4 className="font-medium">{type.name}</h4>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {type.description}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {type.formats.map(format => (
                          <Badge key={format} variant="secondary" className="text-xs">
                            {format}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Templates */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Layout className="w-5 h-5 mr-2" />
                  Templates Prédéfinis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {templates.map((template) => (
                    <div
                      key={template.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedTemplate === template.id
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200 dark:border-gray-700'
                      }`}
                      onClick={() => handleTemplateSelect(template.id)}
                    >
                      <h4 className="font-medium mb-1">{template.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {template.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">{template.sections.length} sections</Badge>
                        <Badge variant="secondary">{template.format.toUpperCase()}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Sélection des sections */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  Sections à Inclure
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dataSections.map((section) => (
                    <div key={section.id} className="flex items-start space-x-3">
                      <Checkbox
                        id={section.id}
                        checked={selectedSections.includes(section.id)}
                        onCheckedChange={() => handleSectionToggle(section.id)}
                      />
                      <div className="grid gap-1.5 leading-none">
                        <Label 
                          htmlFor={section.id}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {section.label}
                        </Label>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {section.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Options avancées */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Filter className="w-5 h-5 mr-2" />
                  Options Avancées
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="fileName">Nom du fichier</Label>
                      <Input
                        id="fileName"
                        value={fileName}
                        onChange={(e) => setFileName(e.target.value)}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="dateRange">Période de données</Label>
                      <Select value={dateRange} onValueChange={setDateRange}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="last_week">7 derniers jours</SelectItem>
                          <SelectItem value="last_month">30 derniers jours</SelectItem>
                          <SelectItem value="last_quarter">Dernier trimestre</SelectItem>
                          <SelectItem value="last_year">Dernière année</SelectItem>
                          <SelectItem value="custom">Période personnalisée</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="format">Format de sortie</Label>
                      <Select value={exportFormat} onValueChange={setExportFormat}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {exportTypes.find(t => t.id === selectedType)?.formats.map(format => (
                            <SelectItem key={format} value={format}>
                              {format}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="includeCharts"
                        checked={includeCharts}
                        onCheckedChange={setIncludeCharts}
                      />
                      <Label htmlFor="includeCharts">Inclure les graphiques</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="includeRawData"
                        checked={includeRawData}
                        onCheckedChange={setIncludeRawData}
                      />
                      <Label htmlFor="includeRawData">Inclure données brutes</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="emailNotification"
                        checked={emailNotification}
                        onCheckedChange={setEmailNotification}
                      />
                      <Label htmlFor="emailNotification">Notification par email</Label>
                    </div>

                    <div>
                      <Label htmlFor="description">Description (optionnelle)</Label>
                      <Textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Ajoutez une description pour ce rapport..."
                        className="mt-1"
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Sidebar avec aperçu et historique */}
        <div className="space-y-6">
          {/* Aperçu de l'export */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Eye className="w-5 h-5 mr-2" />
                  Aperçu
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Type:</span>
                    <Badge variant="outline">
                      {exportTypes.find(t => t.id === selectedType)?.name}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Format:</span>
                    <Badge variant="secondary">{exportFormat}</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Sections:</span>
                    <Badge>{selectedSections.length}</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Période:</span>
                    <span className="text-sm font-medium">
                      {dateRange === 'last_month' ? '30j' : 
                       dateRange === 'last_week' ? '7j' :
                       dateRange === 'last_quarter' ? '3m' : '1a'}
                    </span>
                  </div>

                  <div className="pt-3 border-t">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Taille estimée: <span className="font-medium">2.1 MB</span>
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Temps estimé: <span className="font-medium">45 sec</span>
                    </p>
                  </div>

                  {selectedSections.length > 0 && (
                    <div className="pt-3 border-t">
                      <p className="text-xs text-gray-500 mb-2">Sections incluses:</p>
                      <div className="space-y-1">
                        {selectedSections.map(sectionId => {
                          const section = dataSections.find(s => s.id === sectionId);
                          return (
                            <div key={sectionId} className="text-xs text-gray-600 dark:text-gray-400">
                              • {section?.label}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Historique des exports */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  Historique
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {exportHistory.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-2 border rounded-lg">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(item.status)}
                        <div>
                          <p className="text-sm font-medium truncate max-w-[150px]">
                            {item.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {item.size} • {new Date(item.date).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        {item.status === 'completed' && (
                          <Button variant="ghost" size="sm">
                            <Download className="w-3 h-3" />
                          </Button>
                        )}
                        <Button variant="ghost" size="sm">
                          <Share className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t mt-4">
                  <p className="text-xs text-gray-500 text-center">
                    Les fichiers sont conservés 30 jours
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Actions rapides */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Actions Rapides</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <Mail className="w-4 h-4 mr-2" />
                    Envoyer par email
                  </Button>
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <Calendar className="w-4 h-4 mr-2" />
                    Programmer export
                  </Button>
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <Share className="w-4 h-4 mr-2" />
                    Partager le lien
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
