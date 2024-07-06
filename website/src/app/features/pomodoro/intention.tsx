import { useState, useRef, useEffect, ReactEventHandler } from "react";

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
  secondsToTimerArray,
  renderActiveTimer,
  timeGroups,
} from "./seconds-to-timer-array";
import Timer from "./timer";
import { TimerAction } from "./types";

export default function Intention({ intention }: { intention: string }) {
  const [isIntentionLogsOpen, setIsIntentionLogsOpen] = useState(false);
  const [duration, setDuration] = useState<number>(5 * 60);
  const [timerAction, setTimerAction] = useState<TimerAction>("stop");
  const onClickAddIntentionPomodoro = () => {
    setIsIntentionLogsOpen(!isIntentionLogsOpen);
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
            >
              <Box
                component="input"
                id={`${intention}-duration`}
                name="duration"
                type="tel"
                sx={{
                  position: "absolute",
                  height: "0px",
                  opacity: 0,
                  width: 0,
                }}
              />
              <Box>
                <Typography sx={{ fontSize: "40px", fontWeight: 400 }}>
                  {renderActiveTimer(duration)
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
