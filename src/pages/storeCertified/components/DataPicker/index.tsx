import  React, { useState  } from "react";
import { DatePicker, Icon } from '@nutui/nutui-react-taro';
import { View, Text} from '@tarojs/components'
import './index.scss'

const Index = (props) => {
  const {title, defaultValue, placeholder = '请选择', minDate = null, onChange} = props

  const [show1, setShow1] = useState(false)
  const [desc1, setDesc1] = useState(defaultValue)
  const confirm1 = (values)=>{
    const desc = values.join('-');
    setDesc1(desc)
    onChange(desc)
  }

  const showTime = () => {
    setShow1(true)
  }

  return ( 
    <View className='dataPicker-component'>   
      <View className='dataPicker-component-show' onClick={showTime}>
        <Text className='dataPicker-component-show-text'>{desc1 || placeholder}</Text>
        <Icon className='dataPicker-component-show-icon' name='rect-right'></Icon>
    </View>
      <DatePicker
        minDate={minDate}
        title={title}
        visible={show1}
        defaultValue={defaultValue}
        isShowChinese
        onCloseDatePicker={() => setShow1(false)}
        onConfirmDatePicker={(values) => confirm1(values)}
      />
    </View>
  );
};

export default Index;