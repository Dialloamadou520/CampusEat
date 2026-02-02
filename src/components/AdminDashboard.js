import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, TrendingUp, Calendar, Download, FileText, Table } from 'lucide-react';
import { format, subDays } from 'date-fns';
import { exportToPDF, exportToExcel, exportStatisticsToPDF } from '../utils/exportUtils';
import Navbar from './Navbar';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user } = useAuth();
  const { transactions, students, getStatistics } = useData();
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  const stats = getStatistics();

  const getLast7DaysData = () => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const date = subDays(new Date(), i);
      date.setHours(0, 0, 0, 0);
      
      const count = transactions.filter(t => {
        const txDate = new Date(t.date);
        txDate.setHours(0, 0, 0, 0);
        return txDate.getTime() === date.getTime();
      }).length;

      data.push({
        date: format(date, 'dd/MM'),
        repas: count
      });
    }
    return data;
  };

  const getRestaurantData = () => {
    const restaurants = {};
    transactions.forEach(t => {
      restaurants[t.restaurant] = (restaurants[t.restaurant] || 0) + 1;
    });

    return Object.entries(restaurants).map(([name, count]) => ({
      name,
      repas: count
    }));
  };

  const chartData = getLast7DaysData();
  const restaurantData = getRestaurantData();

  const handleExportTransactions = (format) => {
    if (format === 'pdf') {
      exportToPDF(transactions.slice(0, 100), 'Rapport des Transactions');
    } else {
      exportToExcel(transactions, 'transactions');
    }
  };

  const handleExportStatistics = () => {
    exportStatisticsToPDF(stats, chartData);
  };

  return (
    <div className="dashboard">
      <Navbar />
      <div className="dashboard-content">
        <div className="dashboard-header">
          <div>
            <h1>Tableau de bord Administrateur</h1>
            <p>Vue d'ensemble et statistiques</p>
          </div>
          <div className="export-buttons">
            <button onClick={handleExportStatistics} className="export-btn primary">
              <FileText size={18} />
              Exporter Stats (PDF)
            </button>
            <button onClick={() => handleExportTransactions('pdf')} className="export-btn">
              <Download size={18} />
              Export PDF
            </button>
            <button onClick={() => handleExportTransactions('excel')} className="export-btn">
              <Table size={18} />
              Export Excel
            </button>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon today">
              <Calendar size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-label">Repas aujourd'hui</span>
              <span className="stat-value">{stats.today}</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon week">
              <TrendingUp size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-label">Cette semaine</span>
              <span className="stat-value">{stats.week}</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon month">
              <TrendingUp size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-label">Ce mois</span>
              <span className="stat-value">{stats.month}</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon students">
              <Users size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-label">Étudiants actifs</span>
              <span className="stat-value">{stats.activeStudents}</span>
              <span className="stat-subtitle">sur {stats.totalStudents}</span>
            </div>
          </div>
        </div>

        <div className="charts-grid">
          <div className="chart-card">
            <h2>Évolution des repas (7 derniers jours)</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="repas" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <h2>Répartition par restaurant</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={restaurantData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="repas" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="tables-grid">
          <div className="table-card">
            <h2>Étudiants - Gestion des quotas</h2>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nom</th>
                    <th>Tickets</th>
                    <th>Quota</th>
                    <th>Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {students.slice(0, 10).map(student => (
                    <tr key={student.id}>
                      <td>{student.id}</td>
                      <td>{student.name}</td>
                      <td>
                        <span className="badge tickets">{student.ticketBalance}</span>
                      </td>
                      <td>{student.quota}</td>
                      <td>
                        <span className={`badge ${student.active ? 'active' : 'inactive'}`}>
                          {student.active ? 'Actif' : 'Inactif'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="table-card">
            <h2>Transactions récentes</h2>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Étudiant</th>
                    <th>Restaurant</th>
                    <th>Agent</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.slice(0, 10).map(transaction => (
                    <tr key={transaction.id}>
                      <td>{format(new Date(transaction.date), 'dd/MM HH:mm')}</td>
                      <td>
                        <div className="student-cell">
                          <span className="student-name">{transaction.studentName}</span>
                          <span className="student-id">{transaction.studentId}</span>
                        </div>
                      </td>
                      <td>{transaction.restaurant}</td>
                      <td>{transaction.agentName}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
