import React, { PureComponent, useState } from 'react';
import PropTypes from 'prop-types';

import print from '../print.js';
import Change from '../Change.js';
import { TouchableOpacity, View, Text } from 'react-native';
import mmlOptions from "../mmlOptions.js";
import MathJax from 'react-native-mathjax-svg';
import { colors } from '../../../../Assets/colors.js';

export default class Step extends PureComponent {

  constructor(props){
    super(props)

    this.state = {
      expanded: false
    }
  }

  renderStep = (step) => {
    var renderedSubsteps = <View></View>
    
    if(step.substeps){
       renderedSubsteps = step.substeps.map(
        (step, index) => <Step step={step} key={index}/>);
    }
    
    const printMeth = step.step ? print.orgNode : print.newNode
    const root = step.step ? <MathJax>{print.newNode(step.step)}</MathJax> : <View></View>
  
    return <View style={{marginTop: 10}}>
      <MathJax>{printMeth(step)}</MathJax> 
      
      {step.substeps && 
      <TouchableOpacity onPress={this.changeSubs} style={{backgroundColor: colors.primaryColor, marginVertical:5, width:40}}>
        <Text>Sub</Text>
      </TouchableOpacity> }

      {this.state.expanded && 
      <View style={{paddingLeft:15}}>
        {root}
        {renderedSubsteps}
      </View>}
    </View>;
  }

  changeSubs = () =>{
    this.setState(
      {expanded: !this.state.expanded}
    )
  }

  render() {
    const {step} = this.props;

    const realStep = step.step ? step.step: step
  
    return(
    <View style={{marginTop:10}}>
      <MathJax>{Change.formatChange(realStep)}</MathJax>
      {this.renderStep(step)}
    </View>
    )
  }
}