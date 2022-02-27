import React, { PureComponent } from 'react';
import mathsteps from 'mathsteps';

import print from '../print.js';
import Step from './Step.js';
import { View, Text } from 'react-native';
import MathJax from 'react-native-mathjax-svg';
import { mmlOptions } from '../mmlOptions.js';
import { organizeSteps } from '../organizeSteps.js';

export default class Steps extends PureComponent {
  

  isEquation(mathInput) {
    const comparators = ['<=', '>=', '=', '<', '>'];
    let isEquation = false;

    comparators.forEach(comparator => {
      if (mathInput.includes(comparator)) isEquation = true;
    });
    return isEquation;
  }

  renderSteps = (steps) => {
    const renderedSteps = steps.map(
      (step, index) => <Step step={step} key={index}/>);
    return <View style={{marginTop:20}}>
      <MathJax>{print.oldNode(steps[0].step)}</MathJax>
      {renderedSteps}
    </View>
  }

  render() {
    const {input} = this.props;
    const isEquation = this.isEquation(input);
    const steps = isEquation
      ? mathsteps.solveEquation(input)
      : mathsteps.simplifyExpression(input);

    if (steps.length === 0) {
      console.log("Keine Steps")
      return <View><Text>Gleichung nicht erkannt</Text></View>
    }
    const orgSteps = organizeSteps(steps)
    /*orgSteps.forEach(step =>{
      console.log("Main: " + step.step.changeType +"\n")
      if(step.substeps){
        step.substeps.forEach( sub =>{
          console.log("Sub: "+sub.changeType)
        }
        )
      } 

    }) */
    

   /* steps.forEach(step =>{
      console.log("Step: " + step.changeType + "\n")
      step.substeps.forEach(sub =>{
        console.log("Sub: " + sub.changeType)
      })
    }) */
    return <View>
      {this.renderSteps(orgSteps)}
    </View>;
  }
}