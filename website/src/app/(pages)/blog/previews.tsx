"use client";

import { useEffect, useState } from "react";

import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";

import { blogPreviews } from "./blogs";

type FileTreeNode = {
  label: string;
  children: FileTreeNode[];
  path: string;
};

var paths = [
  "engineering/building-the-google-timer.post",
  "engineering/building-the-blog-file-directory.post",
  "engineering/career/ok.post",
];

function buildFileTree(files: string[]) {
  let result: FileTreeNode[] = [];
  files.forEach((element) => {
    let tmp = result;
    element.split("/").forEach((e, idx) => {
      let i = tmp.find((o) => o.label === e);
      if (!i) {
        i = { label: e, children: [], path: e };
        tmp.push(i);
      }
      tmp = i.children;
    });
  });
  return result;
}

function h(root: HTMLElement, node: FileTreeNode) {
  if (typeof window !== "undefined") {
    if (!node.children.length) {
      const label = document.createElement("button");
      label.setAttribute("data-path", node.path);
      label.classList.add("leaf");
      label.innerText = node.label;
      root.append(label);
      return;
    }
    let label = document.createElement("h2");
    label.innerText = node.label;
    label.classList.add("directory");
    let container = document.createElement("div");
    container.setAttribute("data-directory", node.label);
    root.append(label);
    root.append(container);
    node.children.forEach((c) => {
      h(container, c);
    });
  }
}

function buildDirectoryDOM(graph: FileTreeNode[]) {
  if (typeof window !== "undefined") {
    let rootNode = document.createElement("div");
    graph.forEach((node) => {
      let r = rootNode;
      h(r, node);
    });
    return rootNode;
  }
  return null;
}

export default function BlogPreviews() {
  const [fileTreeNode, setFileTreeNode] = useState<HTMLElement | null>(null);
  useEffect(() => {
    const fileTreeNode = buildDirectoryDOM(buildFileTree(paths));
    setFileTreeNode(fileTreeNode);
  }, []);
  useEffect(() => {
    if (fileTreeNode) {
      const directoryNodes = document.getElementsByClassName("directory");
      Array.from(directoryNodes).forEach((node) => {
        node.addEventListener("click", () => {
          const sibling = node.nextElementSibling;
          if (sibling) {
            sibling.classList.toggle("hide-directory");
            console.log("classList ", sibling.classList);
          }
        });
      });
      console.log("directoryNodes ", directoryNodes);
    }
  }, [fileTreeNode]);
  return (
    <>
      <div
        data-blog="root"
        dangerouslySetInnerHTML={{
          __html: fileTreeNode ? fileTreeNode.innerHTML : "",
        }}
      />
      <Grid container>
        {blogPreviews.map(({ title, previewText, date, imgURL }) => (
          <Grid item xs={4} key={title}>
            <Card variant="outlined">
              <CardActionArea>
                <CardContent>
                  <Typography variant="h2" sx={{ fontSize: "35px", mb: 1 }}>
                    {title}
                  </Typography>
                  <Typography
                    variant="h3"
                    sx={{ fontSize: "21px", fontWeight: 100 }}
                  >
                    {previewText}
                  </Typography>
                  <Box component="img" src={imgURL} />
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
}
