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
import React, { PureComponent, useRef } from "react"
import { wp, hp } from '../Helper/Converter';
import { ResultView } from "./ResultView";
import { InfoBox } from "./InfoBox";
import { useState } from "react/cjs/react.development";
import Steps from "./Solver/Components/Steps";
import MathJax from "react-native-mathjax";
import { mmlOptions } from "./Solver/mmlOptions";


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
                <SuccessView solutionText={this.state.responseText} goBack={() => this.navigation.goBack()} />
            )
        }
        else {
            return null
        }

    }


    sendPicture = async (pic) => {

        const picData = new FormData();
        const url = "http://10.0.2.2:8080"
        picData.append("image", pic)

        try {
            const controller = new AbortController()
            const timeoutId = setTimeout(() => controller.abort(), 5000)
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


        } catch (error) {
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

            const responseText = await this.receiveResponseText(pic)
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
const SuccessView = ({ solutionText, goBack }) => {
    return (
        <ResultView title={"Lösungen"} scanBottom={500} btnText={"Weitere Aufgabe scannen"} onPress={goBack} mainView={
            <ScrollView>
                <SolutionBtn name={"Rechnung"} />
                <SolutionBtn name={"Graph"} />
                <SolutionBtn name={"Nullstellen"} />
                <SolutionBtn name={"Ableitung"} />
            </ScrollView>
        } />
    )
}



const SolutionBtn = ({ name }) => {
    const btnHeight = 30
    const translateAnim = new Animated.Value(btnHeight)
    const [expanded, setExpanded] = useState(false)

    startSizeAnim = () =>{
        LayoutAnimation.configureNext(LayoutAnimation.Presets.linear)
        setExpanded(!expanded)
    }

    return (
    <TouchableOpacity style={styles.successContainer} onPress={startSizeAnim
    }>
        <InfoBox mainView={
            <Animated.View style={{minHeight: 30}}>
                    <Text style={styles.successText}>{name}</Text>
                    {expanded && <Steps input={"2x +3 = 4x + 5"}/>}
            </Animated.View>}
        />
    </TouchableOpacity>
    )

   
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




