import { useCallback, useEffect, useReducer } from 'react';

type Status = 'RUNNING' | 'PAUSED' | 'STOPPED';

type Config = {
  autostart: boolean;
  endTime: number | null;
  initialStatus: Status;
  initialTime: number;
  interval: number;
  onTimeOver: () => void;
  onTimeUpdate: (time: number) => void;
  step: number;
};

type ReturnValue = {
  pause: () => void;
  reset: () => void;
  start: () => void;
  status: Status;
  time: number;
};

function reducer(state, action) {
  switch (action.type) {
    case 'pause': {
      return {
        ...state,
        status: 'PAUSED',
      };
    }
    case 'reset': {
      return {
        ...state,
        status: 'STOPPED',
        time: action.payload.initialTime,
      };
    }
    case 'set': {
      return {
        ...state,
        time: action.payload.newTime,
      };
    }
    case 'start': {
      const { initialTime } = action.payload;

      return {
        ...state,
        status: 'RUNNING',
        time: state.status === 'STOPPED' ? initialTime : state.time,
      };
    }
    case 'stop': {
      return {
        ...state,
        status: 'STOPPED',
      };
    }
    default:
      return state;
  }
}


const useTimer = ({
  autostart = false,
  endTime = 0,
  initialStatus = 'STOPPED',
  initialTime = 0,
  interval = 1000,
  onTimeOver,
  onTimeUpdate,
  step = 1,
}: Partial<Config> = {}): ReturnValue =>{
  const [state, dispatch] = useReducer(reducer, {
    status: initialStatus,
    time: initialTime,
  });

  const { status, time } = state;

  const pause = useCallback(() => {
    dispatch({ type: 'pause' });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: 'reset', payload: { initialTime } });
  }, [initialTime]);

  const start = useCallback(() => {
    dispatch({ type: 'start', payload: { initialTime } });
  }, [initialTime]);

  useEffect(() => {
    if (autostart) {
      dispatch({ type: 'start', payload: { initialTime } });
    }
  }, [autostart, initialTime]);

  useEffect(() => {
    if (typeof onTimeUpdate === 'function') {
      onTimeUpdate(time);
    }
  }, [time, onTimeUpdate]);

  useEffect(() => {
    if (status !== 'STOPPED' && time === endTime) {
      dispatch({ type: 'stop' });

      if (typeof onTimeOver === 'function') {
        onTimeOver();
      }
    }
  }, [endTime, onTimeOver, time, status]);

  useEffect(() => {
    let intervalId: NodeJS.Timer | null = null;

    if (status === 'RUNNING') {
      intervalId = setInterval(() => {
        dispatch({
          type: 'set',
          payload: {
            newTime: time - step
          },
        });
      }, interval);
    } else if (intervalId) {
      clearInterval(intervalId);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [status, step, interval, time]);

  return { pause, reset, start, status, time };
};

export default useTimer

/*
import CountDown from './components/CountDown

const app = () => {
  const [toggle, setToggle] = useState<boolean>(false)
  const {time, start, pause, reset } = CountDown({initialTime: 3});

  useEffect(() => {
    start();
  }, [])

  const timeChange = () => {
    if (toggle) {
      pause()
    } else {
      start()
    }
    setToggle(!toggle)
  }

  return <View>
    <View>结束时间{time}</View>
    <Button onClick={timeChange}>开启/结束</Button>
  </View>
}

*/