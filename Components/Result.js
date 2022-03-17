import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Animated,
    LayoutAnimation,
    UIManager
} from "react-native"
import React, { PureComponent, useEffect, useRef } from "react"
import { wp, hp } from '../Helper/Converter';
import { ResultView } from "./ResultView";
import { InfoBox } from "./InfoBox";
import { useState } from "react/cjs/react.development";
import Steps from "./Solver/Algebra/Components/Steps";
import { mmlOptions } from "./Solver/Algebra/mmlOptions";
import QSteps from "./Solver/Questions/Components/QSteps";


const eyo = 0

if (
    Platform.OS === "android" &&
    UIManager.setLayoutAnimationEnabledExperimental
  ) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

export class Result extends PureComponent {
    constructor(props) {
        super(props)

        this.navigation = props.navigation

        this.isVisible = false
        this.hasFailure = false
        this.field = false

        this.state = {
            responseText: "",
        }
    }



    render() {

        if (this.state.isVisible && this.hasFailure) {
            console.log("Failure View")
            return <FailureView failureMessage={this.state.responseText} goBack={() => this.navigation.goBack()} />

        }
        else if (this.state.isVisible) {
            console.log("ASd View")
            return (
                <SuccessView solutionText={this.state.responseText} goBack={() => this.navigation.goBack()} field={this.field} />
            )
        }
        else {
            return null
        }

    }


    sendPicture = async (pic) => {
        const picData = new FormData();
        const url = "http://178.6.243.103/api"
        picData.append("image", pic)
        var response= ""
        try {
            const controller = new AbortController()
            const timeoutId = setTimeout(() => controller.abort(), 10000)
            response = await fetch(
                url,
                {
                    signal: controller.signal,
                    method: 'post',
                    body: picData,
                    headers: {
                        "Content-Type":
                            'multipart/form-data'
                    }
                }
            )
            return response
            console.log("debug")


        } catch (error) {
            console.log("res: " + response)
            console.error("Connection error: " + error)

        }
    }

    

    receiveResponseText = async (pic) => {
        try {
            const response = await this.sendPicture(pic)
            const json = await response.json()

            if (json.status == "failure") {
                const failureMessage = "Aufgabe konnte nicht erkannt werden"
                this.setState({
                    hasFailure: true
                })
                return failureMessage
            } else {
                return json.solution
            }

        } catch (error) {
            console.error("Json Receiving Error: " + error)
            const failureMessage = "Keine Verbindung zum Server"
            this.hasFailure = true
            return failureMessage
        }
        
      


    }


    

    displayResponseText = async (pic) => {
        try {
            
        
            var responseText = ""
         if(pic.includes("field")){
            const question = pic.split("field:")[1]
             responseText = await this.receiveGpt(question)
             this.field = true
             console.log("resa: " ,responseText)
         }else{
             responseText = await this.receiveResponseText(pic)
         }
            this.setState({
                responseText: responseText
            })
          
            console.log("im display: " + responseText)
            this.setState({
                isVisible: true
            })

           
        } catch (error) {
            console.error("Displaying Error: " + error)
            throw error
        }

    }


    receiveGpt = async(question) =>{
        const picData = new FormData();
        const url = "http://178.6.243.103/nlp"
        picData.append("text", question)
        var response= ""
        try {
            const controller = new AbortController()
            const timeoutId = setTimeout(() => controller.abort(), 10000)
            response = await fetch(
                url,
                {
                    signal: controller.signal,
                    method: 'post',
                    body: question,
                    headers: {
                        "Content-Type":
                            'multipart/form-data'
                    }
                }
            )

            console.log("jason: " ,response.json())
            return response.json().solution
            console.log("debug")


        } catch (error) {
            console.log("res: " + response)
            console.error("Connection error: " + error)

        }
    }

}



const FailureView = ({ failureMessage, goBack }) => {
    return (
        <ResultView title={"Fehler"} btnText={"Aufgabe erneut scannen"} onPress={goBack} scanBottom={32} mainView={
            <InfoBox mainView={
                <Text style={{ fontSize: 17, color: "black", alignSelf: "center" }}>{failureMessage}</Text>
            } />

        } />
    )
}
const SuccessView = ({ solutionText, goBack, field }) => {
    if(field){
        console.log("sos ", solutionText)
        return(
            <ResultView title={"Lösungen"} scanBottom={500} btnText={"Weitere Aufgabe scannen"} onPress={goBack} mainView={
                <ScrollView>
                    <SolutionBtn name={"Rechnung"} resView={<QSteps input={solutionText}/>}/>
                    <SolutionBtn name={"Graph"} resView = {<View></View>} />
                    <SolutionBtn name={"Nullstellen"} resView = {<View></View>} />
                    <SolutionBtn name={"Ableitung"} resView = {<View></View>} />
                </ScrollView>
            } />
        )
    }
    return (
        <ResultView title={"Lösungen"} scanBottom={500} btnText={"Weitere Aufgabe scannen"} onPress={goBack} mainView={
            <ScrollView>
                <SolutionBtn name={"Rechnung"} resView={<Steps input={"0=2+5x"}/>}/>
                <SolutionBtn name={"Graph"} resView = {<View></View>} />
                <SolutionBtn name={"Nullstellen"} resView = {<View></View>} />
                <SolutionBtn name={"Ableitung"} resView = {<View></View>} />
            </ScrollView>
        } />
    )
}



class SolutionBtn extends PureComponent{
    
    constructor(props) {
        super(props)
        const{name, resView} = props
        this.resView = resView
        this.name = name
        this.expanded = false
        const btnHeight = 30

      /*  this.state ={
            maxHeight:1000,
            maxWidth:1000
        } */

        this.state={
            expanded:false
        }

        
        
    }
    
    componentDidMount(){
     /*   this.setState({
            maxHeight:0,
            maxWidth:0,
            
        }) */
    }
    
    expandBtn = () =>{
        LayoutAnimation.configureNext(LayoutAnimation.Presets.linear)
        
        if(!this.state.expanded){
          /*  this.setState({
                maxHeight:"100%",
                maxWidth:1000
            }) */
            this.setState(
                {expanded:true}
            )
            
        }

      //  this.expanded = !this.expanded
    }

 

  

    render() {
    return(
    <TouchableOpacity style={styles.successContainer} onPress={this.expandBtn}>
        <InfoBox mainView={
           <Animated.View style={{minHeight: 30}}>
                    <Text style={styles.successText}>{this.name}</Text>
    
                    <View>
                       {this.state.expanded && this.resView}
                    </View>
        </Animated.View> } 
        />
    </TouchableOpacity>
    )
        }
   
}



const styles = StyleSheet.create({
    successContainer:{
       marginTop:hp(10)
    },
    successText:{
        fontSize: 17,
        color: "black"
    }
});




