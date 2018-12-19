import React, {Component} from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Button,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Modal,
  TouchableHighlight,
  ListView,
} from 'react-native';
import QuizStorage from '../QuizStorage'
const imageCorrect = require('../assets/images/correct.png')
const imageWrong = require('../assets/images/wrong.png')

import {Navigation} from "react-native-navigation";
import { openDatabase } from 'react-native-sqlite-storage';
var db = openDatabase({ name: "baza.db", createFromLocation : 1 });
export default class ExamScreen extends React.Component {

  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
    });
    this.state = {
      question: '',
      answers: ds.cloneWithRows([]),
    };
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM Questions WHERE quiz_id=? ORDER BY id DESC LIMIT 1 OFFSET ?', [QuizStorage.getQuiz_id(),QuizStorage.getQuestion_id()], (tx, results) => {
        var temp = [];
        temp.push(results.rows.item(0));
        QuizStorage.setQID(temp[0].id);
        this.setState({
          question: temp[0].name,
        });
        //console.log(this.state.question);
      });
    });
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM Answers WHERE question_id=?', [QuizStorage.getQID()], (tx, results) => {
        var temp = [];
        for (let i = 0; i < results.rows.length; ++i) {
          temp.push(results.rows.item(i));
          //console.log('ANSWER',temp[i]);
        }
        this.setState({
          answers: ds.cloneWithRows(temp),
        },
        function() { console.log('') }
      );
      });
    });
  }
  componentDidMount(){
  }

  goToScreen = (screenName) => {
    Navigation.push(this.props.componentId,{
      component: {
        name: screenName
      }
    })
  }

  moveNext(name){
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM Answers WHERE name=? AND question_id=?', [name,QuizStorage.getQID()], (tx, results) => {
          var temp = [];
          temp.push(results.rows.item(0).is_true);
          if (temp[0]==1){
            QuizStorage.pullScore();
          }
          console.log('ANSWER',temp[0]);
          console.log('Score',QuizStorage.getScore());
      });
    });
    if (QuizStorage.getQuestion_id()+1 < QuizStorage.getTasks()){
        QuizStorage.pullQuestion_id();
        this.goToScreen('ExamScreen');
    }
    else{
        this.goToScreen('GameResultsScreen');
    }
  }




  render() {

    return (
      <View style={styles.container}>
        <View style={styles.container2}>
          <View style={styles.headerContainer}>
            <Text style = {styles.headerTitle}>Quiz {QuizStorage.getQuestion_id()+1}/{QuizStorage.getTasks()}</Text>
          </View>
          <View style={styles.question}>
            <Text style={styles.quizAnswerDescription}>{this.state.question}</Text>
          </View>
          <View style={styles.answers}>
          <ListView
            dataSource={this.state.answers}
            enableEmptySections={true}
            renderRow={rowData => (
              <TouchableOpacity onPress={() => this.moveNext(rowData.name)}>
                <View style={styles.quizOption}>
                  <Text style={styles.quizOptionDescription}>{rowData.name}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
          </View>
        </View>
      </View>
    );
  }
  }

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  container2: {
    flex: 1,
    marginStart: 20,
    marginEnd: 20,
    marginTop: 20,
    marginBottom: 20,
  },
  question: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  answers: {
    flex: 2,
  },
  quizOption: {
    flex: 1,
    alignSelf: 'stretch',
    minHeight: 32,
    marginTop: 4,
    marginBottom: 4,
    backgroundColor: 'rgba(64, 64, 64,0.3)',
    borderRadius: 8,
  },
  quizOptionDescription: {
    flex: 1,
    padding: 12,
    color: '#ffffff',
    fontSize: 24,
    fontWeight:'normal',
    textAlign: 'center',
    textShadowColor:'#000000',
    textShadowOffset:{width: 2, height: 2},
    textShadowRadius:0,
  },
  quizAnswerDescription: {
    flex: 1,
    padding: 12,
    color: '#000000',
    fontSize: 20,
    fontWeight:'normal',
    textAlign: 'center',
  },
});
