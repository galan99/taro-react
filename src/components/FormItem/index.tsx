import React, { useEffect, useState } from "react";
import { View } from "@tarojs/components";
import { Input, Picker, Cell } from '@nutui/nutui-react-taro';

interface FormItemProps {
  item: any;
  values: any;
  errors: any;
  handleChange: any;
  prefix?: string;
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

export const FormItem: React.FC<FormItemProps> = ({
  item,
  values,
  errors,
  handleChange,
  prefix = "",
}) => {
  const itemName = `${prefix}${item.name}`;
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    if (item.shouldHide) {
      setIsHidden(item.shouldHide(values));
    }
  }, [item.shouldHide, values]);

  if (isHidden) {
    return null;
  }

  switch (item.type) {
    case "input":
      return (
        <View key={itemName}>
          <label>{item.label}</label>
          <FInput
            value={values[itemName] || ""}
            onChange={(e) => handleChange(itemName, e)}
          />
          {errors[itemName] && <p>{errors[itemName]}</p>}
        </View>
      );
    case "select":
      return (
        <View key={itemName}>
          <label>{item.label}</label>
          <FSelect
            value={values[itemName] || ""}
            onChange={(e) => handleChange(itemName, e)}
          />
          {errors[itemName] && <p>{errors[itemName]}</p>}
        </View>
      );
    case "nested":
      return (
        <View key={itemName}>
          <label>{item.label}</label>
          {item.children?.map((child) => (
            <FormItem
              key={`${itemName}.${child.name}`}
              item={child}
              values={values}
              errors={errors}
              handleChange={handleChange}
              prefix={`${itemName}.`}
            />
          ))}
        </View>
      );
  }
};
