import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import SafetyMap from './pages/SafetyMap';
import AIAssistant from './pages/AIAssistant';
import HazardReport from './pages/HazardReport';
import Emergency from './pages/Emergency';
import Settings from './pages/Settings';

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/map" element={<SafetyMap />} />
          <Route path="/assistant" element={<AIAssistant />} />
          <Route path="/report" element={<HazardReport />} />
          <Route path="/emergency" element={<Emergency />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Dashboard />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

