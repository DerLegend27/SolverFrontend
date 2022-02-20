import React, { PureComponent } from 'react';
import mathsteps from 'mathsteps';

import print from '../print.js';
import Step from './Step.js';
import { View } from 'react-native';
import MathJax from 'react-native-mathjax';
import { mmlOptions } from '../mmlOptions.js';

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
    return <View>
      <MathJax mathJaxOptions={mmlOptions} html={"$"+print.oldNode(steps[0])+"$"}/>
      {renderedSteps}
    </View>;
  }

  render() {
    const {input} = this.props;
    const isEquation = this.isEquation(input);
    const steps = isEquation
      ? mathsteps.solveEquation(input)
      : mathsteps.simplifyExpression(input);

    if (steps.length === 0) {
      console.log("Keine Steps")
    }

    return <View>
      {this.renderSteps(steps)}
    </View>;
  }
}