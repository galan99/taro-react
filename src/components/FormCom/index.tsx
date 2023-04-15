import { Input, Picker, Cell } from '@nutui/nutui-react-taro';
import '@nutui/nutui-react-taro/dist/style.css'
import React, { useState, useEffect } from 'react';
import {View, Text } from "@tarojs/components"


interface FormItem {
  label: string;
  key: string,
  type: 'input' | 'select';
  inputType?: string;
  options?: Array<{ text: string; value: string | number }>;
  hidden?: boolean;
  children?: FormItem[];
  validation?: RegExp | ((value: any) => boolean);
}

interface FormProps {
  formData: FormItem[];
  onSubmit: (values: { [key: string]: any }) => void;
  setValues?: any,
  initialValues?: { [key: string]: any };
  loadSelectOptions?: (selectName: string) => Promise<Array<{ text: string; value: string | number }>>;
}

const FInput = (props) => {
  const {defaultValue, onChange, placeholder} = props;
  console.log(defaultValue)
  const [value, UpdateValue] = useState('')

  const ChangeEvent = (val) => {
    console.log(defaultValue, val)
    onChange(val)
    UpdateValue(val)
  }

  return (
    <Input 
      name='text' 
      defaultValue={defaultValue}  
      placeholder={placeholder} 
      onChange={ChangeEvent}
    />
  )
}

const Select = (props) => {
  const { options = [], onChange, defaultValue, placeholder = "请选择" } = props;

  const checkText = options.find(item => item.value == defaultValue)?.text || '';
  const [selectedValue, setSelectedValue] = useState(checkText);
  const [isVisible, setIsVisible] = useState(false)



  const confirmPicker = (val = [], data = []) => {
    setSelectedValue(data[0].text);
    onChange(val[0], data[0]);
  };

  return (
    <View>
      <Cell title={placeholder} desc={selectedValue} onClick={() => setIsVisible(!isVisible)}/>
      <Picker
        isVisible={isVisible}
        listData={options}
        defaultValueData={selectedValue}
        onClose={() => setIsVisible(false)}
        onConfirm={confirmPicker}
      />
    </View>
  );
};


const Form: React.FC<FormProps> = ({ formData, onSubmit, initialValues, loadSelectOptions }) => {
  const [formValues, setFormValues] = useState<{ [key: string]: any }>({});
  console.log(initialValues, formValues, formData)
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [selectValues, setSelectValues] = useState<{ [key: string]: Array<{ text: string; value: string | number }> }>({});

  useEffect(() => {
    formData.forEach((item) => {
      if (item.type === 'select' && item.options) {
        setSelectValues((prevSelectValues: any) => ({
          ...prevSelectValues,
          [item.key]: item.options,
        }));
      }
    });
  }, [formData]);

  useEffect(() => {
    if (loadSelectOptions) {
      formData.forEach((item) => {
        if (item.type === 'select' && !item.options) {
          loadSelectOptions(item.key).then((options) => {
            setSelectValues((prevSelectValues) => ({
              ...prevSelectValues,
              [item.key]: options,
            }));
          });
        }
      });
    }
  }, [formData, loadSelectOptions]);

  const handleInputChange = (value: string, name: string) => {
    setFormValues({
      ...formValues,
      [name]: value,
    });
    console.log(formValues)
  };

  const handleSelectChange = (value: string | number, name: string) => {
    setFormValues({
      ...formValues,
      [name]: value,
    });
    console.log(formValues)
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>, name: string, item: FormItem) => {
    if (item.validation) {
      if (item.validation instanceof RegExp) {
        if (!item.validation.test(event.target.value)) {
          setErrors({
            ...errors,

            [name]: '格式不正确',
          });
        } else {
          setErrors((prevErrors) => {
            const newErrors = { ...prevErrors };
            delete newErrors[name];
            return newErrors;
          });
        }
      } else if (!item.validation(event.target.value)) {
        setErrors({
          ...errors,
          [name]: '格式不正确',
        });
      } else {
        setErrors((prevErrors) => {
          const newErrors = { ...prevErrors };
          delete newErrors[name];
          return newErrors;
        });
      }
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const newErrors: { [key: string]: string } = {};
    formData.forEach((item) => {
      if (item.type === 'input' && item.validation) {
        if (item.validation instanceof RegExp) {
          if (!item.validation.test(formValues[item.key])) {
            newErrors[item.key] = '格式不正确';
          }
        } else if (!item.validation(formValues[item.key])) {
          newErrors[item.key] = '格式不正确';
        }
      }
    });
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      onSubmit(formValues);
    }
  };

  return (
    <form>
      {formData.map((item, index) => (
        <React.Fragment key={index}>
          {item.hidden ? null : (
            <div>
              <label htmlFor={item.label}>{item.label}</label>
              {item.type === 'input' ? (
                <FInput
                  defaultValue={formValues[item.key] || ''}
                  onChange={(event) => handleInputChange(event, item.key)}
                />
              ) : (
                <Select
                  options={item.options}
                  defaultValue={formValues[item.key] || ''}
                  onChange={(value) => handleSelectChange(value, item.key)}
                />
              )}
              {errors[item.key] && <div style={{ color: 'red' }}>{errors[item.key]}</div>}
            </div>
          )}
          {item.children ? (
            <Form formData={item.children} />
          ) : null}
        </React.Fragment>
      ))}
    </form>
  );
};

export default Form;


