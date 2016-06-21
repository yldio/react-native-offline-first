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

    this.defaultImgId = Date.now();
    this.imgId = this.defaultImgId;

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
      .on('error', err => console.log.bind(console, '[Sync:Error] - ' + err))
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
    var imageUrl = 'http://unsplash.it/200?random&t=' + this.imgId;

    localDB.put({_id: doc, content: doc, imageUrl: imageUrl})
      .catch(console.log.bind(console, 'Error inserting'));

    this.imgId++;

    if (this.imgId == this.defaultImgId + 3) {
      this.imgId = this.defaultImgId;
    }
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
        <View style={styles.containerForm}>
          <View style={styles.containerStatus}>
            <Text style={styles.statusText}>{this.state.syncStatus}</Text>
          </View>
          <DocForm
            onDocSubmit={this.onDocSubmit.bind(this)}
          />
        </View>
        <View style={styles.separator} />
        <View style={styles.containerList}>
          <Docs
            docs={this.state.docs}
            onDocRemove={this.onDocRemove.bind(this)}
          />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({

  //Status bar
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#EEEEEE',
  },

  //containerForm
  containerForm: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 10,
    marginTop: 40,
    backgroundColor: '#EEEEEE',
  },

  //containerStatus
  containerStatus: {
    backgroundColor: 'red',
    height: 10,
    marginBottom: 20,
    borderRadius: 20,
  },

  //Status Text
  statusText: {
    color: 'white',
    flexDirection: 'row',
    textAlign: 'center',
  },

  //containerList
  containerList: {
    paddingLeft: 10,
    paddingRight: 10,
  },

  //Separator - Add form/List
  separator: {
    height: 0,
    backgroundColor: 'aliceblue',
  }
});

export default DocsApp;
