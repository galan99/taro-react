import React, { useState, useRef } from 'react';
import { View, Text } from '@tarojs/components'
import './index.scss'
//import FormConfig, { FormConfigProps, FormConfigHandles } from "@/components/FormCom/index.tsx";
import FormConfig, { FormConfigProps, FormConfigHandles } from '@/components/FormCom/index1.tsx';


function sleep(time){
  return new Promise((resolve) => setTimeout(resolve, time))
}

const App1: React.FC = () => {
  const formRef = useRef<FormConfigHandles>(null);

  const formConfig: FormConfigProps = {
    items: [
      {
        type: 'input',
        label: '姓名',
        name: 'name',
        rules: [
          {
            regex: /^[\u4e00-\u9fa5]+$/,
            message: '请输入有效的姓名',
          },
        ],
      },
      {
        type: 'select',
        label: '性别',
        name: 'gender',
        options: [
          { text: '男', value: 'male' },
          { text: '女', value: 'female' },
        ],
      },
      {
        type: 'input',
        label: '女朋友的名字',
        name: 'girln',
        rules: [
          {
            regex: /^[\u4e00-\u9fa5]+$/,
            message: '请输入有效的姓名',
          },
        ],
        dependencies: ['gender'],
        shouldHide: (values) => {
          return values.gender !== 'female';
        },
      },
      {
        type: 'select',
        label: '国家',
        name: 'country',
        options: [
          { text: '中国', value: 'china' },
          { text: '美国', value: 'usa' },
        ],
        dependencies: ['city'],
      },
      {
        type: 'select',
        label: '城市',
        name: 'city',
        hidden: true,
        api: async () => {
          await sleep(3000)
          if (formRef.current) {
            const country = formRef.current.getValues().country;
            if (country === 'china') {
              return [
                { text: '北京', value: 'beijing' },
                { text: '上海', value: 'shanghai' },
              ];
            } else if (country === 'usa') {
              return [
                { text: '纽约', value: 'new_york' },
                { text: '旧金山', value: 'san_francisco' },
              ];
            }
          }
          return []
        },
      }
    ],
  };

  const initialValues = {
    name: '张美丽',
    gender: 'male',
  };

  const handleSubmit = () => {
    console.log(formRef.current.getValues())
    if (formRef.current && formRef.current.validate()) {
      console.log('提交的数据：', formRef.current.getValues());
    }
  };

  return (
    <div>
      <h1>表单示例</h1>
      <FormConfig ref={formRef} {...formConfig} initialValues={initialValues} />
      <button onClick={handleSubmit}>提交</button>
    </div>
  );
};

const App: React.FC = () => {
  const formConfigRef = useRef<FormConfigHandles>(null);

  const formItems: FormConfigProps['items'] = [
    {
      type: 'select',
      label: 'User Type',
      name: 'userType',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Member', value: 'member' },
      ],
    },
    {
      type: 'input',
      label: 'Username',
      name: 'username',
      validation: {
        required: true,
      },
    },
    {
      type: 'input',
      label: 'Password',
      name: 'password',
      validation: {
        required: true,
        pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
      },
    },
    {
      type: 'nested',
      label: 'Admin Information',
      name: 'admin',
      shouldHide: (values) => values.userType !== 'admin',
      children: [
        {
          type: 'input',
          label: 'Admin ID',
          name: 'id',
          validation: {
            required: true,
          },
        },
        {
          type: 'input',
          label: 'Admin Email',
          name: 'email',
          validation: {
            required: true,
            pattern: /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
          },
        },
      ],
    },
    {
      type: 'nested',
      label: 'Member Information',
      name: 'member',
      shouldHide: (values) => values.userType !== 'member',
      children: [
        {
          type: 'input',
          label: 'Member ID',
          name: 'id',
          validation: {
            required: true,
          },
        },
        {
          type: 'input',
          label: 'Member Email',
          name: 'email',
          validation: {
            required: true,
            pattern: /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
          },
        },
      ],
    },
  ];

  const handleSubmit = () => {
    if (formConfigRef.current) {
      const values = formConfigRef.current.getValues();
      console.log('Form values:', values);
      if (formConfigRef.current.validate()) {
        console.log('Form values:', values);
      } else {
        console.log('Validation failed');
      }
    }
  };

  return (
    <div>
      <FormConfig items={formItems} ref={formConfigRef} />
      <button onClick={handleSubmit}>提交</button>
    </div>
  );
};


export default App;
