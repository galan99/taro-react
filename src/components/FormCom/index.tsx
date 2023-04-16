import { Input, Picker, Cell } from '@nutui/nutui-react-taro';
import '@nutui/nutui-react-taro/dist/style.css'
import {View} from "@tarojs/components"
import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';

interface ValidationRule {
  regex?: RegExp;
  validator?: (value: any) => boolean;
  message?: string;
}

interface FormItemConfig {
  type: 'input' | 'select';
  label: string;
  name: string;
  rules?: ValidationRule[];
  hidden?: boolean;
  options?: { text: string; value: any }[];
  api?: () => Promise<{ label: string; value: any }[]>;
  children?: FormConfigProps[];
  dependencies?: string[];
  shouldHide?: (values: Record<string, any>) => boolean;
}

interface FormConfigProps {
  items: FormItemConfig[];
  initialValues?: Record<string, any>;
  onSubmit?: (values: Record<string, any>) => void;
}

interface FormConfigHandles {
  getValues: () => Record<string, any>;
  validate: () => boolean;
}

const FInput = (props) => {
  const {value = '', onChange, placeholder} = props;
  const [val, UpdateValue] = useState(value)

  const ChangeEvent = (v) => {
    onChange(v)
    UpdateValue(v)
  }

  return (
    <Input 
      name='text' 
      defaultValue={val}  
      placeholder={placeholder} 
      onChange={ChangeEvent}
    />
  )
}

const FSelect = (props) => {
  const { options = [], onChange, value, placeholder = "请选择" } = props;

  const checkText = options.find(item => item.value == value)?.text || '';
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

const FormConfig = forwardRef<FormConfigHandles, FormConfigProps>((props, ref) => {
  const { items, initialValues } = props;
  const [values, setValues] = useState<Record<string, any>>(initialValues || {});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hiddenStatus, setHiddenStatus] = useState<Record<string, boolean>>(
    items.reduce((acc, item) => {
      acc[item.name] = item.hidden || false;
      return acc;
    }, {} as Record<string, boolean>)
  );

  useEffect(() => {
    items.forEach((item) => {
      if (item.type === 'select' && item.api) {
        item.api().then((options) => {
          item.options = options;
        });
      }
    });
  }, [items]);

  

  const updateHiddenStatus = (name: string, value: any) => {
    items.forEach((item) => {
      if (item.dependencies && item.dependencies.includes(name) && item.shouldHide) {
        setHiddenStatus((prevHiddenStatus) => ({
          ...prevHiddenStatus,
          [item.name]: item.shouldHide({ ...values, [name]: value }),
        }));
      }
    });
  };

  const handleValueChange = (name: string, value: any) => {
    setValues((prevValues) => ({ ...prevValues, [name]: value }));
    updateHiddenStatus(name, value);
  };


  const validateField = (item: FormItemConfig, value: any) => {
    if (!item.rules) return true;

    let error = '';
    for (const rule of item.rules) {
      if (rule.regex && !rule.regex.test(value)) {
        error = rule.message || '';
        break;
      } else if (rule.validator && !rule.validator(value)) {
        error = rule.message || '';
       
        break;
      }
    }

    setErrors((prevErrors) => ({ ...prevErrors, [item.name]: error }));

    return !error;
  };

  const validate = (): boolean => {
    return items.every((item) => {
      if (hiddenStatus[item.name]) return true;
      return validateField(item, values[item.name]);
    });
  };

  const getValues = (): Record<string, any> => {
    const filteredValues = items.reduce((acc, item) => {
      if (!hiddenStatus[item.name]) {
        acc[item.name] = values[item.name];
      }
      return acc;
    }, {} as Record<string, any>);
    return filteredValues;
  };

  const renderFormItem = (item: FormItemConfig) => {
    const { type, label, name } = item;

    if (hiddenStatus[item.name]) {
      return null;
    }

    if (type === 'input') {
      return (
        <div key={name}>
          <label>{label}</label>
          <FInput
            value={values[name] || ''}
            onChange={(value) => handleValueChange(name, value)}
          />
          {errors[name] && <p>{errors[name]}</p>}
        </div>
      );
    } else if (type === 'select') {
      return (
        <div key={name}>
          <label>{label}</label>
          <FSelect
            options={item.options || []}
            value={values[name]}
            onChange={(value) => handleValueChange(name, value)}
          />
          {errors[name] && <p>{errors[name]}</p>}
        </div>
      );
    }
  };

  
  useImperativeHandle(ref, () => ({
    getValues,
    validate,
  }));


  return (
    <div>
      {items.map((item) => (
        <React.Fragment key={item.name}>{renderFormItem(item)}</React.Fragment>
      ))}
    </div>
  );

});

export default FormConfig;

