import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { View, Text } from '@tarojs/components'
import { Popup, Icon } from '@nutui/nutui-react-taro'
import Taro from '@tarojs/taro'
import classNames from 'classnames'
import './index.scss'

interface SelectProps {
    defaultValue: any
    title?: string
    onChange: (value: any) => void
    options: Array<{ value: string | number; label: string }>
    placeholder?: string
}

const isEmpty = (obj: any): boolean => ['', undefined, null].includes(obj)

const SelectCom: React.FC<SelectProps> = props => {
    const { defaultValue, title = '请选择', placeholder = '请选择', onChange, options = [] } = props
    const [isVisible, setIsVisible] = useState(false)
    const [currentVal, setCurrentVal] = useState<any>()

    const handleSave = () => {
        if (!isEmpty(currentVal)) {
            setIsVisible(false)
            onChange && onChange(currentVal)
        } else {
            Taro.showToast({
                title: '请选择',
                icon: 'none',
                duration: 2500,
            })
        }
    }

    const handelCancel = () => {
        setIsVisible(false)
    }

    const chooseItem = item => {
        if (!item.disable) {
            setCurrentVal(item.value)
        }
    }

    const initCurrent = useCallback(() => {
        setCurrentVal(!isEmpty(defaultValue) ? defaultValue : '')
    }, [defaultValue])

    const showSelect = () => {
        setIsVisible(true)
        initCurrent()
    }

    const currentLabel = useMemo(() => {
        const labelItem = options.find(item => item.value === defaultValue)
        return labelItem?.label ?? ''
    }, [defaultValue])

    return (
        <View className='select-component'>
            <View className='select-component-show' onClick={showSelect}>
                <Text className='select-component-show-text'>{currentLabel || placeholder}</Text>
                <Icon className='select-component-show-icon' name='rect-right'></Icon>
            </View>
            <Popup
                closeOnClickOverlay={false}
                visible={isVisible}
                style={{ height: options.length > 3 ? '60%' : '40%' }}
                position='bottom'
                round
                className='select-component-wapper'
            >
                <View className='select-component-title'>{title}</View>
                <View className='select-component-children'>
                    {options.map(item => {
                        return (
                            <View
                                onClick={() => chooseItem(item)}
                                className={classNames('select-component-children-item', { active: item.value == currentVal })}
                                key={item.value}
                            >
                                {item.label}
                                {item.value == currentVal && <Icon className='select-children-icon' name='checklist'></Icon>}
                            </View>
                        )
                    })}
                </View>
                <View className='select-component-btns'>
                    <View onClick={handelCancel} className='select-component-btn'>
                        取消
                    </View>
                    <View onClick={handleSave} className='select-component-btn select-component-btn-save'>
                        确定
                    </View>
                </View>
            </Popup>
        </View>
    )
}

export default SelectCom
