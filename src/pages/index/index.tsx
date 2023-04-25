import React, { useState, useRef } from 'react';
import { View, Text } from '@tarojs/components'
import './index.scss'
import FormConfig, { FormConfigProps, FormConfigHandles } from "@/components/FormCom/index.tsx";


function sleep(time){
  return new Promise((resolve) => setTimeout(resolve, time))
}

const App1: React.FC = () => {
  const formRef = useRef<FormConfigHandles>(null);

  const formConfig: FormConfigProps = {
    items: [
      {
        fieldType: 'input',
        labelName: '姓名',
        fieldName: 'name',
        rules: [
          {
            regex: /^[\u4e00-\u9fa5]+$/,
            message: '请输入有效的姓名',
          },
        ],
      },
      {
        fieldType: 'select',
        labelName: '性别',
        fieldName: 'gender',
        options: [
          { text: '男', value: 'male' },
          { text: '女', value: 'female' },
        ],
        message: "请选择性别"
      },
      {
        fieldType: 'input',
        labelName: '女朋友的名字',
        fieldName: 'girln',
        rules: [
          {
            regex: /^[\u4e00-\u9fa5]+$/,
            message: '请输入有效的姓名',
          },
        ],
        showCodition: (values) => {
          return values.gender === 'female';
        },
      },
      {
        fieldType: 'select',
        labelName: '国家',
        fieldName: 'country',
        options: [
          { text: '中国', value: 'china' },
          { text: '美国', value: 'usa' },
        ],
        message: "请选择国家"
      },
      {
        fieldType: 'select',
        labelName: '城市',
        fieldName: 'city',
        message: "请选择城市",
        api: async () => {
          await sleep(3000)
          if (formRef.current) {
            const country = formRef.current.getValues().country;
            if (country) {
              return [
                { text: '北京', value: 'beijing' },
                { text: '上海', value: 'shanghai' },
              ];
            }
          }
          return []
        },
        showCodition: (values) => {
          return !!values.country;
        },
      }
    ],
  };

  const initialValues = {
    name: '张美丽',
    gender: 'female'
  };

  const handleSubmit = () => {
    const {current} = formRef ?? {};
    if (current) {
      const {getValues, validate } = current;
      console.log('提交的数据：', getValues(), validate());
    }
  };

  return (
    <div>
      <View>表单示例</View>
      <FormConfig ref={formRef} {...formConfig} initialValues={initialValues} />
      <button onClick={handleSubmit}>提交</button>
    </div>
  );
};


export default App1;
