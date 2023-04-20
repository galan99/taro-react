import React, { useState, useEffect } from 'react'
import { View, Text } from '@tarojs/components'
import { Popup, Icon } from '@nutui/nutui-react-taro'
import './index.scss'


interface SelectProps {
  defaultValue: any;
  title?: string;
  onChange: (value: any) => void;
  options: Array<{value: string | number, label: string}>;
  placeholder?: string;
}

const Index: React.FC<SelectProps> = (props) => {
    const {defaultValue, title = '请选择', placeholder = '请选择', onChange, options = []} = props;
    const [isVisible, setIsVisible] = useState(false)
    const [currentVal, setCurrentVal] = useState<any>()
    const [currentLabel, setCurrentLabel] = useState<string>()
    useEffect(() => {
      if (!['', undefined, null].includes(defaultValue)) {
        setCurrentVal(defaultValue)
        const labelItem = options.find(item => item.value === defaultValue);
        if (labelItem?.label) {
          setCurrentLabel(labelItem.label)
        }
      }
    }, [defaultValue])

    const handleSave = () => {
      if (!['', undefined, null].includes(currentVal)) {
        setIsVisible(false)
        const labelItem = options.find(item => item.value === currentVal);
        if (labelItem?.label) {
          setCurrentLabel(labelItem.label)
        }
        onChange && onChange(currentVal)
      }
    }

    const chooseItem = (item) => {
        if (!item.disable) {
          setCurrentVal(item.value)
        }
    }

    const showSelect = () => {
      setIsVisible(true)
    }

    return (
        <View className='select-component'>
            <View
                className='select-component-show'
                onClick={showSelect}
            >
                <Text className='select-component-show-text'>{currentLabel || placeholder}</Text>
                <Icon className='select-component-show-icon' name='rect-right'></Icon>
            </View>
            <Popup closeOnClickOverlay={false} visible={isVisible} style={{ height: options.length > 3 ? '60%' : '40%' }} position='bottom' round className='select-component-wapper'>
                <View className='select-component-title'>{title}</View>
                <View className='select-component-children'>
                    {options.map((item) => {
                        return (
                            <View
                                onClick={() => chooseItem(item)}
                                className={['select-component-children-item ', item.value == currentVal ? 'active' : ''].join('')}
                                key={item.value}
                            >
                                {item.label}
                                {item.value == currentVal && <Icon className='select-children-icon' name='checklist'></Icon>}
                            </View>
                        )
                    })}
                </View>
                <View className='select-component-btns'>
                    <View onClick={() => setIsVisible(false)} className='select-component-btn'>
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


export default Index;