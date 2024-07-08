import {
  useState,
  useRef,
  useEffect,
  FormEventHandler,
  KeyboardEventHandler,
  ChangeEvent,
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

import {
  parseTimerInput,
  renderActiveTimer,
  renderInactiveTimer,
  timeGroups,
  timerArrayToSeconds,
  timerInputToTimerArray,
  transformTimerInput,
} from "./seconds-to-timer-array";
import Timer from "./timer";
import { TimerAction } from "./types";

export default function Intention({ intention }: { intention: string }) {
  const duration = useRef(0);
  const intervalID = useRef(0);
  const isFirstDeleteKeydown = useRef(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isIntentionLogsOpen, setIsIntentionLogsOpen] = useState(false);
  const [activeDuration, setActiveDuration] = useState<number>(5 * 60);
  const [timerInput, setTimerInput] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [timerAction, setTimerAction] = useState<TimerAction>("stop");
  useEffect(() => {
    const { current } = inputRef;
    if (isEditMode && current) {
      current.focus();
      return;
    }
    if (!isEditMode && current) {
      current.blur();
      return;
    }
  }, [isEditMode]);
  const onClickAddIntentionPomodoro = () => {
    setIsIntentionLogsOpen(!isIntentionLogsOpen);
  };
  const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    setIsEditMode(false);
    if (inputRef.current) {
      setActiveDuration(
        timerArrayToSeconds(timerInputToTimerArray(inputRef.current.value))
      );
    }
  };
  const onClickDurationContainer = () => {
    setIsEditMode(!isEditMode);
    const renderedInput = renderInactiveTimer(activeDuration);
    setTimerInput(renderedInput);
    isFirstDeleteKeydown.current = true;
    if (inputRef.current) {
      inputRef.current.value = transformTimerInput(renderedInput);
    }
  };
  const onChange = (value: string, e?: ChangeEvent<HTMLInputElement>) => {
    const s = transformTimerInput(value);
    if (inputRef.current) {
      inputRef.current.value = parseTimerInput(s);
    }
    setTimerInput(s);
  };
  const onKeydown: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (inputRef.current && (e.key === "Backspace" || e.key === "Delete")) {
      e.preventDefault();
      const value = inputRef.current.value;
      const newValue = isFirstDeleteKeydown.current
        ? "0"
        : value.substring(value.length - 1, 0);
      isFirstDeleteKeydown.current = false;
      onChange(`${newValue}`);
    }
    if (isNaN(Number(e.key))) {
      e.preventDefault();
      return;
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
              onSubmit={onSubmit}
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
                <Typography sx={{ fontSize: "40px", fontWeight: 400 }}>
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
                <Button type="submit" variant="contained" sx={{ mr: 2 }}>
                  Start
                </Button>
                <Button type="reset" variant="outlined">
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
