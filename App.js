// import modules
import React from "react";
import { StyleSheet, Text, View, AsyncStorage, Platform } from "react-native";

// import components
import Register  from './components/Register';
if (Platform.OS === 'ios') {Authenticated = require('./components/Authenticated').default} else {}
if (Platform.OS === 'android') {AuthenticatedAndroid = require('./components/AuthenticatedAndroid').default} else {}


// exported class
export default class App extends React.Component {
  // constructor
  constructor(props) {
    super(props);
    this.state = {
      uuid: null
    };
  }

  // component will component
  componentWillMount = () => {
    this.fetchStore()
  }

  // helper function to load uuid from local storage
  fetchStore = async () => {
    try {
      const value = await AsyncStorage.getItem('@CompanyStore:uuid');
      if (value && value.length > 0){
        this.setState({uuid:value})
      }
    } catch (err) {
      console.error(err)
    }
  }



  // render view ---------------------------------------------------------
  render () {
  // uuid screen
  if (this.state.uuid === null) {
    return (
      <View style={styles.container} >
        <Register function={this.fetchStore.bind(this)}/>
      </View>
    )
  }
  // authenticated user screen ios
  else if (Platform.OS === 'ios') {
    return (
      <View style={styles.container}>
        <Authenticated uuid={this.state.uuid}/>
      </View>
    )
  }
  // authenticated user screen ios
  else  {
    return (
      <View style={styles.container}>
        <AuthenticatedAndroid uuid={this.state.uuid}/>
      </View>
    )}
  }
}

// styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fd7b28",
    alignItems: "center",
    justifyContent: "center"
  }
})
