import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    ScrollView
} from "react-native"
import React, { PureComponent } from "react"
import { wp, hp } from '../Helper/Converter';
import { ResultView } from "./ResultView";
import { InfoBox } from "./InfoBox";

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
        <ResultView title={"Fehler"} btnText={"Aufgabe erneut scannen"} onPress={goBack} mainView={
            <InfoBox mainView={
                <Text style={{ fontSize: 17, color: "black", alignSelf: "center" }}>{failureMessage}</Text>
            } />

        } />
    )
}
const SuccessView = ({ solutionText, goBack }) => {
    return (
        <ResultView title={"Lösungen"} btnText={"Weitere Aufgabe scannen"} onPress={goBack} mainView={
            <ScrollView>
                <SolutionBtn name={"Nullstellen"} />
                <SolutionBtn name={"Hi"} />
                <SolutionBtn name={"Hi"} />
                <SolutionBtn name={"Hi"} />
                <SolutionBtn name={"Hi"} />
                <SolutionBtn name={"Hi"} />
            </ScrollView>
        } />
    )
}

const SolutionBtn = ({ name }) => {
    return (
        <InfoBox mainView={
            <View>
                <TouchableOpacity>
                    <Text>{name}</Text>
                </TouchableOpacity>
            </View>}
        />
    )
}

const styles = StyleSheet.create({


});




