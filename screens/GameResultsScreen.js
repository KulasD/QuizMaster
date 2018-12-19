/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Button,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {Navigation} from "react-native-navigation";
import QuizStorage from '../QuizStorage';
type Props = {};
export default class GameResultsScreen extends Component<Props> {
  constructor() {
        super();

        var today = new Date()
        if(today.getDate() > 9){
          tday = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + (today.getDate());
        }
        else if(today.getDate() <= 9) {
          tday = today.getFullYear() + '-' + (today.getMonth() + 1) + '-0' + (today.getDate());
        }

        this.state = {
            tday: tday
        };
  }


  _onAcceptButton = () => {
    fetch('https://pwsz-quiz-api.herokuapp.com/api/result', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nick: 'I_LOVE_REACT_NATIVE',
        score: QuizStorage.getScore(),
        total: QuizStorage.getTasks(),
        type: QuizStorage.getQuiz_name(),
        date: String(this.state.tday),
      }),
    });
    //  Navigate to the Themes list
    Navigation.push(this.props.componentId,{
      component: {
        name: 'MainScreen'
      }
    })

  }

  render() {
    const wrongCount = QuizStorage.getTasks() - QuizStorage.getScore();
    return (
      <View style={styles.container}>


          <View style={styles.headerContainer}>
            <Text style = {styles.headerTitle}>Game Results</Text>
          </View>

          <View style={styles.gameDataContainer}>

            <View style={styles.gameData}>

              <Text style = {styles.gameName}>{QuizStorage.getQuiz_name()}</Text>

              <View style={styles.gameResultsContainer}>

                <View style={styles.gameResultsCorrectContainer}>
                  <Image style={styles.gameResultsCorrectImage}
                  source={require('../assets/images/correct.png')}
                  />
                  <Text style = {styles.gameResultsCorrectCount}>{QuizStorage.getScore()}</Text>
                </View>

                <View style={styles.gameResultsWrongContainer}>
                  <Image style={styles.gameResultsWrongImage}
                  source={require('../assets/images/wrong.png')}
                  />
                  <Text style = {styles.gameResultsWrongCount}>{wrongCount}</Text>
                </View>

              </View>

            </View>

          </View>

          <View style={styles.actionsContainer}>

            <TouchableOpacity onPress={this._onAcceptButton}>
              <Image
                style={styles.acceptButton}
                source={require('../assets/images/correct.png')}
              />
            </TouchableOpacity>

          </View>


      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
  },
  gameDataContainer : {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameData: {
    flex: 1,
    alignSelf: 'stretch',
    padding: 24,
    margin : 16,
    marginTop : 32,
    marginBottom : 32,
  },
  gameName: {
    color: 'black',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingTop: 12,
    paddingBottom: 24,
    textShadowColor:'#ffffff',
    textShadowOffset:{width: 2, height: 2},
    textShadowRadius:0,
  },
  actionsContainer : {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    paddingRight: 24,
    paddingLeft: 24,
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor : '#ffffff',
    margin : 8,
  },
  acceptButton : {
    width: 56,
    height: 56,
  },
  headerContainer : {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 24,
    paddingLeft: 24,
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor : '#ffffff',
    borderWidth: 2,
    borderRadius: 8,
    borderColor: 'black',
    margin : 8,
    marginTop : 36,
  },
  headerTitle : {
    color: 'black',
    fontSize: 28,
    fontWeight: '900',
  },
  gameResultsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    paddingLeft: 12,
    paddingRight: 12,
    paddingBottom: 8,
  },
  gameResultsCorrectContainer: {
    alignContent: 'center',
    justifyContent: 'center',
  },
  gameResultsCorrectImage: {
    width: 64,
    height: 64,
  },
  gameResultsCorrectCount: {
    marginTop: 12,
    fontSize: 64,
    fontWeight: '900',
    textAlign: 'center',
    textShadowColor:'#ffffff',
    textShadowOffset:{width: 2, height: 2},
    textShadowRadius:0,
  },
  gameResultsWrongContainer: {
    alignContent: 'center',
    justifyContent: 'center',
  },
  gameResultsWrongImage: {
    width: 64,
    height: 64,
  },
  gameResultsWrongCount: {
    marginTop: 12,
    fontSize: 64,
    fontWeight: '900',
    textAlign: 'center',
    textShadowColor:'#ffffff',
    textShadowOffset:{width: 2, height: 2},
    textShadowRadius:0,
  },
});
