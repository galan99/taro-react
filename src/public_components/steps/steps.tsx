import React from 'react'
import { View, ScrollView, Image } from '@tarojs/components'
import './steps.scss'

 /**
 * 
 * currentStep 0:填写材料 1:审核中 2:审核成功 3:审核失败
 */
type State = {
    currentStep: number
}
export default class StepComponent extends React.Component<State> {
    state = {
        // eslint-disable-next-line react/no-unused-state
        currentStep: this.props.currentStep,
    }
    renderOpt() {
        const { currentStep } = this.state
        const options = {
            0: {
                line: {
                    firstClass: 'line grey',
                    secondClass: 'line grey',
                },
                ball: {
                    first: {
                        imgStatus: 2, // 0错误图 1正确图 2不显示图
                        ballClass: 'ball blue white-text',
                        textClass: 'text blue-text',
                    },
                    second: {
                        imgStatus: 2,
                        ballClass: 'ball grey grey-text',
                        textClass: 'text grey-text',
                    },
                    third: {
                        imgStatus: 2,
                        ballClass: 'ball grey grey-text',
                        textClass: 'text grey-text',
                    },
                },
            },
            1: {
                line: {
                    firstClass: 'line blue',
                    secondClass: 'line grey',
                },
                ball: {
                    first: {
                        imgStatus: 1,
                        textClass: 'text',
                    },
                    second: {
                        imgStatus: 2,
                        ballClass: 'ball blue white-text',
                        textClass: 'text blue-text',
                    },
                    third: {
                        imgStatus: 2,
                        ballClass: 'ball grey grey-text',
                        textClass: 'text grey-text',
                    },
                },
            },
            2: {
                line: {
                    firstClass: 'line blue',
                    secondClass: 'line blue',
                },
                ball: {
                    first: {
                        imgStatus: 1,
                        textClass: 'text',
                    },
                    second: {
                        imgStatus: 1,
                        textClass: 'text',
                    },
                    third: {
                        imgStatus: 2,
                        ballClass: 'ball blue white-text',
                        textClass: 'text blue-text',
                    },
                },
            },
            3: {
                line: {
                    firstClass: 'line blue',
                    secondClass: 'line blue',
                },
                ball: {
                    first: {
                        imgStatus: 1,
                        textClass: 'text',
                    },
                    second: {
                        imgStatus: 1,
                        textClass: 'text',
                    },
                    third: {
                        imgStatus: 0,
                        ballClass: 'ball blue white-text',
                        textClass: 'text blue-text',
                    },
                },
            },
        }
        return options[currentStep] ?? {};
    }
    render() {
        const { line = {}, ball = {} } = this.renderOpt();
        const { first = {}, second = {}, third = {} } = ball
        return (
            <View className='steps'>
                <ScrollView scrollX enableFlex className='step-view'>
                    <View className='line-view'>
                        <View className={line.firstClass}></View>
                        <View className={line.secondClass}></View>
                    </View>
                    <View>
                        <View className='ball-view'>
                            {[0, 1].includes(first.imgStatus) && (
                                <Image
                                    className='ball pale-blue'
                                    src='https://img10.360buyimg.com/imagetools/jfs/t1/145236/2/32754/1301/63687d1cEeb3f5aa5/cc1a0ef655e99db7.png'
                                />
                            )}
                            {first.imgStatus == 2 && <View className={first.ballClass}>1</View>}
                            <View className={first.textClass}>提交材料</View>
                        </View>
                        <View className='ball-view'>
                            {[0, 1].includes(second.imgStatus) && (
                                <Image
                                    className='ball pale-blue'
                                    src='https://img10.360buyimg.com/imagetools/jfs/t1/145236/2/32754/1301/63687d1cEeb3f5aa5/cc1a0ef655e99db7.png'
                                />
                            )}
                            {second.imgStatus == 2 && <View className={second.ballClass}>2</View>}
                            <View className={second.textClass}>材料审核</View>
                        </View>
                        <View className='ball-view'>
                            {third.imgStatus == 0 && (
                                <Image
                                    className='ball pale-blue'
                                    src='https://img10.360buyimg.com/imagetools/jfs/t1/193685/3/30124/1349/63687d24E7029e2e2/ae758deba48b8804.png'
                                />
                            )}
                            {third.imgStatus == 1 && (
                                <Image
                                    className='ball pale-blue'
                                    src='https://img10.360buyimg.com/imagetools/jfs/t1/145236/2/32754/1301/63687d1cEeb3f5aa5/cc1a0ef655e99db7.png'
                                />
                            )}
                            {third.imgStatus == 2 && <View className={third.ballClass}>3</View>}
                            <View className={third.textClass}>审核结果</View>
                        </View>
                    </View>
                </ScrollView>
            </View>
        )
    }
}
