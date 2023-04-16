import { Input, Picker, Cell } from '@nutui/nutui-react-taro';
import React, { useState, useEffect, useImperativeHandle, forwardRef, useMemo} from 'react';
import {View} from "@tarojs/components"
import { FormItem as FormItemComponent } from "../FormItem";

interface FormItem {
  type: 'input' | 'select' | 'nested';
  label?: string;
  name: string;
  hidden?: boolean;
  dependencies?: string[];
  shouldHide?: (values: Record<string, any>) => boolean;
  options?: { label: string; value: any }[];
  validation?: {
    required?: boolean;
    pattern?: RegExp;
    validator?: (value: any) => string | undefined;
  };
  children?: FormItem[];
}

export interface FormConfigProps {
  items: FormItem[];
  initialValues?: Record<string, any>;
}

interface FormConfigHandles {
  getValues: () => Record<string, any>;
  validate: () => boolean;
}


const FormConfig = forwardRef<FormConfigHandles, FormConfigProps>((props, ref) => {
  const { items, initialValues = {} } = props;
  const [values, setValues] = useState<Record<string, any>>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setValues(initialValues || {});
  }, [initialValues]);


  const handleChange = (name: string, value: any) => {
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  useImperativeHandle(ref, () => ({
    getValues: () => {
      const filteredValues: Record<string, any> = {};
      const formItems = [...items];

      while (formItems.length) {
        const item = formItems.shift();
        if (!item) continue;

        const itemName = item.name;

        if (item.type === 'nested' && item.children) {
          formItems.push(...item.children);
        } else if (!item.hidden || (item.shouldHide && !item.shouldHide(values))) {
          filteredValues[itemName] = values[itemName];
        }
      }

      return filteredValues;
    },
    validate: () => {
      let isValid = true;
      const newErrors: Record<string, string> = {};

      const formItems = [...items];
      while (formItems.length) {
        const item = formItems.shift();
        if (!item) continue;

        const itemName = item.name;
        const value = values[itemName];

        if (item.validation) {
          if (item.validation.required && !value) {
            isValid = false;
            newErrors[itemName] = 'This field is required';
          } else if (item.validation.pattern && !item.validation.pattern.test(value)) {
            isValid = false;
            newErrors[itemName] = 'This field does not match the pattern';
          } else if (item.validation.validator) {
            const error = item.validation.validator(value);
            if (error) {
              isValid = false;
              newErrors[itemName] = error;
            }
          }
        }

        if (item.type === 'nested' && item.children) {
          formItems.push(...item.children);
        }
      }

      setErrors(newErrors);
      return isValid;
    },
  }));

  return (
    <View>
      {items.map((item) => (
        <FormItemComponent
          key={item.name}
          item={item}
          values={values}
          errors={errors}
          handleChange={handleChange}
        />
      ))}
    </View>
  );
})

export default FormConfig;
  