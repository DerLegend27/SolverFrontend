import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import print from '../print.js';
import Change from '../Change.js';
import { View } from 'react-native';
import mmlOptions from "../mmlOptions.js";
import MathJax from 'react-native-mathjax';

export default class Step extends PureComponent {


  renderStep = (step) => {
    return <View>
      <MathJax mathJaxOptions={mmlOptions} html={"$"+print.newNode(step)+"$"}/>
    </View>;
  }


  render() {
    const {step} = this.props;

  
    return(
    <View>
      <MathJax mathJaxOptions={mmlOptions} html={"$"+Change.formatChange(step)+"$"}/>
      {this.renderStep(step)}
    </View>
    )
  }
}