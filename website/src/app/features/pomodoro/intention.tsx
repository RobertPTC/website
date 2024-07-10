"use client";
import {
  useState,
  useRef,
  useEffect,
  KeyboardEventHandler,
  ChangeEvent,
  FormEvent,
  SetStateAction,
  Dispatch,
  MouseEventHandler,
} from "react";

import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";

import { pomodoroDispatch } from "app/dispatch";

import {
  parseTimerInput,
  renderActiveTimer,
  renderInactiveTimer,
  timeGroups,
  timerArrayToSeconds,
  timerInputToTimerArray,
  interpolateTimeDivisions,
} from "./seconds-to-timer-array";
import Timer from "./timer";
import { TimerAction } from "./types";

const initialInput = "000500";
const initialSeconds = timerArrayToSeconds(
  timerInputToTimerArray(initialInput)
);

function setActiveDurationInterval(
  setActiveDuration: Dispatch<SetStateAction<number>>
) {
  const intervalID = setInterval(() => {
    setActiveDuration((v) => {
      return v - 1;
    });
  }, 1000);
  return intervalID;
}

export default function Intention({ intention }: { intention: string }) {
  const duration = useRef(initialSeconds);
  const intervalID = useRef<NodeJS.Timeout>();
  const isEditAwaitingInput = useRef(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isIntentionLogsOpen, setIsIntentionLogsOpen] = useState(false);
  const [activeDuration, setActiveDuration] = useState<number>(initialSeconds);
  const [timerInput, setTimerInput] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [timerAction, setTimerAction] = useState<TimerAction>("stop");
  const [submitButtonText, setSubmitButtonText] = useState<"Start" | "Stop">(
    "Start"
  );

  useEffect(() => {
    function pomodoroCountdownEnd() {
      console.log("pomodorCountdownEnd ", timerAction);
    }
    pomodoroDispatch.subscribe("pomodoroCountdownEnd", pomodoroCountdownEnd);
    return () => {
      pomodoroDispatch.unsubscribe(
        "pomodoroCountdownEnd",
        pomodoroCountdownEnd
      );
    };
  }, [timerAction]);

  useEffect(() => {
    if (!activeDuration) {
      pomodoroDispatch.publish("pomodoroCountdownEnd");
      clearInterval(intervalID.current);
    }
  }, [activeDuration]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = initialInput;
    }
  }, [inputRef]);

  const onClickAddIntentionPomodoro = () => {
    setIsIntentionLogsOpen(!isIntentionLogsOpen);
  };
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
      intervalID.current = setActiveDurationInterval(setActiveDuration);
    }
    if (timerAction === "stop" && inputRef.current) {
      inputRef.current.value = parseTimerInput(
        renderInactiveTimer(activeDuration)
      );
      clearInterval(intervalID.current);
    }
  };
  const onClickDurationContainer = () => {
    setIsEditMode(!isEditMode);
    clearInterval(intervalID.current);
    const renderedInput = renderInactiveTimer(activeDuration);
    setTimerInput(renderedInput);
    isEditAwaitingInput.current = true;
    if (isEditMode && inputRef.current) {
      intervalID.current = setActiveDurationInterval(setActiveDuration);
      setTimerAction("start");
      setSubmitButtonText("Stop");
      inputRef.current.blur();
      return;
    }
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.value = parseTimerInput(renderedInput);
    }
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
  const onReset: MouseEventHandler<HTMLButtonElement> = (e) => {
    setActiveDuration(duration.current);
    clearInterval(intervalID.current);
    setIsEditMode(false);
    setSubmitButtonText("Start");
    setTimerAction("stop");
    if (inputRef.current) {
      inputRef.current.value = parseTimerInput(
        renderInactiveTimer(duration.current)
      );
    }
  };
  return (
    <Card variant="outlined">
      <CardHeader title={intention} />
      <CardContent>
        <Grid container spacing={2}>
          <Grid item>
            <Timer />
          </Grid>
          <Grid item>
            <Box
              component="form"
              display="flex"
              flexDirection="column"
              height="100%"
              justifyContent="space-between"
              onSubmit={(e) => {
                setSubmitButtonText(
                  submitButtonText === "Stop" ? "Start" : "Stop"
                );
                const newTimerAction =
                  timerAction === "stop" ? "start" : "stop";
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
              </Box>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
      <CardActions>
        <IconButton
          aria-label={`open ${intention} logs`}
          onClick={onClickAddIntentionPomodoro}
        >
          {isIntentionLogsOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </CardActions>
    </Card>
  );
}
