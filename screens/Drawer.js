import React, {Component} from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Button
} from 'react-native';


import {Navigation} from "react-native-navigation";

export default class Drawer extends React.Component {
  goToScreen = (screenName) => {
    Navigation.push('MAIN_STACK',{
      component: {
        name: screenName
      }
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.start}>
          <Text style={styles.welcome}>Quiz App</Text>
          <Button color="#292929" title='Home Page' onPress={() =>this.goToScreen('MainScreen')}/>
          <Button color="#292929" title='ResultScreen' onPress={() =>this.goToScreen('ResultScreen')}/>
        </View>
        <View style={styles.exam}>
          <Text>Empty</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#494949',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  start: {
    flex: 1,
    justifyContent: 'flex-start'
  },
  exam: {
    flex: 4,
    justifyContent: 'flex-start'
  }
});
