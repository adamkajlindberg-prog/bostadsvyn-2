import { UserPreferencesProvider } from '@/hooks/useUserPreferences';
import AIPropertyAdvisorContent from './AIPropertyAdvisorContent';
export default function AIPropertyAdvisor() {
  return <UserPreferencesProvider>
      <AIPropertyAdvisorContent />
    </UserPreferencesProvider>;
}