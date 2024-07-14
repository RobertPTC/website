"use client";
import {
  useState,
  useRef,
  useEffect,
  KeyboardEventHandler,
  ChangeEvent,
  FormEvent,
  MouseEventHandler,
  useCallback,
} from "react";

import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { v4 as uuid } from "uuid";

import { pomodoroDispatch } from "app/dispatch";
import Storage, { CreatePomodoroRequest } from "app/storage";

import {
  parseTimerInput,
  renderActiveTimer,
  renderInactiveTimer,
  timeGroups,
  timerArrayToSeconds,
  timerInputToTimerArray,
  interpolateTimeDivisions,
  secondsToInputValue,
} from "./seconds-to-timer-array";
import Timer from "./timer";
import { TimerAction } from "./types";

const initialInput = "000500";
const initialSeconds = timerArrayToSeconds(
  timerInputToTimerArray(initialInput)
);

export default function Intention({
  intention,
  worker,
}: {
  intention: string;
  worker: Worker;
}) {
  const duration = useRef(initialSeconds);
  const isEditAwaitingInput = useRef(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [activeDuration, setActiveDuration] = useState<number>(initialSeconds);
  const [timerInput, setTimerInput] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [timerAction, setTimerAction] = useState<TimerAction>("stop");
  const [submitButtonText, setSubmitButtonText] = useState<"Start" | "Stop">(
    "Start"
  );
  const [togglePlaybackVolume, setTogglePlaybackVolume] = useState(0);
  function playAudio() {
    if (audioRef.current) {
      audioRef.current.play().catch((e) => {
        console.error(`error playing timer up audio: ${e}`);
      });
    }
  }
  const playAudioCallback = useCallback(playAudio, []);

  useEffect(() => {
    function onWorkerMessage(e: MessageEvent) {
      if (e.data.intention === intention) {
        setActiveDuration(e.data.duration);
      }
      if (!e.data.duration && e.data.intention === intention) {
        playAudioCallback();
        const storage = Storage["localStorage"](localStorage);
        const time = dayjs();
        const pomodoro: CreatePomodoroRequest = {
          uri: "/api/pomodoro",
          data: {
            pomodoro: {
              label: intention,
              seconds: duration.current,
              id: uuid(),
            },
            year: `${time.year()}`,
            month: `${time.month()}`,
            date: `${time.date()}`,
            hour: `${time.hour()}`,
          },
        };
        storage.set(pomodoro);
        pomodoroDispatch.publish("setPomodoro");
      }
      document.title = renderActiveTimer(e.data.duration);
    }
    worker.addEventListener("message", onWorkerMessage);
    return () => {
      worker.removeEventListener("message", onWorkerMessage);
    };
  }, [worker, intention, playAudioCallback]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = initialInput;
    }
  }, [inputRef]);

  const onSubmit = (
    e: FormEvent<HTMLFormElement>,
    timerAction: TimerAction
  ) => {
    e.preventDefault();
    setIsEditMode(false);
    if (timerAction === "start" && inputRef.current) {
      const seconds = timerArrayToSeconds(
        timerInputToTimerArray(inputRef.current.value)
      );
      setActiveDuration(seconds);
      worker.postMessage({
        action: "setTimerDuration",
        packet: { intention, duration: seconds },
      });
      worker.postMessage({
        action: "startTimer",
        packet: { intention },
      });
    }
    if (timerAction === "stop" && inputRef.current) {
      inputRef.current.value = secondsToInputValue(activeDuration);
      worker.postMessage({ action: "stopTimer", packet: { intention } });
    }
    if (audioRef.current) {
      audioRef.current.src = "time-up.m4a";
    }
  };
  const onClickDurationContainer = () => {
    setIsEditMode(!isEditMode);
    const renderedInput = renderInactiveTimer(activeDuration);
    setTimerInput(renderedInput);
    isEditAwaitingInput.current = true;
    if (isEditMode && inputRef.current) {
      worker.postMessage({
        action: "setTimerDuration",
        packet: { intention, duration: duration.current },
      });
      worker.postMessage({
        action: "startTimer",
        packet: { intention },
      });
      setTimerAction("start");
      setSubmitButtonText("Stop");
      inputRef.current.blur();
      return;
    }
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.value = parseTimerInput(renderedInput);
    }
    worker.postMessage({ action: "stopTimer", packet: { intention } });
    setTimerAction("stop");
    setSubmitButtonText("Start");
  };
  const onChange = (value: string, e?: ChangeEvent<HTMLInputElement>) => {
    let newValue = value;
    if (isEditMode && isEditAwaitingInput.current) {
      newValue = value[value.length - 1];
      isEditAwaitingInput.current = false;
    }
    const s = interpolateTimeDivisions(newValue);
    if (inputRef.current) {
      inputRef.current.value = parseTimerInput(s);
      const seconds = timerArrayToSeconds(
        timerInputToTimerArray(inputRef.current.value)
      );
      duration.current = seconds;
      setActiveDuration(seconds);
    }
    setTimerInput(s);
  };
  const onKeydown: KeyboardEventHandler<HTMLInputElement> = (e) => {
    const isDeleteKey = e.key === "Backspace" || e.key === "Delete";
    if (inputRef.current && isDeleteKey) {
      e.preventDefault();
      const value = inputRef.current.value;
      const newValue = isEditAwaitingInput.current
        ? "0"
        : value.substring(value.length - 1, 0);
      setActiveDuration(timerArrayToSeconds(timerInputToTimerArray(newValue)));
      isEditAwaitingInput.current = false;
      onChange(`${newValue}`);
    }
    if (isNaN(Number(e.key))) {
      e.preventDefault();
    }
  };
  const onReset: MouseEventHandler<HTMLButtonElement> = () => {
    setActiveDuration(duration.current);
    worker.postMessage({
      action: "resetTimer",
      packet: { intention, duration: duration.current },
    });
    setIsEditMode(false);
    setSubmitButtonText("Start");
    setTimerAction("stop");
    if (inputRef.current) {
      inputRef.current.value = secondsToInputValue(duration.current);
    }
  };
  const onClickTogglePlayback: MouseEventHandler<HTMLButtonElement> = () => {
    const volume = togglePlaybackVolume ? 0 : 1;
    setTogglePlaybackVolume(volume);
    if (audioRef.current && !togglePlaybackVolume) {
      audioRef.current.muted = true;
    }
    if (audioRef.current && togglePlaybackVolume) {
      audioRef.current.muted = false;
    }
  };
  const onClickPlayAudio = () => playAudio();
  const onClickDeleteIntention: MouseEventHandler<
    HTMLButtonElement
  > = async () => {
    if (window) {
      const s = Storage["localStorage"](localStorage);
      await s.delete({
        uri: "/api/pomodoro/delete/intention",
        data: { intention },
      });
      pomodoroDispatch.publish("deletePomodoroIntention");
    }
  };
  const timeRemainingDeg = duration.current
    ? 360 - (activeDuration / duration.current) * 360 - 0.0001
    : 0;
  const isMuted = !!togglePlaybackVolume;
  return (
    <Card variant="outlined">
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <CardHeader title={intention} />
        <Button
          onClick={onClickPlayAudio}
          variant="contained"
          size="small"
          color="error"
          sx={{ mr: 2 }}
        >
          Delete
        </Button>
      </Box>
      <CardContent>
        <Box
          component="form"
          display="flex"
          flexDirection="column"
          height="100%"
          justifyContent="space-between"
          onSubmit={(e) => {
            setSubmitButtonText(submitButtonText === "Stop" ? "Start" : "Stop");
            const newTimerAction = timerAction === "stop" ? "start" : "stop";
            setTimerAction(newTimerAction);
            onSubmit(e, newTimerAction);
          }}
        >
          <Box
            component="input"
            id={`${intention}-duration`}
            name="duration"
            inputMode="numeric"
            sx={{
              position: "absolute",
              height: "0px",
              opacity: 0,
              width: 0,
              left: "20px",
              top: "20px",
            }}
            pattern="\d*"
            ref={inputRef}
            onKeyDown={onKeydown}
            onChange={(e) => onChange(e.currentTarget.value, e)}
          />
          <Box display="flex" alignItems="center">
            <Box mr={1}>
              <Timer timeRemainingDeg={timeRemainingDeg} />
            </Box>
            <Box component="div" onClick={onClickDurationContainer}>
              <Typography
                sx={{
                  fontSize: "40px",
                  fontWeight: 400,
                  color:
                    isEditMode && isEditAwaitingInput.current
                      ? "gray"
                      : "inherit",
                }}
              >
                {!isEditMode &&
                  renderActiveTimer(activeDuration)
                    .split("")
                    .map((v, i) => {
                      return (
                        <Box key={i} component="span">
                          {!timeGroups.includes(v) && (
                            <Box key={i} component="span">
                              {v}
                            </Box>
                          )}
                          {timeGroups.includes(v) && (
                            <Box
                              component="span"
                              sx={{ mr: 1, fontSize: "16px" }}
                            >
                              {v}
                            </Box>
                          )}
                        </Box>
                      );
                    })}
                {isEditMode &&
                  timerInput.split("").map((v, i) => {
                    return (
                      <Box key={i} component="span">
                        {!timeGroups.includes(v) && (
                          <Box key={i} component="span">
                            {v}
                          </Box>
                        )}
                        {timeGroups.includes(v) && (
                          <Box
                            component="span"
                            sx={{ mr: 1, fontSize: "16px" }}
                          >
                            {v}
                          </Box>
                        )}
                      </Box>
                    );
                  })}
              </Typography>
            </Box>
          </Box>

          <Box display="flex">
            <Button
              type="submit"
              variant="contained"
              sx={{ mr: 2, textTransform: "capitalize" }}
              disabled={
                !activeDuration || Number(inputRef.current?.value) === 0
              }
            >
              {submitButtonText}
            </Button>
            <Button
              type="reset"
              variant="outlined"
              onClick={onReset}
              disabled={duration.current === activeDuration}
            >
              Reset
            </Button>
            <IconButton sx={{ ml: 1 }} onClick={onClickTogglePlayback}>
              {togglePlaybackVolume ? <VolumeOffIcon /> : <VolumeUpIcon />}
            </IconButton>
          </Box>
        </Box>
      </CardContent>

      <Box
        component="audio"
        id={`audio-${intention}`}
        ref={audioRef}
        muted={isMuted}
      />
    </Card>
  );
}
