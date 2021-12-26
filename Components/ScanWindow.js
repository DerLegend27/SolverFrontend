import { PureComponent, useEffect, useState } from "react";
import Svg, { Polyline, G, Rect, Defs, Use } from "react-native-svg";
import {
    widthPercentageToDP as wp2dp,
    heightPercentageToDP as hp2dp,
} from 'react-native-responsive-screen';
import {
    View,
    TouchableOpacity,
    Text,
    StyleSheet,
    PixelRatio,
    PanResponder,
} from 'react-native'
import React from "react";
import { hp, wp } from "../Helper/Converter";
import { colors } from "../Assets/colors";


export class ScanWindow extends PureComponent {
    constructor(props) {
        super(props)



        this.cornerWidth = 8
        this.cornerPadding = this.cornerWidth

        this.maxWidth = wp2dp(85)
        this.maxHeight = this.maxWidth
        this.minWidth = 220
        this.minHeight = hp2dp(14)


        

        this.startWidth = wp2dp(85)
        this.startHeight = this.minHeight

        this.startY = (this.maxHeight-this.startHeight)/2

        this.prevWidth = this.startWidth
        this.prevHeight = this.startHeight

        this.state = {
            actualWidth: this.prevWidth,
            actualHeight: this.prevHeight,

        }

        this.panResponder = PanResponder.create({
            onStartShouldSetPanResponder: this.alwaysTrue,
            onMoveShouldSetPanResponder: this.alwaysTrue,
            onPanResponderGrant: this.handlePanResponderGrant,
            onPanResponderMove: this.handlePanResponderMove,
        });
    }

    alwaysTrue = () => true

    handlePanResponderGrant = () => {
        this.prevWidth = this.state.actualWidth
        this.prevHeight = this.state.actualHeight
    }

    handlePanResponderMove = (e, gestureState) => {

        const newWidth = gestureState.dx + this.prevWidth
        const newHeight = gestureState.dy + this.prevHeight

        if (newWidth <= this.maxWidth && newWidth >= this.minWidth) {
            this.setState({
                actualWidth: gestureState.dx + this.prevWidth,
            })
        }
        if (newHeight <= (this.startHeight + this.startY) && newHeight >= this.minHeight) {
            this.setState({
                actualHeight: gestureState.dy + this.prevHeight,
            })
        }
    }

    render() {
        return (

            <Svg width={this.maxWidth} height={this.maxHeight} originY="100" style={styles.container}>

                {/* Left-Top Corner */}
                <Polyline
                    x={this.maxWidth - this.state.actualWidth + this.cornerPadding}
                    y={this.startY - (this.state.actualHeight - this.startHeight) + this.cornerPadding}
                    points="0,30 0,0 30,0"
                    fill="none"
                    stroke={colors.primaryColor}
                    strokeWidth={this.cornerWidth}
                    strokeLinejoin="round"
                    strokeLinecap="round"
                />

                {/* Right-Top Corner */}
                <Polyline
                    x={this.state.actualWidth - this.cornerPadding}
                    y={this.startY - (this.state.actualHeight - this.startHeight) + this.cornerPadding}
                    points="0,30 0,0 30,0"
                    fill="none"
                    stroke={colors.primaryColor}
                    strokeWidth={this.cornerWidth}
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    rotation="90"


                />

                {/* Bottom-Left Corner */}
                <Polyline
                    x={this.maxWidth - this.state.actualWidth + this.cornerPadding}
                    y={this.startY + this.state.actualHeight - this.cornerPadding}
                    points="0,30 0,0 30,0"
                    fill="none"
                    stroke={colors.primaryColor}
                    strokeWidth={this.cornerWidth}
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    rotation="270"


                />

                {/* Bottom-Right Corner */}
                <Polyline
                    x={this.state.actualWidth - this.cornerPadding}
                    y={this.startY + this.state.actualHeight - this.cornerPadding}
                    points="0,30 0,0 30,0"
                    fill="none"
                    stroke={colors.primaryColor}
                    strokeWidth={this.cornerWidth}
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    rotation="180"
                    {...this.panResponder.panHandlers}
                />

            </Svg>

        )
    }


}

const styles = StyleSheet.create({
    container: {
        height: "auto",
        flex: 0,
        position: "absolute",
        marginTop: hp(100)
    }
});