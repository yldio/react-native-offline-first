/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

process.nextTick = setImmediate

import React, { Component } from 'react';
import { AppRegistry } from 'react-native';

import DocsApp from './DocsApp'

class ReactNativeOffline extends Component {
  render() {
    return (
      <DocsApp />
    );
  }
}

AppRegistry.registerComponent('ReactNativeOffline', () => ReactNativeOffline);
