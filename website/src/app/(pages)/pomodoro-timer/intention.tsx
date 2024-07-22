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
  SetStateAction,
  Dispatch,
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
import dayjs, { Dayjs } from "dayjs";
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
  createPomodoroRequest,
} from "./intention-utils";
import Timer from "./timer";
import { TimerAction } from "./types";

const initialInput = "000500";
const initialSeconds = timerArrayToSeconds(
  timerInputToTimerArray(initialInput)
);

export default function Intention({
  intention,
  worker,
  activeIntention,
  setActiveIntention,
}: {
  activeIntention: string;
  setActiveIntention: Dispatch<SetStateAction<string>>;
  intention: string;
  worker: Worker;
}) {
  const duration = useRef(initialSeconds);
  const isEditAwaitingInput = useRef(true);
  const pomodoroSpans = useRef<number[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const startDate = useRef<Dayjs>(dayjs());
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
  function setAudioSource() {
    if (audioRef.current) {
      audioRef.current.src = "time-up.m4a";
    }
  }
  const playAudioCallback = useCallback(playAudio, []);

  useEffect(() => {
    function onWorkerMessage(e: MessageEvent) {
      if (e.data.intention === intention) {
        setActiveDuration(e.data.duration);
      }
    }
    worker.addEventListener("message", onWorkerMessage);
    return () => {
      worker.removeEventListener("message", onWorkerMessage);
    };
  }, [worker, intention]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = initialInput;
    }
  }, [inputRef]);

  useEffect(() => {
    if (!activeDuration && activeIntention === intention) {
      playAudioCallback();
    }
    document.title = renderActiveTimer(activeDuration);
  }, [activeDuration, playAudioCallback, intention, activeIntention]);

  useEffect(() => {
    if (intention !== activeIntention) {
      worker.postMessage({
        action: "stopTimer",
        packet: { intention },
      });
      setTimerAction("stop");
      setSubmitButtonText("Start");
      if (inputRef.current) {
        inputRef.current.value = secondsToInputValue(activeDuration);
      }
    }
  }, [activeIntention, worker, intention, activeDuration]);

  useEffect(() => {
    const storage = Storage["localStorage"](localStorage);
    if (!activeDuration && activeIntention === intention) {
      createPomodoroRequest({
        label: intention,
        duration: duration.current,
        activeDuration: 0,
        pomodoroSpans: pomodoroSpans.current,
        storage,
        startDate: startDate.current,
      }).then(() => {
        pomodoroSpans.current = [];
        pomodoroDispatch.publish("setPomodoro");
      });
      return;
    }
    if (
      timerAction === "stop" &&
      activeIntention === intention &&
      duration.current !== activeDuration
    ) {
      createPomodoroRequest({
        label: intention,
        duration: duration.current,
        activeDuration,
        pomodoroSpans: pomodoroSpans.current,
        storage,
        startDate: startDate.current,
      }).then((res) => {
        pomodoroSpans.current = [...pomodoroSpans.current, res.elapsedTime];
        pomodoroDispatch.publish("setPomodoro");
      });
      return;
    }
  }, [activeDuration, activeIntention, intention, timerAction]);

  useEffect(() => {
    if (timerAction === "start") {
      const now = dayjs();
      startDate.current = now;
    }
  }, [timerAction]);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newTimerAction = timerAction === "stop" ? "start" : "stop";
    setIsEditMode(false);
    if (newTimerAction === "start" && inputRef.current) {
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
      setActiveIntention(intention);
    }
    if (newTimerAction === "stop" && inputRef.current) {
      inputRef.current.value = secondsToInputValue(activeDuration);
      worker.postMessage({ action: "stopTimer", packet: { intention } });
    }
    setAudioSource();
    setTimerAction(newTimerAction);
    setSubmitButtonText(submitButtonText === "Stop" ? "Start" : "Stop");
  };

  const onClickDurationContainer = () => {
    const newIsEditMode = !isEditMode;
    setIsEditMode(newIsEditMode);
    const renderedInput = renderInactiveTimer(activeDuration);
    setTimerInput(renderedInput);
    setActiveIntention(intention);
    isEditAwaitingInput.current = true;
    if (!newIsEditMode && inputRef.current) {
      worker.postMessage({
        action: "setTimerDuration",
        packet: { intention, duration: activeDuration },
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
    pomodoroSpans.current = [];
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

      isEditAwaitingInput.current = false;
      onChange(newValue);
    }
    if (isNaN(Number(e.key))) {
      e.preventDefault();
    }
  };

  const onReset = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setActiveDuration(duration.current);
    pomodoroSpans.current = [];
    if (inputRef.current) {
      inputRef.current.value = secondsToInputValue(duration.current);
    }
    worker.postMessage({
      action: "resetTimer",
      packet: { intention, duration: duration.current },
    });
    setAudioSource();
    setIsEditMode(false);
    setSubmitButtonText("Start");
    setTimerAction("stop");
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
  const onClickCreatePomodoro = () => {
    const storage = Storage["localStorage"](localStorage);
    const time = dayjs();
    const pomodoro: CreatePomodoroRequest = {
      uri: "/api/pomodoro",
      data: {
        pomodoros: [
          {
            label: intention,
            seconds: 30,
            id: uuid(),
            year: 2024,
            month: 6,
            date: 4,
            hour: 4,
          },
        ],
      },
    };
    storage.set<CreatePomodoroRequest>(pomodoro).then((v) => {
      pomodoroDispatch.publish("setPomodoro");
    });
  };
  const onClickDeleteIntention: MouseEventHandler<
    HTMLButtonElement
  > = async () => {
    const s = Storage["localStorage"](localStorage);
    await s.delete({
      uri: "/api/pomodoro/delete/intention",
      data: { intention },
    });
    pomodoroDispatch.publish("deletePomodoroIntention");
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
          onClick={onClickDeleteIntention}
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
          sx={{ position: "relative" }}
          onSubmit={onSubmit}
          onReset={onReset}
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
