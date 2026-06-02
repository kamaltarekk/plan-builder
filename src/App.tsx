import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import SavingPlanPage from './pages/SavingPlanPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/saving-plan" replace />} />
        <Route path="/saving-plan" element={<SavingPlanPage />} />
        <Route path="*" element={<Navigate to="/saving-plan" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
