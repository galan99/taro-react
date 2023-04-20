import { Input } from '@nutui/nutui-react-taro'
import FildComponent from './formItem'
import Select from './Select';
import DataPicker from './DataPicker';
import UploadBar from './uploadImgMultiple';

export const InputComponent = (props) => {
  const {defaultValue, placeholder, onChange, maxlength = 100, ...other} = props;
  return <FildComponent {...other}>
    <Input
      className='fitem-input'
      name='text'
      maxlength={maxlength} 
      defaultValue={defaultValue}  
      placeholder={placeholder}
      formatter={val => val.trim()} 
      onChange={onChange}
    />
  </FildComponent>;
}

export const SelectComponent = (props) => {
    const {defaultValue, options, title, placeholder, onChange, ...other} = props;
    return <FildComponent {...other}>
      <Select
        title={title}
        options={options}
        defaultValue={defaultValue}  
        placeholder={placeholder} 
        onChange={onChange}
      />
    </FildComponent>;
 }

 export const UploaderComponent = (props) => {
  const {defaultValue = [], onChange, maxNum = 1, ...other} = props;
  return <FildComponent {...other}>
    <UploadBar
      overwriteStyle={{ height: '80px' }}
      filePath={defaultValue}
      className='upload-current-item'
      accept='image/png,image/jpg,image/jpeg'
      onResult={onChange}
      isCloseChooseImage={defaultValue.length >= maxNum}
    />
  </FildComponent>;
 }

 export const TimeComponent = (props) => {
  const {defaultValue, title, placeholder, onChange, minDate, ...other} = props;
  return <FildComponent {...other}>
    <DataPicker
      minDate={minDate}
      title={title}
      defaultValue={defaultValue}  
      placeholder={placeholder} 
      onChange={onChange}
    />
  </FildComponent>;
 }
