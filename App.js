import { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { requestPermissions, scheduleFixedNotifications } from './src/shared/notifications';

export default function App() {
  useEffect(() => {
    requestPermissions().then(granted => {
      if (granted) scheduleFixedNotifications();
    });
  }, []);

  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
};
