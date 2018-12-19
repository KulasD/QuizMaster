import React, {Component} from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Button,
  TouchableOpacity,
  FlatList,
  Modal,
  TouchableHighlight,
  AsyncStorage,
  ListView,
} from 'react-native';

// Ignore Yellow Box Warnings
console.disableYellowBox = true;

import {Navigation} from "react-native-navigation";
import QuizStorage from '../QuizStorage'
import { openDatabase } from 'react-native-sqlite-storage';
var db = openDatabase({ name: "baza.db", createFromLocation : 1 });
type Props = {};
export default class MainScreen extends Component<Props> {

  goToScreen = (screenName) => {
    Navigation.push(this.props.componentId,{
      component: {
        name: screenName
      }
    })
  }

  constructor(props) {
    QuizStorage.setQuestion_id(0);
    QuizStorage.setScore(0);
    super(props);
    var today = new Date(),
    tday = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
    });
    this.state = {
      dataSource: ds.cloneWithRows([]),
      tday: tday,
    };
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM Quizes', [], (tx, results) => {
        var temp = [];
        for (let i = 0; i < results.rows.length; ++i) {
          temp.push(results.rows.item(i));
        }
        this.setState({
          dataSource: ds.cloneWithRows(temp),
        });
      });
    });
  }

  componentDidMount() {
    fetch('https://pwsz-quiz-api.herokuapp.com/api/tests')
    .then((response) => response.json())
    .then((responseJson) => {
        this.getTest(responseJson)
        this.setState({
           data: responseJson,
        });

    })
    .catch((error) => {
       console.error(error);
    });
    }

    getTest(items) {
      db.transaction(function(tx) {
       tx.executeSql('DROP TABLE IF EXISTS Quizes;');
       tx.executeSql('CREATE TABLE IF NOT EXISTS Quizes (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)');
       tx.executeSql('DROP TABLE IF EXISTS Questions;');
       tx.executeSql('CREATE TABLE IF NOT EXISTS Questions (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, quiz_id INTEGER)');
       tx.executeSql('DROP TABLE IF EXISTS Answers;');
       tx.executeSql('CREATE TABLE IF NOT EXISTS Answers (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, question_id INTEGER, is_true TEXT)');
     });
      const url ='https://pwsz-quiz-api.herokuapp.com/api/test'
      const ids = items.map(item => `${url}/${item.id}`);
      ids.forEach(item => {
        id_Quiz_numerator = 1;
        id_Question_numerator = 1;
        return fetch(item)
       .then((response2) => response2.json())
       .then((responseJson2) => {
         const name = responseJson2.name;
                db.transaction(function(tx) {
                   tx.executeSql(
                     'INSERT INTO Quizes (id,name) VALUES (?,?)',
                     [id_Quiz_numerator,name],
                   );
                   for (let h = 0; h < responseJson2.tasks.length; ++h) {
                     const question = responseJson2.tasks[h].question;
                     tx.executeSql(
                       'INSERT INTO Questions (id,name,quiz_id) VALUES (?,?,?)',
                       [id_Question_numerator,question,id_Quiz_numerator],
                     );
                     for (let k = 0; k < responseJson2.tasks[h].answers.length; ++k){
                       const answer = responseJson2.tasks[h].answers[k].content;
                       const correct = responseJson2.tasks[h].answers[k].isCorrect;
                       tx.executeSql(
                         'INSERT INTO Answers (name,question_id,is_true) VALUES (?,?,?)',
                         [answer,id_Question_numerator,correct],
                       );
                     }
                     id_Question_numerator++;
                   }
                  id_Quiz_numerator++;
                 });
       })
     })
   }
  setTest(item){
     const name = item;
     QuizStorage.setQuiz_name(name);
     db.transaction(function(tx) {
       tx.executeSql('SELECT * FROM Quizes WHERE name=?', [name], (tx, results) => {
         QuizStorage.setQuiz_id(results.rows.item(0).id);
         tx.executeSql('SELECT COUNT(name) AS id FROM Questions WHERE quiz_id=?', [results.rows.item(0).id], (tx, results2) => {
           QuizStorage.setTasks(results2.rows.item(0).id);
         });
       });
    });
    this.goToScreen('ExamScreen');
   }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.container2}>
        <View>
        <FtreScreen pagekey={"uniquekey"} title={"categort title"} description={"topic description"}/>
          </View>
          <View style={styles.headerContainer}>
            <Text style = {styles.headerTitle}>Choose Quiz</Text>
          </View>
          <ListView
            dataSource={this.state.dataSource}
            enableEmptySections={true}
            renderRow={rowData => (
              <TouchableOpacity
                onPress={() => this.setTest(rowData.name)}
              >
                <View style={styles.game}>
                    <View style={styles.gameData}>
                      <Text style={styles.gameName}>{rowData.id}</Text>
                      <Text style={styles.gameName}>{rowData.name}</Text>
                    </View>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
        <View style={styles.footer}>
          <Text style={styles.footerTXT}>Check your result !</Text>
          <Button color="#494949" title='ResultScreen' onPress={() =>this.goToScreen('ResultScreen')}/>
        </View>
      </View>
    );
  }
}

class FtreScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false
    };
  }
  componentDidMount() {
    AsyncStorage.getItem(this.props.pagekey, (err, result) => {
      if (err) {
      } else {
        if (result == null) {
          console.log("null value recieved", result);
          this.setModalVisible(true);
        } else {
          console.log("result", result);
        }
      }
    });
    AsyncStorage.setItem(this.props.pagekey, JSON.stringify({"value":"true"}), (err,result) => {
            console.log("error",err,"result",result);
            });
  }
  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }
  render() {
    return (
      <View>
        <Modal
          animationType={"slide"}
          transparent={true}
          style={styles.ftreContainer}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            alert("Modal has been closed.");
          }}
        >
          <View style={styles.ftreContainer}>
            <View style={styles.ftreTitleContainer}>
              <Text style={styles.ftreTitle}>REGULAMIN APLIKACJI MOBILNEJ „QUIZ"</Text>
            </View>
            <View style={styles.ftreDescriptionContainer}>
              <Text style={styles.ftreDescription} allowFontScaling={true}>
              Here are rules ( to do )
              </Text>
            </View>
            <View style={styles.ftreExitContainer}>
              <TouchableHighlight
                onPress={() => {
                  this.setModalVisible(!this.state.modalVisible);
                }}
              >
                <View style={styles.ftreExitButtonContainer}>
                  <Text style={styles.ftreExitButtonText}>Exit</Text>
                </View>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  container2: {
    flex: 4,
    marginStart: 20,
    marginEnd: 20,
    marginTop: 20,
    marginBottom: 20,
  },
  headerContainer : {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor : '#000000',
  borderWidth: 1,
  borderRadius: 8,
  marginBottom : 30,
  },
  headerTitle : {
    fontWeight: '300',
    color: '#ffffff',

    fontSize: 28,
    fontWeight: '900',
  },
  footerTXT: {
    fontSize: 24,
    fontFamily: "BlackHanSans-Regular",
    marginBottom: 10,
  },
  footer: {
    flex: 1,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#434343',
    alignItems: 'center',
  },
  ftreContainer:{
  		backgroundColor:'white',
  		flex:1,
  		marginTop:70,
  		marginBottom:40,
  		marginLeft:20,
  		marginRight:20,
  		borderRadius:8,
  		borderWidth:4,
  		borderColor:'orange'
  	},
  	ftreTitle:{
  		color:'black',
          fontWeight:'bold',
  		fontSize:20,
  		textAlign:'center',
  		margin:10,
  	},
  	ftreDescription:{
  		color:'black',
          fontSize:15,
  		marginRight:20,
  		marginLeft:20
  	},
  	ftreCloseIcon:{
  		alignSelf:'flex-end',
  		flex:0.5,
  		marginRight:10
  	},
  	ftreTitleContainer:{
  		flex:1,
  		flexDirection:'row',
  		justifyContent:'center',
  		alignItems:'center'
  	},
  	ftreDescriptionContainer:{
  		flex:6.5
  	},
  	ftreExitContainer:{
  		flex:2,
  		justifyContent:'flex-start',
  		alignItems:'center',
  	},
  	ftreExitButtonContainer:{
  		width:200,
  		height:40,
  		backgroundColor:'orange',
  		borderRadius:10,
  		justifyContent:'center',
  	},
  	ftreExitButtonText:{
  		color:'black',
  		fontSize:20,
  		fontWeight:'bold',
  		textAlign:'center'
  	},
    game: {
      flex: 1,
      flexDirection: 'row',
      minHeight: 80,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: '#434343',
      marginBottom: 20,
      borderRadius: 8,
    },

    gameData: {
      flex: 1,
      padding: 20,
    },

    gameName: {
      color: '#000000',

      fontSize: 20,
      fontWeight: 'bold',
      textAlign: 'center',

      textShadowColor:'#ffffff',
      textShadowOffset:{width: 2, height: 2},
      textShadowRadius:0,

    },
});
