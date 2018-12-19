import {Navigation} from 'react-native-navigation';

export function registerScreens() {
  Navigation.registerComponent('MainScreen', () => require ('./screens/MainScreen').default)
  Navigation.registerComponent('ExamScreen', () => require ('./screens/ExamScreen').default)
  Navigation.registerComponent('ResultScreen', () => require ('./screens/ResultScreen').default)
  Navigation.registerComponent('Drawer', () => require ('./screens/Drawer').default)
  Navigation.registerComponent('GameResultsScreen', () => require ('./screens/GameResultsScreen').default)
}
