import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MoneyScreen from "../features/money/MoneyScreen";
import SleepScreen from "../features/sleep/SleepScreen";
import GymScreen from "../features/gym/GymScreen";
import HabitsScreen from "../features/habits/HabitsScreen";
import { colors, vScale, scale } from "../shared/theme";
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
    return (
        <Tab.Navigator 
            screenOptions={{
                tabBarStyle: { backgroundColor: colors.surfaceColor, height: vScale(60)},
                tabBarLabelStyle: { fontSize: scale(11), marginBottom: scale(4),},
                tabBarIconStyle: { margintop: 6,},
                tabBarActiveTintColor: colors.primaryColor,
                tabBarInactiveTintColor: colors.textSecondary,
                headerShown: false,
            }}
            >
            <Tab.Screen 
                name="Money" 
                component={MoneyScreen} 
                options={{
                    tabBarIcon: ({color, size}) => (
                        <Ionicons name="wallet-outline" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen 
                name="Sleep"
                component={SleepScreen}
                options={{
                    tabBarIcon: ({color, size}) => (
                        <Ionicons name="moon-outline" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen 
                name="Gym" 
                component={GymScreen}
                options={{
                    tabBarIcon: ({color, size}) => (
                        <Ionicons name="barbell-outline" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen 
                name="Habits" 
                component={HabitsScreen}
                options={{
                    tabBarIcon: ({color, size}) => (
                        <Ionicons name="checkmark-circle-outline" size={size} color={color} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
};

export default AppNavigator;