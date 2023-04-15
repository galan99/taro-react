import { Input, Picker, Cell } from '@nutui/nutui-react-taro';
import '@nutui/nutui-react-taro/dist/style.css'
import React, { useState, useEffect } from 'react';
import {View, Text } from "@tarojs/components"


// FormConfig.tsx
import React, { useState, useEffect } from 'react';
import { Input, Select } from 'nutui-react';

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
  options?: { label: string; value: any }[];
  api?: () => Promise<{ label: string; value: any }[]>;
  children?: FormConfigProps[];
  dependencies?: string[];
}

interface FormConfigProps {
  items: FormItemConfig[];
  initialValues?: Record<string, any>;
  onSubmit?: (values: Record<string, any>) => void;
}

const FormConfig: React.FC<FormConfigProps> = (props) => {
  const { items, initialValues, onSubmit } = props;
  const [values, setValues] = useState<Record<string, any>>(initialValues || {});
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    items.forEach((item) => {
      if (item.type === 'select' && item.api) {
        item.api().then((options) => {
          item.options = options;
        });
      }
    });
  }, [items]);

  const renderFormItem = (item: FormItemConfig) => {
    const { type, label, name, hidden } = item;

    if (hidden) return null;

    if (type === 'input') {
      return (
        <div key={name}>
          <label>{label}</label>
          <Input
            value={values[name] || ''}
            onChange={(e) => handleValueChange(name, e.target.value)}
          />
          {errors[name] && <p>{errors[name]}</p>}
        </div>
      );
    } else if (type === 'select') {
      return (
        <div key={name}>
          <label>{label}</label>
          <Select
            options={item.options || []}
            value={values[name]}
            onChange={(value) => handleValueChange(name, value)}
          />
          {errors[name] && <p>{errors[name]}</p>}
        </div>
      );
    }
  };

  const handleValueChange = (name: string, value: any) => {
    setValues((prevValues) => ({ ...prevValues, [name]: value }));

    const item = items.find((i) => i.name === name);
    if (item) {
      handleDependencies(item, value);
      validateField(item, value);
    }
  };

  const handleDependencies = (item: FormItemConfig, value: any) => {
    if (item.dependencies) {
      item.dependencies.forEach((depName) => {
        const depItem = items.find((i) => i.name === depName);
        if (depItem) {
          depItem.hidden = !value;
        }
      });
    }
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

  const handleSubmit = () => {
    const isValid = items.every((item) => {
      if (item.hidden) return true;
      return validateField(item, values[item.name]);
    });

    if (isValid && onSubmit) {
      const submittedValues = items.reduce((acc, item) => {
        if (!item.hidden) {
          acc[item.name] = values[item.name];
        }
        return acc;
      }, {} as Record<string, any>);
      onSubmit(submittedValues);
    }
  };

  return (
    <div>
      {items.map((item) => (
        <React.Fragment key={item.name}>{renderFormItem(item)}</React.Fragment>
      ))}
      <button onClick={handleSubmit}>提交</button>
    </div>
  );
};

export default FormConfig;

