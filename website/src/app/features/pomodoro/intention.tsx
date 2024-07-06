import {
  useState,
  useRef,
  useEffect,
  FormEventHandler,
  ChangeEventHandler,
  KeyboardEventHandler,
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
    if (inputRef.current) {
      inputRef.current.value = transformTimerInput(renderedInput);
    }
  };
  const onKeydown: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (isNaN(Number(e.key))) {
      e.preventDefault();
      return;
    }
  };
  const onChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const s = transformTimerInput(e.currentTarget.value);
    if (inputRef.current) {
      inputRef.current.value = parseTimerInput(s);
    }
    setTimerInput(s);
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
                onChange={onChange}
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
