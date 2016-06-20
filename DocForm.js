import React, { Component } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet
} from 'react-native';

class DocForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      doc: ''
    };
  }

  _onDocSubmit(rowData, rowId) {
    this.props.onDocSubmit(this.state.doc);
    this.setState({
      doc: ''
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.text}
            onChangeText={(doc) => this.setState({doc})}
            value={this.state.doc}
          />
        </View>
        <Text
          onPress={this._onDocSubmit.bind(this)}
          style={styles.btn}
          >Add item
        </Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({

  //Main container - add text box
  container: {
    flex: 1,
    flexDirection: 'row',
  },

  //inputContainer
  inputContainer: {
    flex: 0.5,
    borderWidth: 1,
    borderColor: '#D4D4D4',
    backgroundColor: 'white',
    height: 35,
    marginBottom: 10,
    marginRight: 10,
    borderRadius: 2,
  },

  //Text input
  text: {
    height: 30,
    marginBottom: 10,
    paddingLeft: 10,
    paddingTop: 5,
  },

  //Button
  btn: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 8,
    height: 34,
    textAlign: 'center',
    color: 'white',
    backgroundColor: '#3068C6',
    borderRadius: 2,
  }
});

export default DocForm;
