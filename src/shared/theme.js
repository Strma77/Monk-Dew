import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
const BASE_WIDTH = 390; // iPhone 14 baseline

export const scale = (size) => (width / BASE_WIDTH) * size;
export const vScale = (size) => (height / 844) * size;

export const colors = {
    screenBackground: '#232323',
    borderColor: '#2e2e2e',
    surfaceColor: '#3f3c3c',
    primaryColor: '#00d09f',
    expenseColor: '#ee2020',
    incomeColor: '#20c035',
    textPrimary: '#ffffff',
    textSecondary: '#a8a8a8'
};

export const fontSize = {
    sm: scale(12),
    md: scale(14),
    lg: scale(16),
    xl: scale(20),
    xxl: scale(13), 
};

export const spacing = {
    xs: scale(4),
    sm: scale(8),
    md: scale(14),
    lg: scale(20),
    xl: scale(28),
};

export const radius = {
    sm: 6,
    md: 12,
    lg: 20
};