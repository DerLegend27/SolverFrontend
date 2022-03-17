import React, { PureComponent } from 'react';


import { View, Text } from 'react-native';
import makeRequest from '../makeRequest.js';

export default class QSteps extends PureComponent {
  

 

  renderSteps = (answer) =>{
 
    var sentences = answer.split(/[\n.]+/)
    var steps = ["lol", "lol"]
    console.log(sentences)
    sentences.forEach(sentence => {
      var phrase = ""
      console.log(sentence)
      if(sentence.includes("<<")){
        phrase = sentence.split("<<")[0] + sentence.split(">>")[1]
      }else{
        phrase = sentence
      }
      steps.push(phrase)
    });
    const renderedSteps = steps.map(
      (phrase, index) => <Text key={index}>{phrase}</Text>
    )
    
    return <View>{renderedSteps}</View>
  }
  
  render() {
    const {question} = this.props;

   return <View>
     {this.renderSteps(question)}
   </View>;

  }
}
