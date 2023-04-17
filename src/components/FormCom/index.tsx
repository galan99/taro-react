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
  fieldType: 'input' | 'select';
  labelName: string;
  fieldName: string;
  required?: boolean;
  rules?: ValidationRule[];
  disable?: boolean;
  options?: any[];
  message?: string;
  api?: () => Promise<{ label: string; value: any }[]>;
  children?: FormConfigProps[];
  showCodition?: (values: Record<string, any>) => boolean;
  error?: string;
}

interface FormConfigProps {
  items: FormItemConfig[];
  initialValues?: Record<string, any>;
  onSubmit?: (values: Record<string, any>) => void;
}

interface FormConfigHandles {
  getValues: () => Record<string, any>;
  validate: () => Record<string, any>;
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
    const {text} = data[0] ?? {}
    setSelectedValue(text);
    onChange(val[0], data[0]);
  };

  return (
    <View>
      <Cell title={placeholder} desc={selectedValue} onClick={() => setIsVisible(!isVisible)} />
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
  const { items, initialValues = {} } = props;
  const [values, setValues] = useState<Record<string, any>>(initialValues || {});
  const [hiddenStatus, setHiddenStatus] = useState<Record<string, boolean>>(
    items.reduce((acc, item) => {
      acc[item.fieldName] = item.showCodition ? true : false;
      return acc;
    }, {} as Record<string, boolean>)
  );

  useEffect(() => {
    items.forEach((item) => {
      if (item.fieldType === 'select' && item.api) {
        item.api().then((options) => {
          item.options = options;
        });
      }
    });
  }, [items]);

  useEffect(() => {
    items.forEach((item) => {
      if (item.fieldType === 'select') {
        const {fieldName} = item;
        updateHiddenStatus(fieldName, initialValues[fieldName]);
      }
    });
  }, [])

  

  const updateHiddenStatus = (fieldName: string, value: any) => {
    items.forEach((item) => {
      if (item.showCodition) {
        const {showCodition} = item;
        setHiddenStatus((prevHiddenStatus) => ({
          ...prevHiddenStatus,
          [item.fieldName]: !showCodition({ ...values, [fieldName]: value }),
        }));
      }
    });
  };

  const handleValueChange = (fieldName: string, value: any) => {
    setValues((prevValues) => ({ ...prevValues, [fieldName]: value }));
    updateHiddenStatus(fieldName, value);
  };

  const validateField = (item: FormItemConfig, value: any) => {
    let error = '';
    const {required = true, message} = item;
    if (!required) {
      return error;
    } else if (!item.rules) {
      return !value ? message : '';
    };

    for (const rule of item.rules) {
      if (!value) {
        error = rule.message || `请选择${item.labelName}`;
        break;
      } else if (rule.regex && !rule.regex.test(value)) {
        error = rule.message || '';
        break;
      } else if (rule.validator && !rule.validator(value)) {
        error = rule.message || '';
        break;
      } 
    }

    return error;
  };


  const validate = () => {
    let errors = {};
    items.forEach((item) => {
      if (!hiddenStatus[item.fieldName]) {
        const error = validateField(item, values[item.fieldName]);
        if (error) {
          errors[item.fieldName] = error;
        }
      }
    });
    return errors
  };

  const getValues = (): Record<string, any> => {
    const filteredValues = items.reduce((acc, item) => {
      if (!hiddenStatus[item.fieldName]) {
        acc[item.fieldName] = values[item.fieldName];
      }
      return acc;
    }, {} as Record<string, any>);
    return filteredValues;
  };

  const renderFormItem = (item: FormItemConfig) => {
    const { fieldType, labelName, fieldName, error } = item;

    if (hiddenStatus[fieldName]) {
      return null;
    }

    if (fieldType === 'input') {
      return (
        <div key={fieldName}>
          <label>{labelName}</label>
          <FInput
            value={values[fieldName] || ''}
            onChange={(value) => handleValueChange(fieldName, value)}
          />
          {error && <p>{error}</p>}
        </div>
      );
    } else if (fieldType === 'select') {
      return (
        <div key={fieldName}>
          <label>{labelName}</label>
          <FSelect
            options={item.options || []}
            value={values[fieldName]}
            onChange={(value) => handleValueChange(fieldName, value)}
          />
          {error && <p>{error}</p>}
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
        <React.Fragment key={item.fieldName}>{renderFormItem(item)}</React.Fragment>
      ))}
    </div>
  );

});

export default FormConfig;

