// react
import React from "react";
import { Text, View, DeviceEventEmitter, StyleSheet, Alert, Platform, AsyncStorage } from "react-native";
import Kontakt from 'react-native-kontaktio';
import BeaconBroadcast from 'react-native-ibeacon-simulator'
//import Permissions from 'react-native-permissions'
// define variables
const { connect, startScanning } = Kontakt;
const companyBeacon = {
  identifier: "Estimotes",
  uuid: "b9407f30-f5f8-466e-aff9-25556b57fe6d"
};

// export class
export default class Authenticated extends React.Component {
  // constructor
  constructor(props) {
    super(props);
    this.state = {
      recent: false,
      permissions: false,
      uuid: ''
    };
  }

  // open door function
  openDoor = async () => {
    console.log('OPEN SESSAME')
    try {
      let response = await fetch('http://192.168.0.94:3000/api/key/open',{
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-KEY': this.props.uuid }
      })
      if (response.status === 200) {
        console.log('DOOR IS OPENING');
      }
    } catch(err) {
      console.log(err)
    }
  }

  // helper function to load passcode from local storage
  fetchStore = async () => {
    try {
      const value = await AsyncStorage.getItem('@CompanyStore:uuid');
      if (value && value.length > 0){
        this.setState({uuid:value})
      }
    } catch (err) {
      console.log(err)
    }
  }

  broadcastSignal = () => {
    let uuid = this.state.uuid
    let identifier = ''
    let major = 666
    let minor = 333

    BeaconBroadcast.checkTransmissionSupported()
    .then(() => {
      BeaconBroadcast.stopAdvertisingBeacon()
      BeaconBroadcast.startAdvertisingBeaconWithString(uuid, identifier, major, minor)
      setTimeout(()=>BeaconBroadcast.stopAdvertisingBeacon(),2000)
    })
    .catch((err) => {
      console.log(err)
    })
  }

  // component did mount
  componentWillMount() {
    this.fetchStore();
    // start monitoring beacons
    connect()
    .then(() => startScanning())
    .catch(error => console.log('error', error));
    DeviceEventEmitter.addListener(
      'beaconsDidUpdate',
      ({ beacons, region }) => {
        if (beacons[0] && beacons[0].proximity === 'IMMEDIATE' && this.state.recent === false && beacons[0].uuid === companyBeacon.uuid) {
          console.log('OPEN DOOR BLUETOOTH FROM', this.state.uuid)
          //this.openDoor();
          this.broadcastSignal()
          this.setState({recent:true})
          setTimeout( () => this.setState({recent:false}),10000)
        }
      }
    );
  }

  // render view ---------------------------------------------------------
  render() {
    return (
      <View style={styles.container} >
        <Text style={styles.white}>To open the door, place your phone near the beacon.</Text>
        <Text style={styles.white}>Make sure your bluetooth is enabled AND that the Company application has LOCATION permissions.</Text>
      </View>
    )
  }
}

// styles
const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: '10%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  white: {
    color: 'white',
    textAlign: 'center',
    paddingBottom: 20
  }
});
