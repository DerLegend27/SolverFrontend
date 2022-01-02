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
    UIManager,
    findNodeHandle
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

        this.actualWidth = this.startWidth
        this.actualHeight = this.startHeight

        this.prevWidth = this.actualWidth
        this.prevHeight = this.actualHeight

        this.state = {
            leftX: this.calcLeftX(),
            rightX: this.calcRightX(),
            topY: this.calcTopY(),
            bottomY: this.calcBottomY(),
        }

        this.svgCords = {}
        
        

        


        this.panResponder = PanResponder.create({
            onStartShouldSetPanResponder: this.alwaysTrue,
            onMoveShouldSetPanResponder: this.alwaysTrue,
            onPanResponderGrant: this.handlePanResponderGrant,
            onPanResponderMove: this.handlePanResponderMove,
        });
    }


    alwaysTrue = () => true

    
    handlePanResponderGrant = () => {
        this.prevWidth = this.actualWidth
        this.prevHeight = this.actualHeight
    } 

    handlePanResponderMove = (e, gestureState) => {

        const newWidth = gestureState.dx + this.prevWidth
        const newHeight = gestureState.dy + this.prevHeight

        if (newWidth <= this.maxWidth && newWidth >= this.minWidth) {
            this.actualWidth = newWidth
            this.setState({
                leftX: this.calcLeftX(),
                rightX: this.calcRightX()
    
            }) 
        }
        if (newHeight <= (this.startHeight + this.startY) && newHeight >= this.minHeight) {
            this.actualHeight = newHeight
            this.setState({
                topY: this.calcTopY(),
                bottomY: this.calcBottomY()
            }) 
        }
    }

    render() {
        return (

            <Svg width={this.maxWidth} height={this.maxHeight} originY="100" style={styles.container}
            onLayout={
                ({nativeEvent}) => {
                    this.svgCords = nativeEvent.layout
                }
            }
            >

                {/* Left-Top Corner */}
                <Polyline
                    x={this.state.leftX}
                    y={this.state.topY}
                    points="0,30 0,0 30,0"
                    fill="none"
                    stroke={colors.primaryColor}
                    strokeWidth={this.cornerWidth}
                    strokeLinejoin="round"
                    strokeLinecap="round"
                />

                {/* Right-Top Corner */}
                <Polyline
                    x={this.state.rightX}
                    y={this.state.topY}
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
                    x={this.state.leftX}
                    y={this.state.bottomY}
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
                    x={this.state.rightX}
                    y={this.state.bottomY}
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

    calcLeftX = () =>{
        return this.maxWidth - this.actualWidth + this.cornerPadding
    }
    calcRightX = () =>{
        return this.actualWidth - this.cornerPadding
    }
    calcTopY = () => {
        return this.startY - (this.actualHeight - this.startHeight) + this.cornerPadding
    }
    calcBottomY = () => {
        return this.startY + this.actualHeight - this.cornerPadding
    }


}

const styles = StyleSheet.create({
    container: {
        height: "auto",
        flex: 0,
        position: "absolute",
        marginTop: hp(100),
        
        
    }
});