import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text
} from 'react-native';

import PouchDB from 'pouchdb';
import PouchSync from 'pouch-websocket-sync';
import _ from 'lodash';

import DocForm from './DocForm';
import Docs from './Docs';

const localDB = new PouchDB('docs');

const syncEvents = ['change', 'paused', 'active', 'denied', 'complete', 'error'];
const clientEvents = ['connect', 'disconnect', 'reconnect'];

class DocsApp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      docs: [],
      syncStatus: ''
    };
  }

  addDoc(newDoc) {
    if (!_.find(this.state.docs, '_id', newDoc._id)) {
      this.setState({
        docs: this.state.docs.concat(newDoc)
      });
    }
  }

  removeDoc(oldDoc) {
    this.setState({
      docs: this.state.docs.filter(doc => doc._id !== oldDoc._id)
    });
  }

  componentDidMount() {
    localDB.allDocs({include_docs: true})
      .then(results => {
        this.setState({
          docs: results.rows.map(row => row.doc)
        });
      }).catch(err => console.log.bind(console, '[Fetch all]'));

    const syncClient = PouchSync.createClient();

    const sync = syncClient
      .connect('ws://localhost:3001')
      .on('error', console.log.bind(console, '[Sync:Error] - ' + err))
      .sync(localDB, {
        remoteName: 'docs',
      });

    localDB.changes({
      live: true,
      include_docs: true
    }).on('change', this.handleChange.bind(this))
      .on('complete', console.log.bind(console, '[Change:Complete]'))
      .on('error', console.log.bind(console, '[Change:Error]'));

    syncEvents.forEach(event => {
      sync.on(event, setCurrentState.bind(this, event));
    });

    clientEvents.forEach(event => {
      syncClient.on(event, setCurrentState.bind(this, event));
    });

    function setCurrentState(state) {
      console.log('[Sync:' + state + ']');

      this.setState({
        syncStatus: state
      });
    }
  }

  onDocSubmit(doc) {
    localDB.put({_id: doc, content: doc, imageUrl: 'http://facebook.github.io/react/img/logo_og.png?' + (+new Date())})
      .catch(console.log.bind(console, 'Error inserting'));
  }

  onDocRemove(oldDoc) {
    localDB.remove(oldDoc)
      .catch(console.log.bind(console, 'Error removing'));
  }

  handleChange(change) {
    console.log('[Change:Change]', change);

    var doc = change.doc;

    if (!doc) {
      return;
    }

    if (doc._deleted) {
      this.removeDoc(doc);
    } else {
      this.addDoc(doc);
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>{this.state.syncStatus}</Text>
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
