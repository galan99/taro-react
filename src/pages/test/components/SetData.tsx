import React, { useState } from 'react';
import dayjs from "dayjs"

function App() {
  // 初始化一个对象，包含两个属性：propertyA 和 propertyB
  const [state, setState] = useState({ propertyA: '', propertyB: '' });

  // 更新对象的 propertyA 属性
  const updatePropertyA = (newValue) => {
    setState((prevState) => ({
      ...prevState,
      propertyA: newValue
    }));
  };

  // 异步请求示例
  const fetchDataAndUpdatePropertyB = async (propertyAValue) => {
    // 模拟异步请求
    const response = await new Promise((resolve) =>
      setTimeout(() => resolve(`新的 propertyB 值${dayjs().format('YYYY-MM-DD HH:mm:ss')}`), 1000)
    );

    // 使用函数式更新，以便在更新 propertyB 时保留 propertyA 的值
    setState((prevState) => {
      // 如果 propertyA 在此期间发生了变化，不更新 propertyB
      if (prevState.propertyA !== propertyAValue) {
        return prevState;
      }

      return {
        ...prevState,
        propertyB: response
      };
    });
  };

  const updateBothProperties = (newValueForPropertyA) => {
    // 同步更新 propertyA
    updatePropertyA(newValueForPropertyA);

    // 异步更新 propertyB
    fetchDataAndUpdatePropertyB(newValueForPropertyA);
  };

  return (
    <div>
      <input
        value={state.propertyA}
        onChange={(e) => updateBothProperties(e.target.value)}
        placeholder='输入 propertyA 的新值'
      />
      <p>propertyA: {state.propertyA}</p>
      <p>propertyB: {state.propertyB}</p>
    </div>
  );
}

export default App;
