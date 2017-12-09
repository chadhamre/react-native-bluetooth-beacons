// import modules
import React from "react";
import { Text, View, DeviceEventEmitter, StyleSheet, Alert, AsyncStorage } from "react-native";
const Permissions = require('react-native-permissions');
const Beacons = require("react-native-ibeacon");
import BeaconBroadcast from 'react-native-ibeacon-simulator';

// defind beacon of interest
const region = {
  identifier: "Estimotes",
  uuid: "B9407F30-F5F8-466E-AFF9-25556B57FE6D"
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
    BeaconBroadcast.stopAdvertisingBeacon()
    BeaconBroadcast.startAdvertisingBeaconWithString(uuid, identifier, major, minor)
    setTimeout(()=>BeaconBroadcast.stopAdvertisingBeacon(),500)
  }

  // component did mount
  componentWillMount = async () => {

    this.fetchStore();

    Permissions.request('location', 'always').then(response => {
      console.log('request permissions',response)
      this.setState({ locationPermission: response })
    })

    // monitor for beacon
    Beacons.startMonitoringForRegion(region);
    Beacons.startRangingBeaconsInRegion(region);
    DeviceEventEmitter.addListener("beaconsDidRange", data => {

      if (data.beacons[0] && data.beacons[0].proximity === 'immediate' && this.state.recent === false) {
        console.log('OPEN DOOR BLUETOOTH FROM', this.state.uuid)
        //this.openDoor();
        this.broadcastSignal()
        this.setState({recent:true})
        setTimeout( () => this.setState({recent:false}),10000)
      }
    })
  };


  // render view ---------------------------------------------------------
  render() {
    return (
      <View style={styles.container} >
        <Text style={styles.white}> To open the door, place your phone near the green beacon. Make sure your bluetooth is enabled.</Text>
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
    textAlign: 'center'
  }
});
