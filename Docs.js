import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ListView,
  TouchableHighlight,
  Image
} from 'react-native';

class DocsComponent extends Component {
  constructor(props) {
    super(props);

    this.dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2
    });
  }

  _removeDoc(doc) {
    return () => this.props.onDocRemove(doc);
  }

  renderDoc(doc) {
    return (
      <View style={styles.container}>
        <TouchableHighlight
          onPress={this._removeDoc(doc)}
          underlayColor="aliceblue"
          style={styles.removeBtnContainer}
        >
          <Text style={styles.removeBtn}>Remove</Text>
        </TouchableHighlight>
        <View style={styles.rightContainer}>
          <Text style={styles.doc}>{doc.content}</Text>
        </View>
        <View style={styles.logoContainer}>
          <Image
            style={styles.logo}
            source={{uri: doc.imageUrl}}
            defaultSource={require('./assets/images/image-loading.png')}
          />
        </View>
      </View>
    );
  }

  render() {
    var dataSource = this.dataSource.cloneWithRows(this.props.docs);

    return (
      <ListView
        dataSource={dataSource}
        renderRow={this.renderDoc.bind(this)}
        enableEmptySections={true}
        style={styles.listView}
      />
    );
  }
}

const styles = StyleSheet.create({

  //List container
  listView: {
  },

  //List item
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    marginTop: 3,
    backgroundColor: 'white',
    borderColor: '#E8E8E8',
    borderWidth: 1,
    borderBottomColor: '#D4D4D4',
    borderBottomWidth: 1,
    borderRadius: 2,
  },

  //RemoveBtnContainer
  removeBtnContainer: {
    padding: 5,
  },

  //Remove BTN
  removeBtn: {
    fontSize: 10,
  },

  //Text container
  rightContainer: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
  },

  //item text
  doc: {
    fontSize: 18,
    textAlign: 'left',
  },

  //Logo Container
  logoContainer: {
    backgroundColor: 'red',
    width: 50,
  },

  //Logo
  logo: {
    width: 50,
    height: 50,
    backgroundColor: 'yellow',
  },

});

export default DocsComponent;
