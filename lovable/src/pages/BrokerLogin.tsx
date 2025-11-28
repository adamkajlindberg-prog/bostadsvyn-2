import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import BrokerAuthForm from '@/components/BrokerAuthForm';

export default function BrokerLogin() {
  const { user, loading, userRoles } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect authenticated brokers to broker portal
    if (user && !loading && userRoles.includes('broker')) {
      navigate('/mäklarportal');
    }
  }, [user, loading, userRoles, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-700 dark:text-gray-300">Laddar...</p>
        </div>
      </div>
    );
  }

  if (user && userRoles.includes('broker')) {
    return null; // Will redirect via useEffect
  }

  return <BrokerAuthForm />;
}