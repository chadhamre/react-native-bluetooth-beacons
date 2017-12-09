// react
import React from "react";
import { Text, View, StyleSheet, TextInput, AsyncStorage } from "react-native";

// export class
export default class Register extends React.Component {
  // constructor
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      uuid: ''
    };
  }

  // text handler
  submitHandler = async () => {
    const passcode = this.state.text;
    this.setState({text: ''})
    try {
      console.log('SENDING POST')
      let response = await fetch('http://192.168.0.94:3000/api/key/login',{
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-KEY' : passcode
        }
      })
      console.log('RESPONSE',JSON.parse(response._bodyText).uuid)
      if (response.status === 200) {
        this.setState({uuid:JSON.parse(response._bodyText).uuid})
        this.saveId(this.state.uuid)
      }
    } catch(err) {
      console.error(err)
    }
  }

  // save ID to local storage
  saveId = async (uuid) => {
    console.log('SAVING TO MEMORY', uuid)
    try {
      await AsyncStorage.setItem('@CompanyStore:uuid', uuid);
      this.props.function();
    } catch (err) {
      console.error(err)
    }
  }

  // render view ---------------------------------------------------------
  render() {
    return (
      <View style={styles.container} >
        <Text style={styles.white}>enter your one-time passcode</Text>
        <TextInput
          keyboardType='number-pad'
          returnKeyType='done'
          style={styles.passcode}
          onChangeText={(text) => this.setState({text})}
          onSubmitEditing={()=> this.submitHandler()}
          value={this.state.text}
         />
      </View>
    )
  }
}

// styles
const styles = StyleSheet.create({
  container: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  white: {
    color: 'white'
  },
  passcode: {
    backgroundColor: 'white',
    margin: 10,
    padding: 10,
    width: '64%'
  }
});
