import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, ListView, AppRegistry, FlatList} from 'react-native';
type Props = {};
export default class ResultScreen extends Component<Props> {
  state = {
      data: ''
   }
   componentDidMount = () => {
      fetch('https://pwsz-quiz-api.herokuapp.com/api/results', {
         method: 'GET'
      })
      .then((response) => response.json())
      .then((responseJson) => {
         console.log(responseJson);
         this.setState({
            data: responseJson
         })
      })
      .catch((error) => {
         console.error(error);
      });
   }

render() {
   return(
     <View style={{flex: 1, paddingTop:20}}>
      <View style={styles.txt}>
         <View style={styles.txt3}><Text style={styles.bold}> Nick </Text></View>
         <View style={styles.txt3}><Text style={styles.bold}> Score </Text></View>
         <View style={styles.txt3}><Text style={styles.bold}> Total </Text></View>
         <View style={styles.txt3}><Text style={styles.bold}> Type </Text></View>
         <View style={styles.txt3}><Text style={styles.bold}> Date </Text></View>
      </View>
       <FlatList
         data={this.state.data}
         renderItem={({item}) => (
           <View style={styles.txt}>
             <View style={styles.txt2}><Text>{item.nick}</Text></View>
             <View style={styles.txt3}><Text>{item.score}</Text></View>
             <View style={styles.txt2}><Text>{item.total}</Text></View>
             <View style={styles.txt3}><Text>{item.type}</Text></View>
             <View style={styles.txt2}><Text>{item.date}</Text></View>
           </View>
         )}
         keyExtractor={({id}, index) => id}
       />
     </View>
   );
 }

}

const styles = StyleSheet.create({
  txt: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    marginTop: 12,
  },
  txt2: {
    backgroundColor: 'orange',
    width: '20%',
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
  },
  txt3: {
    backgroundColor: 'white',
    width: '20%',
    justifyContent: 'center',
    alignItems: 'center',
    height: 50
  },
  bold: {
    fontWeight: 'bold'
  },
});
