import { Box, SvgIcon } from "@mui/material";

export const Sun = () => (
  <SvgIcon>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24px"
      height="24px"
      viewBox="0 0 12 12"
      version="1.1"
    >
      <circle
        cx="6"
        cy="6"
        r="0.9"
        style={{ fill: "#000", strokeWidth: "0" }}
      />
      <circle
        cx="6"
        cy="6"
        r="5"
        style={{ fill: "none", stroke: "#000", strokeWidth: "0.6" }}
      />
    </svg>
  </SvgIcon>
);

export const Venus = () => (
  <SvgIcon>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24px"
      height="24px"
      viewBox="0 0 12 12"
      version="1.1"
    >
      <g id="surface1">
        <path
          style={{
            fill: "none",
            stroke: "black",
            strokeLinecap: "butt",
            strokeLinejoin: "miter",
            strokeMiterlimit: 10,
            strokeOpacity: 1,
            strokeWidth: 6,
          }}
          d="M 85 85 C 85 98.789062 73.789062 110 60 110 C 46.210938 110 35 98.789062 35 85 C 35 71.210938 46.210938 60 60 60 C 73.789062 60 85 71.210938 85 85 Z M 85 85 "
          transform="matrix(0.1,0,0,-0.1,0,12)"
        />
        <path
          style={{
            fill: "none",
            stroke: "black",
            strokeLinecap: "butt",
            strokeLinejoin: "miter",
            strokeMiterlimit: 10,
            strokeOpacity: 1,
            strokeWidth: 6,
          }}
          d="M 60 10 L 60 60 "
          transform="matrix(0.1,0,0,-0.1,0,12)"
        />
        <path
          style={{
            fill: "none",
            stroke: "black",
            strokeLinecap: "butt",
            strokeLinejoin: "miter",
            strokeMiterlimit: 10,
            strokeOpacity: 1,
            strokeWidth: 6,
          }}
          d="M 35 35 L 85 35 "
          transform="matrix(0.1,0,0,-0.1,0,12)"
        />
      </g>
    </svg>
  </SvgIcon>
);

export const Mercury = () => (
  <SvgIcon>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24px"
      height="24px"
      viewBox="0 0 12 12"
      version="1.1"
      id="svg11"
    >
      <g id="g848">
        <path
          style={{
            fill: "none",
            stroke: "#000000",
            strokeDasharray: "none",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeMiterlimit: 10,
            strokeOpacity: 1,
            strokeWidth: "0.6",
          }}
          d="M 8,5 C 8,3.8945312 7.1054688,3 6,3 4.8945312,3 4,3.8945312 4,5 4,6.1054688 4.8945312,7 6,7 7.1054688,7 8,6.1054688 8,5 Z m 0,0"
          id="path2"
        />
        <path
          style={{
            fill: "none",
            stroke: "#000000",
            strokeDasharray: "none",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeMiterlimit: 10,
            strokeOpacity: 1,
            strokeWidth: "0.6",
          }}
          d="M 8.000001,1.0000001 C 6.894532,1.0000003 6,1.8945302 6,3"
          id="path4"
        />
        <path
          style={{
            fill: "none",
            stroke: "#000000",
            strokeDasharray: "none",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeMiterlimit: 10,
            strokeOpacity: 1,
            strokeWidth: "0.6",
          }}
          d="M 6,11 V 7"
          id="path6"
        />
        <path
          style={{
            fill: "none",
            stroke: "#000000",
            strokeDasharray: "none",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeMiterlimit: 10,
            strokeOpacity: 1,
            strokeWidth: "0.6",
          }}
          d="M 4,9 H 8"
          id="path8"
        />
        <path
          style={{
            fill: "none",
            stroke: "#000000",
            strokeDasharray: "none",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeMiterlimit: 10,
            strokeOpacity: 1,
            strokeWidth: "0.6",
          }}
          d="M 3.9999991,1.0000001 C 5.105468,1.0000003 6,1.8945302 6,3"
          id="path4-3"
        />
      </g>
    </svg>
  </SvgIcon>
);

export const Moon = () => (
  <SvgIcon>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24px"
      height="24px"
      viewBox="0 0 12 12"
      version="1.1"
    >
      <path
        d="m 8.5,1 c -2.7617188,0 -5,2.2382812 -5,5 0,2.7617188 2.2382812,5 5,5 C 6.7148438,9.96875 5.6132812,8.0625 5.6132812,6 5.6132812,3.9375 6.7148438,2.03125 8.5,1 Z"
        style={{
          fill: "none",
          stroke: "black",
          strokeLinejoin: "round",
          strokeWidth: "0.6",
        }}
      />
    </svg>
  </SvgIcon>
);

export const Saturn = () => (
  <SvgIcon>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24px"
      height="24px"
      viewBox="0 0 12 12"
      version="1.1"
      style={{
        fill: "none",
        stroke: "black",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        strokeWidth: "0.6",
      }}
    >
      <path d="M 3,3 H 7" />
      <path d="M 5,1 V 6" />
      <path d="M 5,6 C 5,4.8945312 5.8945312,4 7,4 8.1054688,4 9,4.8945312 9,6 9,6.53125 8.7890625,7.0390625 8.4140625,7.4140625 7.5078125,8.3203125 7,9.71875 7,11" />
    </svg>
  </SvgIcon>
);

export const Jupiter = () => (
  <SvgIcon>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24px"
      height="24px"
      viewBox="0 0 12 12"
      version="1.1"
      style={{
        fill: "none",
        stroke: "black",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        strokeWidth: "0.6",
      }}
    >
      <path d="m 2.25,1 c 1.3398438,0.773437 2.1640625,2.203125 2.1640625,3.75 0,1.546875 -0.8242187,2.9765625 -2.1640625,3.75 h 7.5" />
      <path d="m 7.25,6 v 5" />
    </svg>
  </SvgIcon>
);

export const Mars = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24px"
    height="24px"
    viewBox="0 0 12 12"
    version="1.1"
    style={{
      fill: "none",
      stroke: "#000",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      strokeWidth: "0.6",
    }}
  >
    <circle cx="5" cy="7" r="4" />
    <path d="M 7.828125,4.171875 11,1" />
    <path d="M 9.2304688,1 H 11 v 1.7695312" />
  </svg>
);
