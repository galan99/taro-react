import React, { useState } from 'react';
import { View, Text } from '@tarojs/components'
import './index.scss'
import Form from "@/components/FormCom/index.tsx";


const App = () => {
  const [formValues, setFormValues] = useState({name: '111', sex: 'girl'});

  const handleSubmit = (values: { [key: string]: any }) => {
    console.log('Form values:', values);
  };

  const formData = [
    {
      label: '姓名',
      key: 'name',
      type: 'input',
      validation: /^[\u4e00-\u9fa5]+$/,
    },
    {
      label: '年龄',
      type: 'input',
      key: 'age',
      inputType: 'number',
      validation: (value: any) => value >= 18,
    },
    {
      label: '性别',
      type: 'select',
      key: 'sex',
      options: [
        {
          value: "boy",
          text: "男"
        },
        {
          value: "girl",
          text: "女"
        }
      ],
    },
    {
      label: '城市',
      type: 'select',
      key: 'city',
      options: [
        {
          value: 'beijing',
          text: '北京'
        },
        {
          value: 'shanghai',
          text: '上海'
        },
        {
          value: 'shenzhen',
          text: '深圳'
        },
      ],
      hidden: (values: { [key: string]: any }) => values.sex === 'boy',
    },
    {
      label: '联系方式',
      type: 'form',
      key: 'lianxi',
      children: [
        {
          label: '手机号',
          type: 'input',
          key: 'lianxi.phone',
          validation: /^1\d{10}$/,
        },
        {
          label: '邮箱',
          type: 'input',
          key: 'lianxi.email',
          validation: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
        },
      ],
      hidden: (values: { [key: string]: any }) => values.city !== 'shenzhen',
    },
    {
      label: '个人简介',
      type: 'input',
      key: 'more',
      inputType: 'textarea',
    },
  ];

  return (
    <>
      <Form formData={formData} initialValues={formValues} setValues={setFormValues}/>
      <button onClick={() => handleSubmit(formValues)}>提交</button>
    </>
  );
};

export default App;