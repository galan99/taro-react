import React, { FC, useState, useEffect } from 'react'
import Taro, {useRouter} from '@tarojs/taro';
import { View } from '@tarojs/components'
import { Icon } from '@nutui/nutui-react-taro'
import dayjs from "dayjs"
import { cloneDeep } from 'lodash';
import Steps from '@/public_components/steps/steps'
import {InputComponent, SelectComponent, TimeComponent, UploaderComponent} from './components/FormCom'
import {FACTORY_CONFIG, MASTER_CONFIG, DESIGNER_CONFIG} from './config'
import './index.scss'

function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

interface itemConfig {
  fieldType: 'input' | 'select' | 'upload' | 'time';
  fieldName: string;
  labelName: string;
  showCodition?: (values: Record<string, any>) => boolean;
  props: any;
}
interface pageConfigInt {
  FILED_NAMES?: Record<string, string>,
  ITEMS?: itemConfig[],
  INT_STATE?: Record<string, any>
  MESSAGES?: Record<string, string>
}


const StoreComponent: FC = () => {
    console.log("进入页面")
    const [canClick, setCanClick] = useState<boolean>(true)
    const router = useRouter();

    const [pageConfig, setPageConfig] = useState<pageConfigInt>({});
    const [state, setState] = useState<Record<string, any>>({})
    const minDate = dayjs().add(3, 'month') // 大于当前三个月
    const [errorData, setErrorData] = useState<Record<string, any>>({})

    // 初始化
    useEffect(() => {
      getData()
    }, [])

    const getData = async () => {
      const {type = '1', id} = router.params;
        const PAGE_TEMPLATE = {
          1: FACTORY_CONFIG, // 工厂认证
          2: MASTER_CONFIG, // 达人认证
          3: DESIGNER_CONFIG, // 设计师认证
        }

        const config = cloneDeep(PAGE_TEMPLATE[type])
        setPageConfig(config)
        const initState = config.ITEMS.reduce((result, cur) => {
          result[cur.fieldName] = cur.fieldValue;
          return result;
        }, {})
        
        if (id) {
          Taro.showLoading({
            title: '正在加载中'
          })
          await sleep(2000)
        
          console.log('获取到了数据', type)
          setErrorData({name: '姓名错误'})
          setState(initState)
          Taro.hideLoading()
        } else {
          setState(initState)
        }
    }

    // 提示校验文案
    const [tiptext, setTiptext] = useState<string>('')
    useEffect(() => {
      if (tiptext) {
        const timer = setTimeout(() => {
          setTiptext('')
        }, 2000)
        return () => clearTimeout(timer)
      }
    }, [tiptext])

    // 校验所有认证表单
    const verificationData = () => {
      let message = '';
      const errorMessages = pageConfig.MESSAGES ?? {};

      for (let key in state) {
        const item = pageConfig.ITEMS?.find(child => child.fieldName === key);
        const {props = {}, showCodition = () => true} = item ?? {};
        const {required = true} = props;
        const leng = Array.isArray(state[key]) ? state[key].length : state[key];

        if (!showCodition(state)) {
          continue;
        }
      
        if (!required) {
          continue;
        }

        if (!leng) {
          message = errorMessages[key]
          break;
        }
      }

      setTiptext(message)
      return !!message;
    }

    // 提交认证
    const handleSubmit = () => {
      const checkverification = verificationData()
      if (!checkverification) {
        handleSaveBack('submit')
        console.log('提交')
      }
    }

    // 保存认证
    const handleSaveBack = async (type) => {
      console.log("提交按钮状态", canClick)
      if (!canClick) return;
      setCanClick(false)
      Taro.showLoading({
        title: '正在提交'
      })
      await sleep(3000)
      
      setCanClick(true)
      Taro.hideLoading()
      Taro.showToast({
        title: type === 'submit' ? '提交成功' : '保存成功',
        icon: 'success',
      })
      setTimeout(() => {
        // Taro.navigateBack()
      }, 1500)
    }


    const handleValueChange = (fieldName: string, value: any) => {
      setState((prevValues) => {
        return { ...prevValues, [fieldName]: value }
      });
    };

    const renderFormItem = (item: itemConfig, values) => {
      const { showCodition, fieldType, fieldName, labelName } = item;
      const {options,placeholder,title, maxNum, tipHtml, titleHtml} = item.props;

      if (showCodition && !showCodition(values)) {
        return null;
      }

      if (fieldType === 'select') {
        return (
          <SelectComponent
            label={labelName}
            placeholder={placeholder}
            title={title}
            errorText={errorData[fieldName]}
            options={options}
            defaultValue={state[fieldName]}
            onChange={val => {handleValueChange(fieldName, val)}}
          />
        );
      } else if (fieldType === 'input') {
        return (
          <InputComponent
            label={labelName}
            placeholder={placeholder}
            defaultValue={state[fieldName]}
            errorText={errorData[fieldName]}
            onChange={val => {handleValueChange(fieldName, val)}}
          />
        );
      } else if (fieldType === 'upload') {
        return (
          <UploaderComponent
            label={labelName}
            isUpload
            maxNum={maxNum}
            tipHtml={tipHtml && <View className='fitem-header-tip'>{tipHtml}</View>}
            defaultValue={state[fieldName]}
            onChange={val => {handleValueChange(fieldName, val)}}
          />
        );
      } else if (fieldType === 'time') {
        return (
          <TimeComponent
            label={labelName}
            minDate={minDate.toDate()}
            titleHtml={titleHtml && <View className='fitem-header-title-other'>{titleHtml}</View>}
            defaultValue={state[fieldName]}
            onChange={val => {handleValueChange(fieldName, val)}}
          />
        );
      }
    };

    return (
        <View className='storep'>
            <View className='storep-wapper'>
                {
                  tiptext && <View className='storep_error'>
                    <Icon name='issue' size='14'></Icon>
                    <View className='storep_error_text'>{tiptext}</View>
                  </View>
                }
                <Steps currentStep={0} />
                <View className='storep-content'>
                    {pageConfig.ITEMS && pageConfig.ITEMS.map((item) => (
                      <React.Fragment key={item.fieldName}>{renderFormItem(item, state)}</React.Fragment>
                    ))}
                </View>
            </View>
            <View className='storep-footer'>
                <View className='storep-footer-saveback storep-footer-btn' onClick={handleSaveBack}>返回并保存</View>
                <View className='storep-footer-submit storep-footer-btn' onClick={handleSubmit}>确认提交</View>
            </View>
        </View>
    )
}

export default StoreComponent
