import React, { Component } from 'react';
import {
  StyleSheet,
  View
} from 'react-native';

import DocForm from './DocForm';
import Docs from './Docs';

class DocsApp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      docs: ['Item1', 'Item2']
    }
  }

  onDocSubmit(doc) {
    this.setState({
      docs: this.state.docs.concat(doc)
    })
  }

  onDocRemove(oldDoc) {
    this.setState({
      docs: this.state.docs.filter(doc => doc !== oldDoc)
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <DocForm
          onDocSubmit={this.onDocSubmit.bind(this)}
        />
        <View style={styles.separator} />
        <Docs
          docs={this.state.docs}
          onDocRemove={this.onDocRemove.bind(this)}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  separator: {
    height: 1,
    backgroundColor: '#eeeeee',
  }
});

export default DocsApp;
