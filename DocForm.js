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
        <TextInput
          style={styles.text}
          onChangeText={(doc) => this.setState({doc})}
          value={this.state.doc}
        />
        <Text onPress={this._onDocSubmit.bind(this)}>Add</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  text: {
    backgroundColor: 'white',
    width: 200,
    marginTop: 145,
    marginBottom: 145
  }
});

export default DocForm;
